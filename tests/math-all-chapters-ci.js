const fs=require("fs"),vm=require("vm"),assert=require("assert"),p="elise-learning-v1-deployable 2/";
const ctx={window:{},Math};vm.createContext(ctx);
for(const f of ["catalog-math.js","enrich-math.js","math-variety-v323.js","math-priorities-advanced.js"])vm.runInContext(fs.readFileSync(p+f,"utf8"),ctx,{filename:f});
const cat=ctx.window.ELISE_CATALOG_MATH,gens=ctx.window.ELISE_EXTRA.math,families=ctx.window.ELISE_MATH_FAMILIES;
assert.equal(cat.length,20);let report=[];
for(const item of cat){assert.equal(typeof gens[item.id],"function",item.id);let qs=Array.from({length:60},()=>gens[item.id]()),unique=new Set(qs.map(q=>q.t));assert(unique.size>=8,item.id+" repeated questions");for(const q of qs){assert(q.t&&q.e,item.id+" missing explanation");if(q.type==="text"){assert(q.accept?.length,item.id+" missing answer");}else{assert(q.a?.length>=2&&Number.isInteger(q.c)&&q.c>=0&&q.c<q.a.length,item.id+" invalid choices");assert.equal(new Set(q.a).size,q.a.length,item.id+" duplicate choices")}}if(item.id!=="priorities")assert(families[item.id]>=4,item.id+" insufficient families");report.push(item.id+":"+unique.size)}
const html=fs.readFileSync(p+"index.html","utf8");assert(html.includes("math-variety-v323.js?v=3.2.3"));assert(html.indexOf("math-variety-v323.js")<html.indexOf("engine-v31.js"));
console.log("QA PASS 20 math chapters, 60 questions each: "+report.join(" "));
