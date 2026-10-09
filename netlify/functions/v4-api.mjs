import {createAPI} from '../../v4/server/api.mjs';
import {FirestoreStore} from '../../v4/server/store.mjs';
import {createCoach} from '../../v4/server/coach.mjs';
import {createNotifier,verifiedRecipients} from '../../v4/server/notifications.mjs';
let api;
async function initialise(){
  const environment=process.env.V4_ENVIRONMENT??process.env.V4_ENV??'production';
  if(!['production','qa'].includes(environment))throw new Error('Invalid deployed V4 environment');
  if(!process.env.V4_PRODUCTION_PROJECT_ID||!process.env.V4_FIREBASE_PUBLIC_API_KEY)throw new Error('V4 project configuration required');
  if(!process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT)throw new Error('V4 server persistence is not configured');
  const service=JSON.parse(process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT);
  if(environment==='production'&&service.project_id!==process.env.V4_PRODUCTION_PROJECT_ID)throw new Error('Production Firebase project mismatch');
  if(environment==='qa'&&(!process.env.V4_QA_PROJECT_ID||service.project_id!==process.env.V4_QA_PROJECT_ID||service.project_id===process.env.V4_PRODUCTION_PROJECT_ID))throw new Error('Isolated QA Firebase project required');
  const [{initializeApp,cert,getApps},{getAuth},{getFirestore},{mathChapters,generateMath},{englishChapters,generateEnglish}]=await Promise.all([import('firebase-admin/app'),import('firebase-admin/auth'),import('firebase-admin/firestore'),import('../../v4/content/math.mjs'),import('../../v4/content/english.mjs')]);
  const app=getApps().find(x=>x.name==='v4')??initializeApp({credential:cert(service)},'v4'), db=getFirestore(app);
  const catalogue=[...mathChapters.map(c=>({...c,subject:'math',theory:c.theoryHtml??c.theory,generate:(seed,{previousFingerprints})=>generateMath(c.id,{seed,avoidFingerprints:previousFingerprints})})),...englishChapters.map(c=>({...c,subject:'english',theory:c.theoryHtml??c.theory,generate:(seed,{previousFingerprints})=>generateEnglish(c.id,{seed,avoidFingerprints:previousFingerprints})}))];
  const authenticate=async header=>{if(!header.startsWith('Bearer '))throw new Error('Authentication token required');const token=await getAuth(app).verifyIdToken(header.slice(7),true),profile=await db.collection('profiles').doc(token.uid).get(),p=profile.data()??{};return {uid:token.uid,anonymous:token.firebase?.sign_in_provider==='anonymous',parent:p.role==='parent',admin:p.role==='admin',studentUids:p.studentUids??[]};};
  const store=new FirestoreStore(db);
  // QA uses a separate qaStudents namespace; an optional project can override it.
  let qaStore=store;
  if(environment==='production'&&process.env.FIREBASE_QA_SERVICE_ACCOUNT){
    const qaCredential=JSON.parse(process.env.FIREBASE_QA_SERVICE_ACCOUNT);
    if(!process.env.V4_QA_PROJECT_ID||qaCredential.project_id!==process.env.V4_QA_PROJECT_ID||qaCredential.project_id===service.project_id)throw new Error('Separate QA Firebase project required');
    const qaApp=getApps().find(x=>x.name==='v4-qa')??initializeApp({credential:cert(qaCredential)},'v4-qa');qaStore=new FirestoreStore(getFirestore(qaApp));
  }
  const recipient=uid=>verifiedRecipients(db,uid);
  const notify=environment==='production'?createNotifier({store,recipient,apiKey:process.env.RESEND_API_KEY,from:process.env.V4_EMAIL_FROM}):null;
  return createAPI({store,qaStore,notify,authenticate,catalogue,environment,coach:createCoach({apiKey:process.env.OPENAI_API_KEY,model:process.env.V4_COACH_MODEL}),publicConfig:{notificationsConfigured:!!notify,coachConfigured:!!process.env.OPENAI_API_KEY,firebase:{apiKey:process.env.V4_FIREBASE_PUBLIC_API_KEY,projectId:service.project_id},configured:true}});
}
export const handler=async event=>{try{api??=await initialise();return await api(event);}catch{ return {statusCode:503,headers:{'Content-Type':'application/json','Cache-Control':'no-store'},body:JSON.stringify({ok:false,error:'V4 backend unavailable: configuration required'})};}};
