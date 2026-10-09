import {randomUUID} from 'node:crypto';
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const RETRY_WINDOW=23*60*60*1000;
export function createNotifier({store,recipient,apiKey,from,fetchImpl=fetch,clock=()=>Date.now()}){
  if(!apiKey||!from)return null;
  return async (key,{maxEvents=2,deadline=Infinity}={})=>{
    if(!/^students\/[^/]+$/.test(key))throw new Error('Normal student notification key required');
    const recipients=[...new Set(await recipient(key.split('/')[1]))].sort();
    if(!recipients.length)throw new Error('Verified parent recipient is not configured');
    const pending=await store.transact(key,s=>s.notifications.filter(x=>['pending','failed','sending'].includes(x.status)).map(x=>x.id));
    let attempted=0;
    for(const id of pending){
      if(attempted>=maxEvents||clock()+6000>deadline)break;
      const claim=randomUUID();
      const event=await store.transact(key,s=>{
        const e=s.notifications.find(x=>x.id===id),now=clock();
        if(!e||!['pending','failed','sending'].includes(e.status)||e.leaseUntil>now||e.nextAttemptAt>now)return null;
        if(e.firstAttemptAt!==undefined&&now-e.firstAttemptAt>=RETRY_WINDOW){e.status='review';e.error='Retry window expired; reconcile provider status before resending';return null;}
        if(e.emailBody&&e.emailBody.to.some(email=>!recipients.includes(email))){e.status='review';e.error='Recipient authorization changed';return null;}
        const h=e.history,r=e.result;
        const html=`<h2>Élise : ${e.type==='start'?'entraînement commencé':'séance terminée'}</h2><p>Séance ${escape(e.sessionId)}</p>${r?`<p>Mini-test : ${r.score}% — ${r.earned} XP</p><p>Entraînement : ${r.practiceCorrect}/10 ; test : ${r.testCorrect}/5</p>`:''}${h?`<p>Durées : théorie ${Math.round(h.durations.theory/1000)} s ; entraînement ${Math.round(h.durations.practice/1000)} s ; test ${Math.round(h.durations.test/1000)} s ; total ${Math.round(h.durations.total/1000)} s.</p>`:''}`;
        e.emailBody??={from,to:recipients,subject:`Élise — ${e.type==='start'?'entraînement commencé':'bilan de séance'}`,html};
        e.firstAttemptAt??=now;e.status='sending';e.claim=claim;e.leaseUntil=now+30000;e.attempts=(e.attempts??0)+1;
        return structuredClone(e);
      });
      if(!event)continue;attempted++;
      try{
        const response=await fetchImpl('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json','Idempotency-Key':event.id},signal:AbortSignal.timeout(5000),body:JSON.stringify(event.emailBody)});
        if(!response.ok)throw new Error('Email provider rejected request');const payload=await response.json();
        if(typeof payload.id!=='string'||!payload.id)throw new Error('Email provider acceptance missing');
        await store.transact(key,s=>{const e=s.notifications.find(x=>x.id===event.id);if(e?.claim===claim){e.status='accepted';e.providerId=payload.id;e.acceptedAt=clock();e.leaseUntil=0;delete e.error;}});
      }catch{await store.transact(key,s=>{const e=s.notifications.find(x=>x.id===event.id);if(e?.claim===claim){e.status='failed';e.error='Email provider unavailable';e.leaseUntil=0;e.nextAttemptAt=clock()+Math.min(60*60*1000,60000*2**Math.min(e.attempts-1,6));}});}
    }
    return {attempted};
  };
}
export async function verifiedRecipients(db,uid){
  const student=(await db.collection('profiles').doc(uid).get()).data()??{},emails=[];
  for(const parentUid of student.parentUids??[]){const p=(await db.collection('profiles').doc(parentUid).get()).data();if(p?.role==='parent'&&p.studentUids?.includes(uid)&&typeof p.notificationEmail==='string'&&p.notificationEmailVerified===true)emails.push(p.notificationEmail);}
  return emails;
}
