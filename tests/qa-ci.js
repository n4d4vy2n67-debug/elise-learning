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
