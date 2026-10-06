const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.join(__dirname,'..','elise-learning-v1-deployable 2');
global.window=global;
for(const f of ['catalog-english.js','catalog-math.js','enrich-english.js','enrich-math.js','pilot-generators.js','engine-v31.js','qa-v31.js']){
  vm.runInThisContext(fs.readFileSync(path.join(root,f),'utf8'),{filename:f});
}
const r=window.EliseQA.run();
if(!r.ok){console.error(JSON.stringify(r,null,2));process.exit(1)}
console.log('QA PASS',JSON.stringify({rule:r.rule,checkedAt:r.checkedAt}));
