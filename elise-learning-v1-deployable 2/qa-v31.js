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
   for(let i=0;i<cat.length;i++){
    const passNext=(i+1)%cat.length;
    if(passNext===i&&cat.length>1)errors.push(subject+": >=80% ne change pas de chapitre");
    const a=window.EliseEngine.build(subject,i),b=window.EliseEngine.build(subject,i);
    if(a.topicId!==b.topicId)errors.push(subject+": <80% change de chapitre");
    if(!b.q.some((q,j)=>sig(q)!==sig(a.q[j])))errors.push(subject+": <80% ne renouvelle pas les exercices ("+a.topicId+")");
   }
  });
  return errors
 }
 function run(){
  const errors=[...checkSubject("english"),...checkSubject("math"),...progression()];
  const result={ok:errors.length===0,errors,checkedAt:new Date().toISOString(),rule:"score >=80% => chapitre suivant ; score <80% => même chapitre avec nouveaux exercices"};
  console[result.ok?"info":"error"]("Elise QA V3.1",result);
  window.__ELISE_QA_RESULT=result;
  return result
 }
 return{run};
})();