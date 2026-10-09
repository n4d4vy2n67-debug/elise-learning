import {applyAction} from '../core/engine.mjs';
import {planMigration,applyMigration} from './migration.mjs';
const response=(status,data)=>({statusCode:status,headers:{'Content-Type':'application/json','Cache-Control':'no-store'},body:JSON.stringify(data)});
export function createAPI({store,authenticate,catalogue,clock=()=>Date.now(),qaStore=null,environment='production',coach,notify,publicConfig={}}){
  return async event=>{
    try{
      if(event.httpMethod!=='POST')return response(405,{ok:false,error:'POST required'});
      if(!event.body||Buffer.byteLength(event.body)>16384)return response(413,{ok:false,error:'Invalid request size'});
      const input=JSON.parse(event.body);
      if(input.action==='config')return response(200,{ok:true,data:{environment,qaAvailable:environment==='qa'||environment==='test'||!!qaStore,...publicConfig}});
      const auth=await authenticate(event.headers?.authorization??event.headers?.Authorization??'');
      if(!auth?.uid||auth.anonymous) return response(401,{ok:false,error:'Durable authentication required'});
      if(input.mode!==undefined&&!['normal','qa'].includes(input.mode))throw new Error('Invalid mode');
      const qa=input.mode==='qa';if(qa&&environment!=='qa'&&environment!=='test'&&!qaStore)return response(403,{ok:false,error:'QA requires isolated deployment'});
      const parentRole=auth.parent||auth.admin,links=auth.studentUids??[];
      if(input.action==='dashboard'&&parentRole&&!input.studentUid&&links.length!==1)return response(200,{ok:true,data:{actorRole:auth.admin?'admin':'parent',linkedStudents:links,selectedStudentUid:null,needsStudentSelection:true,xp:0,history:[],daily:{},catalogue:[],active:{math:null,english:null},progress:{math:null,english:null},rewards:[],redemptions:[]}});
      const target=input.studentUid??(parentRole&&links.length===1?links[0]:auth.uid);
      if(target!==auth.uid&&(!(auth.parent||auth.admin)||!auth.studentUids?.includes(target)))return response(403,{ok:false,error:'Student access denied'});
      const key=`${qa?'qaStudents':'students'}/${target}`;
      const selectedStore=qa?(qaStore??store):store;
      if(['approveReward','rejectReward','migrate'].includes(input.action)&&!auth.parent&&!auth.admin)return response(403,{ok:false,error:'Parent permission required'});
      if(input.action==='migrate'){
        if(!auth.admin)return response(403,{ok:false,error:'Administrator required'});
        const plan=planMigration(input.source,{chapterMapping:input.chapterMapping,catalogue});
        if(input.dryRun!==false)return response(200,{ok:true,data:{dryRun:true,plan}});
        if(environment==='production')throw new Error('Production migration requires controlled operator job');
        const data=await selectedStore.transact(key,s=>applyMigration(s,plan,{backupVerified:input.backupVerified,identityVerified:input.identityVerified}));return response(200,{ok:true,data});
      }
      const data=await selectedStore.transact(key,state=>applyAction(state,input,{catalogue,at:clock(),qa}));
      if(input.action==='dashboard'){data.actorRole=auth.admin?'admin':auth.parent?'parent':'student';data.linkedStudents=auth.studentUids??[];data.selectedStudentUid=target;}
      if(input.action==='help'){
        const fallback={label:'Aide préparée, sans IA',text:'Relis la règle de cette notion puis repère les éléments de la question. Essaie une étape à la fois.',ai:false};
        const help=coach?await coach({uid:target,message:String(input.message??'').slice(0,2000),...data.context}).catch(()=>fallback):fallback;
        return response(200,{ok:true,data:help});
      }
      // A delivery failure never rolls back credited results. Dispatcher retains pending events.
      if(notify&&!qa&&['practice','finish'].includes(input.action))await notify(key).catch(()=>{});
      return response(200,{ok:true,data});
    }catch(error){const message=error.message??'Request failed';const unauthorized=/token|auth|credential/i.test(message);return response(unauthorized?401:400,{ok:false,error:message});}
  };
}
