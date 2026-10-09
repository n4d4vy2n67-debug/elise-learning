import {initialState} from '../core/engine.mjs';
import {archiveMigration,restoreMigration} from './migration-archive.mjs';
export class MemoryStore {
  constructor(){this.states=new Map();this.locks=new Map();}
  async transact(key,fn){const previous=this.locks.get(key)??Promise.resolve();let release;const lock=new Promise(r=>release=r);this.locks.set(key,previous.then(()=>lock));await previous;try{const state=structuredClone(this.states.get(key)??initialState());const result=await fn(state);this.states.set(key,state);return result;}finally{release();}}
  async read(key){return structuredClone(this.states.get(key)??initialState());}
}
// Each large item is a separate document. All reads precede writes in a transaction.
export class FirestoreStore {
  constructor(db){this.db=db;}
  async transact(key,fn){
    const [namespace,uid]=key.split('/');if(!['students','qaStudents'].includes(namespace)||!uid||uid.includes('/'))throw new Error('Invalid storage key');
    const root=this.db.collection(namespace).doc(uid);
    return this.db.runTransaction(async tx=>{
      const scalar=await tx.get(root), collections=['sessions','daily','history','ledger','notifications','requests','rewardRequests'];
      const snapshots=[];for(const name of collections)snapshots.push(await tx.get(root.collection(name)));
      const state=initialState();Object.assign(state,scalar.exists?scalar.data():{});
      for(let i=0;i<collections.length;i++){const name=collections[i],docs=snapshots[i].docs;state[name]=['history','ledger','notifications'].includes(name)?docs.map(d=>d.data()).sort((a,b)=>(a.at??a.createdAt??0)-(b.at??b.createdAt??0)):Object.fromEntries(docs.map(d=>[decodeURIComponent(d.id),name==='requests'?d.data().value:d.data()]));}
      if(state.migration?.archived){const chunks=await tx.get(root.collection('migrationArchive'));state.migration=restoreMigration(state.migration,chunks.docs.map(d=>d.data()));}
      const before=structuredClone(state),result=await fn(state),core={...state};for(const name of collections)delete core[name];
      const writes=[];
      if(state.migration){const archive=archiveMigration(state.migration);core.migration=archive.pointer;if(!scalar.data()?.migration?.archived||JSON.stringify(before.migration)!==JSON.stringify(state.migration)){for(const chunk of archive.chunks)writes.push([root.collection('migrationArchive').doc(String(chunk.index).padStart(4,'0')),chunk]);}}
      writes.push([root,core]);
      for(const name of collections){const entries=Array.isArray(state[name])?state[name].map(x=>[x.id,x]):Object.entries(state[name]);for(const [id,value]of entries){const old=Array.isArray(before[name])?before[name].find(x=>x.id===id):before[name][id];if(JSON.stringify(old)!==JSON.stringify(value))writes.push([root.collection(name).doc(encodeURIComponent(id)),name==='requests'?{value}:value]);}}
      if(writes.length>450)throw new Error('Transaction capacity exceeded; staged operator import required');
      if(writes.some(([,value])=>Buffer.byteLength(JSON.stringify(value),'utf8')>900000))throw new Error('Document capacity exceeded; split oversized source records before import');
      const payloadBytes=writes.reduce((total,[ref,value])=>total+Buffer.byteLength(JSON.stringify(value),'utf8')+Buffer.byteLength(ref.path??'','utf8')+4096,0);
      if(payloadBytes>=5*1024*1024)throw new Error('Transaction byte capacity exceeded; staged operator import required');
      for(const [ref,value]of writes)tx.set(ref,value);
      return result;
    });
  }
}
