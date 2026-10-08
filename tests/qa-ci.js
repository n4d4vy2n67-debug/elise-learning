const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.join(__dirname,'..','elise-learning-v1-deployable 2');
global.window=global;
for(const f of ['catalog-english.js','catalog-math.js','enrich-english.js','enrich-math.js','pilot-generators.js','engine-v31.js','teacher-rules.js','pedagogy-orchestrator.js','qa-v31.js']){
  vm.runInThisContext(fs.readFileSync(path.join(root,f),'utf8'),{filename:f});
}
const r=window.EliseQA.run();
if(!r.ok){console.error(JSON.stringify(r,null,2));process.exit(1)}
console.log('QA PASS',JSON.stringify({rule:r.rule,checkedAt:r.checkedAt}));

for(const subject of ["english","math"]){const first=EliseEngine.build(subject,0),avoid=first.q.map(q=>String(q.t).replace(/^TEST · /,""));let threw=false;try{const retry=EliseEngine.build(subject,0,{retry:true,avoidQuestions:avoid,focusErrors:[{question:"target error"}]});if(retry.topicIndex!==0)throw new Error(subject+" retry moved topic");if(retry.q.some(q=>avoid.includes(String(q.t).replace(/^TEST · /,""))))throw new Error(subject+" retry reused seen question");if(!retry.q.every(q=>q.retryFocus==="target error"))throw new Error(subject+" retry lost error focus");}catch(e){threw=true;if(!/Insufficient fresh exercise variants/.test(String(e.message)))throw e;} if(threw)console.log(subject+" correctly fails closed when fresh variants are insufficient");}

// Strict coverage: every catalog notion must generate a complete fresh retry series.
for(const subject of ['english','math']){
 const cat=subject==='english'?window.ELISE_CATALOG_EN:window.ELISE_CATALOG_MATH;
 for(let idx=0;idx<cat.length;idx++){
  const first=EliseEngine.build(subject,idx);
  if(first.q.length!==15)throw new Error(`${subject}/${idx}: expected 15 questions`);
  const seen=first.q.map(q=>String(q.t).replace(/^TEST · /,''));
  const retry=EliseEngine.build(subject,idx,{retry:true,avoidQuestions:seen,focusErrors:[{question:seen[0]}]});
  if(retry.q.length!==15||retry.q.some(q=>seen.includes(String(q.t).replace(/^TEST · /,''))))throw new Error(`${subject}/${idx}: retry is not fresh`);
  if(first.title!==retry.title||first.topicId!==retry.topicId)throw new Error(`${subject}/${idx}: topic mismatch`);
 }
}
console.log('STRICT 41-TOPIC RETRY QA PASS');
