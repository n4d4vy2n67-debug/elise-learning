const fs=require("fs"),vm=require("vm"),assert=require("assert"),p="elise-learning-v1-deployable 2/";
const ctx={window:{},Math};vm.createContext(ctx);vm.runInContext(fs.readFileSync(p+"math-priorities-advanced.js","utf8"),ctx);
const gen=ctx.window.ELISE_EXTRA.math.priorities;
let seen=new Set(),patterns={paren:0,power:0,negative:0,absolute:0};
for(let i=0;i<120;i++){let q=gen();assert.equal(q.type,"text");assert(q.accept.length===1);assert(Number.isFinite(Number(q.accept[0])));seen.add(q.t);if(q.t.includes("("))patterns.paren++;if(/[²³]/.test(q.t))patterns.power++;if(q.t.includes("−"))patterns.negative++;if(q.t.includes("|"))patterns.absolute++}
assert(seen.size>=100,"too few variants");for(let [k,n] of Object.entries(patterns))assert(n>=15,k+" insufficient: "+n);
let h=fs.readFileSync(p+"index.html","utf8");assert(h.includes('math-priorities-advanced.js?v=3.2.3'));assert(h.indexOf("math-priorities-advanced.js")<h.indexOf("engine-v31.js"));
console.log("PASS Math teacher advanced priorities: "+seen.size+" unique/120; "+JSON.stringify(patterns));
