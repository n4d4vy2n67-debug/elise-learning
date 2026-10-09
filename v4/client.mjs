import {token,configureAuth,user} from './auth.mjs';
const endpoint='/.netlify/functions/v4-api';
export let configuration={};
let selectedStudentUid=null;
export function selectStudent(uid){selectedStudentUid=uid||null}
export function selectedStudent(){return selectedStudentUid}
export async function api(action,payload={}){
 const idToken=action==='config'?null:configuration.localTest&&['localhost','127.0.0.1','::1'].includes(location.hostname)?configuration.fixtureToken:await token();let response;
 try{response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json',...(idToken?{Authorization:`Bearer ${idToken}`}:{})},body:JSON.stringify({action,...(action!=='config'&&selectedStudentUid?{studentUid:selectedStudentUid}:{}),...payload})})}catch{throw new Error('Connexion interrompue. Tes réponses en attente sont conservées sur cet appareil. Reconnecte-toi pour les envoyer.');}
 let data;try{data=await response.json()}catch{throw new Error('Le service V4 n’est pas disponible sur ce déploiement.');}
 if(!response.ok||data.error){const error=new Error(typeof data.error==='string'?data.error:data.error?.message||data.message||'Action indisponible.');error.code=data.code||data.error?.code;throw error;}
 return data.data??data;
}
export async function init(){configuration=await api('config');configureAuth(configuration.firebase||configuration.firebaseConfig||configuration.firebaseWebConfig);return configuration;}
export function requestId(){return crypto.randomUUID()}
const pendingKey=()=>`elise-v4-pending:${user()?.uid||(configuration.localTest?'local-fixture':'unconnected')}:${selectedStudentUid||'self'}`;
const readPending=key=>{try{return JSON.parse(localStorage.getItem(key)||'null')}catch{return null}};
const modeOf=item=>item?.mode||'normal';
export function savePending(item){const key=pendingKey()+(modeOf(item)==='qa'?':qa':'');localStorage.setItem(key,JSON.stringify({...item,...(selectedStudentUid?{studentUid:selectedStudentUid}:{})}))}
export function pending(mode='normal'){const key=pendingKey(),item=readPending(key+(mode==='qa'?':qa':''));if(item&&modeOf(item)===mode)return item;const legacy=readPending(key);return legacy&&modeOf(legacy)===mode?legacy:null}
export function clearPending(mode='normal'){const key=pendingKey();if(mode==='qa')localStorage.removeItem(key+':qa');if(modeOf(readPending(key))===mode)localStorage.removeItem(key)}
