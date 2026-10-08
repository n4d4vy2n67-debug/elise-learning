const fs=require('fs'),assert=require('assert');
const root='elise-learning-v1-deployable 2/';
const html=fs.readFileSync(root+'index.html','utf8');
const scripts=[...html.matchAll(/<script\s+src="([^"]+)"/g)].map(m=>m[1]).filter(s=>!s.startsWith('http'));
for(const src of scripts){const file=src.split('?')[0];assert(fs.existsSync(root+file),'Missing script: '+file)}
const order=['catalog-math.js','enrich-math.js','pilot-generators.js','math-variety-v323.js','math-priorities-advanced.js','engine-v31.js','v3.js'];
let last=-1;for(const name of order){const index=scripts.findIndex(s=>s.split('?')[0]===name);assert(index>last,'Incorrect script order or missing: '+name);last=index}
for(const test of ['qa-ci.js','orchestrator-ci.js','v322-ci.js','math-priorities-ci.js','math-all-chapters-ci.js','e2e.spec.js'])assert(fs.existsSync('tests/'+test),'Missing QA test: '+test);
console.log('IT preflight PASS: '+scripts.length+' local scripts, script order and QA assets');
