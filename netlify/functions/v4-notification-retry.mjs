import {FirestoreStore} from '../../v4/server/store.mjs';
import {createNotifier,verifiedRecipients} from '../../v4/server/notifications.mjs';
// Scheduled Functions are not invokable by public URL. Production only, 30 s cap.
export const config={schedule:'*/5 * * * *'};
export default async function retry(){
  const environment=process.env.V4_ENVIRONMENT??process.env.V4_ENV??'production';
  if(environment!=='production'||!process.env.RESEND_API_KEY||!process.env.V4_EMAIL_FROM)return;
  if(!process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT||!process.env.V4_PRODUCTION_PROJECT_ID)throw new Error('Notification retry persistence unavailable');
  const service=JSON.parse(process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT);
  if(service.project_id!==process.env.V4_PRODUCTION_PROJECT_ID)throw new Error('Notification retry project mismatch');
  const [{initializeApp,cert,getApps},{getFirestore}]=await Promise.all([import('firebase-admin/app'),import('firebase-admin/firestore')]);
  const app=getApps().find(x=>x.name==='v4-retry')??initializeApp({credential:cert(service)},'v4-retry'),db=getFirestore(app);
  const notify=createNotifier({store:new FirestoreStore(db),recipient:uid=>verifiedRecipients(db,uid),apiKey:process.env.RESEND_API_KEY,from:process.env.V4_EMAIL_FROM});
  const deadline=Date.now()+20000;
  const records=await db.collectionGroup('notifications').where('status','in',['pending','failed','sending']).limit(20).get();
  const keys=[...new Set(records.docs.map(d=>d.ref.path.split('/').slice(0,2).join('/')).filter(k=>/^students\/[^/]+$/.test(k)))];
  let attempted=0;
  for(const key of keys){if(attempted>=2||Date.now()+6000>deadline)break;try{attempted+=(await notify(key,{maxEvents:2-attempted,deadline})).attempted;}catch{/* Missing verified recipient: preserve outbox; never expose pupil data in logs. */}}
}
