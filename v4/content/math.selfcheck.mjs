import assert from 'node:assert/strict';
import {mathChapters,generateMath} from './math.mjs';
assert.equal(mathChapters.length,20);
assert.equal(new Set(mathChapters.map(c=>c.id)).size,20);
const visited=new Set();
for(const c of mathChapters){
 for(const prerequisite of c.prerequisites)assert.ok(visited.has(prerequisite),`Prerequisite ${prerequisite} must precede ${c.id}`);
 visited.add(c.id);assert.equal(c.families.length,5);assert.ok(c.theoryHtml&&c.examples.length&&c.objective);
}
// Evaluate only generator-owned polynomial strings, never user answers.
const evaluate=(expression,x)=>Function(`return (${expression.replace(/−/g,'-').replace(/²/g,'**2').replace(/(\d)x/g,'$1*x').replace(/(\d)\(/g,'$1*(').replace(/\bx\b/g,`(${x})`)});`)();
let checked=0;
for(const chapter of mathChapters)for(let seed=0;seed<100;seed++){
 let avoid=[];
 for(let cycle=0;cycle<6;cycle++){
  const request={seed:`check-${seed}-${cycle}`,avoidFingerprints:avoid};
  const questions=generateMath(chapter.id,request);
  assert.deepEqual(questions,generateMath(chapter.id,request),'Generation must be deterministic');
  assert.equal(questions.length,15);assert.equal(questions.filter(q=>q.stage==='practice').length,10);
  assert.equal(questions.filter(q=>q.stage==='test').length,5);
  assert.equal(new Set(questions.map(q=>q.fingerprint)).size,15);
  assert.deepEqual(new Set(questions.filter(q=>q.stage==='test').map(q=>q.family)),new Set(chapter.families.map(f=>f.id)));
  for(const q of questions){
   assert.ok(!avoid.includes(q.fingerprint));assert.ok(q.accepted.length&&q.explanation&&q.skills.length);
   assert.ok(q.accepted.every(a=>!/NaN|Infinity|undefined/.test(a)));
   if(q.type==='choice'){
    assert.equal(new Set(q.options).size,q.options.length);assert.equal(q.options[q.correctIndex],q.accepted[0]);
    if(['literal','distributivity'].includes(chapter.id)){
     const correct=q.options[q.correctIndex];
     const equivalent=q.options.filter(option=>[0,2,7].every(x=>evaluate(option,x)===evaluate(correct,x)));
     assert.equal(equivalent.length,1,`Ambiguous polynomial options: ${q.prompt}`);
    }
   }
   checked++;
  }
  avoid.push(...questions.map(q=>q.fingerprint));
 }
}
assert.throws(()=>generateMath('missing'),/Unknown/);
console.log(`Maths self-check: ${checked} generated questions; 20 chapters, 100 families, 100 six-session seeds, topological prerequisites, distinct polynomial choices.`);
