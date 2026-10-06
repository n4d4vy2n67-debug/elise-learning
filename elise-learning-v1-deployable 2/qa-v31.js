window.EliseQA=(()=>{
 function sig(q){return q.t+"|"+(q.type==="text"?(q.accept||[]).join("/"):(q.a||[]).join("/"))}
 function checkSubject(subject){
  const cat=subject==="english"?window.ELISE_CATALOG_EN:window.ELISE_CATALOG_MATH;
  const errors=[];
  cat.forEach((item,i)=>{
   const a=window.EliseEngine.build(subject,i),b=window.EliseEngine.build(subject,i);
   if(a.topicId!==item.id)errors.push(item.id+": mauvais chapitre");
   if(a.q.length!==15)errors.push(item.id+": "+a.q.length+" questions au lieu de 15");
   if(a.q.slice(0,10).some(q=>q.t.startsWith("TEST · ")))errors.push(item.id+": test dans entraînement");
   if(a.q.slice(10).some(q=>!q.t.startsWith("TEST · ")))errors.push(item.id+": mini-test mal balisé");
   const unique=new Set(a.q.map(sig)).size;
   if(unique<Math.min(10,a.q.length))errors.push(item.id+": variété faible ("+unique+"/15)");
   if(!b.q.some((q,j)=>sig(q)!==sig(a.q[j])))errors.push(item.id+": nouvelle séance identique");
  });
  return errors
 }
 function progression(){
  const errors=[];
  ["english","math"].forEach(subject=>{
   const cat=subject==="english"?window.ELISE_CATALOG_EN:window.ELISE_CATALOG_MATH;
   [5,4,3].forEach(correct=>{
    const pct=Math.round(correct/5*100),start=0,next=pct>=80?1:0;
    if(pct>=80&&next===start)errors.push(subject+": "+pct+"% devrait avancer");
    if(pct<80&&next!==start)errors.push(subject+": "+pct+"% devrait rester");
    const before=window.EliseEngine.build(subject,start),after=window.EliseEngine.build(subject,next);
    if(pct>=80&&after.topicId===before.topicId)errors.push(subject+": "+pct+"% ne change pas de chapitre");
    if(pct<80){
     if(after.topicId!==before.topicId)errors.push(subject+": "+pct+"% change de chapitre");
     if(!after.q.some((q,j)=>sig(q)!==sig(before.q[j])))errors.push(subject+": "+pct+"% garde les mêmes exercices");
    }
   });
  });
  return errors
 }
 function testIsolation(){
  const errors=[],fake={xp:1800,sessions:7,englishTopicV31:2,mathTopicV31:3};
  ["english","math"].forEach(subject=>{
   [5,4,3].forEach(correct=>{
    const copy=JSON.parse(JSON.stringify(fake)),pct=correct*20,tempStart=copy[subject+"TopicV31"],tempEnd=pct>=80?tempStart+1:tempStart;
    if(copy.xp!==fake.xp||copy.sessions!==fake.sessions||copy[subject+"TopicV31"]!==fake[subject+"TopicV31"])errors.push(subject+": le mode Test modifie le profil réel");
    if(pct>=80&&tempEnd===tempStart)errors.push(subject+": Test "+pct+"% devrait avancer temporairement");
    if(pct<80&&tempEnd!==tempStart)errors.push(subject+": Test "+pct+"% devrait rester temporairement");
   });
  });
  return errors
 }
 function fullCatalogWalk(){
  const errors=[],report={};
  ["english","math"].forEach(subject=>{
   const cat=subject==="english"?window.ELISE_CATALOG_EN:window.ELISE_CATALOG_MATH,visited=[];
   for(let i=0;i<cat.length;i++){
    const before=window.EliseEngine.build(subject,i),retry=window.EliseEngine.build(subject,i),next=window.EliseEngine.build(subject,i+1);
    visited.push(before.topicId);
    if(i<cat.length-1&&next.topicId===before.topicId)errors.push(subject+": 80%+ n'avance pas après "+before.topicId);
    if(retry.topicId!==before.topicId)errors.push(subject+": <80% quitte "+before.topicId);
    if(!retry.q.some((q,j)=>sig(q)!==sig(before.q[j])))errors.push(subject+": <80% ne renouvelle pas "+before.topicId);
   }
   const missing=cat.filter(x=>!visited.includes(x.id)).map(x=>x.id);
   if(missing.length)errors.push(subject+": chapitres non parcourus: "+missing.join(", "));
   report[subject]={expected:cat.length,visited:visited.length,chapters:visited};
  });
  return{errors,report}
 }
 function run(){
  const walk=fullCatalogWalk(),errors=[...checkSubject("english"),...checkSubject("math"),...progression(),...testIsolation(),...walk.errors];
  const result={ok:errors.length===0,errors,catalogWalk:walk.report,checkedAt:new Date().toISOString(),rule:"score >=80% => chapitre suivant ; score <80% => même chapitre avec nouveaux exercices"};
  console[result.ok?"info":"error"]("Elise QA V3.1",result);
  window.__ELISE_QA_RESULT=result;
  return result
 }
 return{run};
})();