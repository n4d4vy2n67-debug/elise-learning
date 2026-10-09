// Run with `node --test tests/v4-e2e.spec.mjs`; needs installed Chromium.
// Backend = production createAPI/core, MemoryStore and explicit local fixture auth only.
import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {startLocalServer} from './v4-local-server.mjs';
const require=createRequire(import.meta.url);
async function browser(){let pw;try{pw=require('playwright')}catch{if(!process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES)throw new Error('Playwright unavailable; browser QA not performed');pw=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright')}return pw.chromium.launch({headless:true,...(process.env.V4_CHROMIUM_EXECUTABLE?{executablePath:process.env.V4_CHROMIUM_EXECUTABLE,args:['--no-sandbox','--disable-dev-shm-usage']}: {})});}
async function finishUI(page,local,{qa=false,subject='english'}={}){
 if(qa){await page.goto(local.url+'/#qa');await page.locator('#qa-chapter').selectOption({index:local.catalogue.findIndex(c=>c.subject===subject)});await page.locator('[data-action="qa-start"]').click();}else await page.locator(`[data-action="start"][data-subject="${subject}"]:not([data-chapter])`).click();
 await page.locator('[data-action="practice"]').click();
 const state=await local.store.read((qa?'qaStudents':'students')+'/qa-local-child');const session=Object.values(state.sessions).find(s=>['practice','theory','test'].includes(s.status));assert.ok(session);
 for(let phase of ['practice','test']){
  for(let q of session[phase]){await page.getByRole('heading',{name:q.prompt,exact:true}).waitFor();if(q.options?.length)await page.getByLabel(q.options[q.correctIndex],{exact:true}).check();else await page.locator('[name="answer"]').fill(String(q.accepted[0]));await page.locator('#answer-form button[type="submit"]').click();if(phase==='practice')await page.locator('[data-action="next"]').click();}
  if(phase==='practice'){await page.locator('[data-action="test"]').click();await page.locator('#answer-form').waitFor();assert.equal(await page.locator('[data-action="help"]').count(),0);}else await page.locator('[data-action="finish"]').click();
 }
 await page.locator('[data-action="done"]').waitFor();return session;
}
test('real UI quality→normal, credits, reload history, unvalidated cloud banner',async()=>{const b=await browser(),local=await startLocalServer();try{const page=await b.newPage();let errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(local.url);await page.locator('[data-action="start"][data-subject="english"]:not([data-chapter])').waitFor();await finishUI(page,local,{qa:true});assert.match(await page.locator('#app').innerText(),/aucun point crédité/);await page.locator('[data-action="done"]').click();await finishUI(page,local);assert.match(await page.locator('#app').innerText(),/200 XP confirmés/);await page.locator('[data-action="done"]').click();await page.reload();await page.locator('[data-action="start"]').first().waitFor();let state=await local.store.read('students/qa-local-child');assert.equal(state.xp,200);assert.equal(state.history.length,1);await page.goto(local.url+'/#history');await page.locator('#app').getByText('100 %',{exact:false}).first().waitFor();assert.match(await page.locator('#mode').innerText(),/aucun service cloud validé/);assert.deepEqual(errors,[]);}finally{await b.close();await local.close()}});

async function answerPhase(page,session,phase,{wrong=false}={}){
 for(const q of session[phase]){
  await page.getByRole('heading',{name:q.prompt,exact:true}).waitFor();
  if(q.options?.length)await page.getByLabel(q.options[wrong?(q.correctIndex+1)%q.options.length:q.correctIndex],{exact:true}).check();
  else await page.locator('[name="answer"]').fill(wrong?'réponse volontairement incorrecte':String(q.accepted[0]));
  await page.locator('#answer-form button[type="submit"]').click();
  if(phase==='practice')await page.locator('[data-action="next"]').click();
 }
}
test('math UI help, resumed question, below80 retry, feedback and quota',async()=>{
 const b=await browser(),local=await startLocalServer();try{
  const page=await b.newPage({viewport:{width:834,height:1194}});await page.addInitScript(()=>{window.SpeechRecognition=undefined;window.webkitSpeechRecognition=undefined});await page.goto(local.url);
  await page.locator('[data-action="start"][data-subject="math"]:not([data-chapter])').click();
  await page.locator('[data-action="practice"]').click();
  const state=await local.store.read('students/qa-local-child');const first=Object.values(state.sessions)[0];
  await page.locator('#help-question').fill('Pourquoi moins fois moins donne plus ?');
  const helpRequest=page.waitForRequest(r=>r.url().includes('v4-api')&&r.postDataJSON()?.action==='help');
  await page.locator('[data-action="help"]').click();
  assert.equal((await helpRequest).postDataJSON().message,'Pourquoi moins fois moins donne plus ?');
  await page.locator('#help-output').getByText('Aide préparée, sans IA',{exact:true}).waitFor();
  assert.equal(await page.locator('[data-action="speak"][data-lang="fr-BE"]').count(),1);
  await page.locator('[data-action="dictate"]').click();
  assert.match(await page.locator('#dictation-status').innerText(),/écris ta question/);
  const q=first.practice[0];await page.getByRole('heading',{name:q.prompt,exact:true}).waitFor();
  if(q.options?.length)await page.getByLabel(q.options[q.correctIndex],{exact:true}).check();else await page.locator('[name="answer"]').fill(String(q.accepted[0]));
  await page.locator('#answer-form button[type="submit"]').click();await page.locator('[data-action="next"]').click();
  await page.getByRole('heading',{name:first.practice[1].prompt,exact:true}).waitFor();await page.reload();
  await page.locator('[data-action="start"][data-subject="math"]:not([data-chapter])').click();
  await page.getByRole('heading',{name:first.practice[1].prompt,exact:true}).waitFor();
  await answerPhase(page,{practice:first.practice.slice(1)},'practice');
  await page.locator('[data-action="test"]').click();await page.locator('#answer-form').waitFor();
  assert.equal(await page.locator('[data-action="help"]').count(),0);assert.equal(await page.getByText('Revoir la théorie',{exact:true}).count(),0);assert.equal(await page.locator('#help-question').count(),0);assert.equal(await page.locator('[data-action="dictate"]').count(),0);assert.equal(await page.locator('[data-action="speak"]').count(),0);
  await answerPhase(page,first,'test',{wrong:true});await page.locator('[data-action="finish"]').click();
  await page.locator('[data-action="done"]').waitFor();assert.match(await page.locator('#app').innerText(),/0 %/);assert.match(await page.locator('#app').innerText(),/100 XP confirmés/);
  await page.getByText('Donner mon avis sur la séance',{exact:true}).click();await page.locator('#difficulty').selectOption('hard');await page.locator('#comment').fill('Je voudrais revoir les nombres négatifs.');await page.locator('[data-action="feedback"]').click();await page.getByText('Ton avis a été enregistré.',{exact:true}).waitFor();
  await page.locator('[data-action="done"]').click();await page.locator('[data-action="start"][data-subject="math"]:not([data-chapter])').click();
  await page.locator('[data-action="practice"]').waitFor();let s=await local.store.read('students/qa-local-child');const retry=Object.values(s.sessions).find(x=>x.status==='theory');assert.equal(retry.chapterId,first.chapterId);assert.ok(retry.practice.every(q=>!first.practice.concat(first.test).some(p=>p.prompt===q.prompt)));
  await page.locator('[data-action="abandon"]').click();
  // A fresh subject has its own limits; passing three distinct notions blocks only that subject.
  for(let n=0;n<3;n++){await finishUI(page,local,{subject:'english'});await page.locator('[data-action="done"]').click();await page.locator('[data-action="start"][data-subject="english"]:not([data-chapter])').waitFor();}
  assert.equal(await page.locator('[data-action="start"][data-subject="english"]:not([data-chapter])').isDisabled(),true);assert.equal(await page.locator('[data-action="start"][data-subject="math"]:not([data-chapter])').isEnabled(),true);
  assert.match(await page.locator('#app').innerText(),/Mon parcours · 20 notions/);assert.match(await page.locator('#app').innerText(),/Mon parcours · 21 notions/);
  s=await local.store.read('students/qa-local-child');assert.equal(s.xp,700);assert.equal(s.history.length,4);assert.equal(s.history[0].feedback.difficulty,'hard');
  const {mkdir}=await import('node:fs/promises');await mkdir('test-results',{recursive:true});await page.screenshot({path:'test-results/v4-ipad-home.png',fullPage:true});
 }finally{await b.close();await local.close()}
});
test('missing production configuration gives error, never fictitious dashboard',async()=>{
 const b=await browser(),local=await startLocalServer();try{const page=await b.newPage();await page.route('**/.netlify/functions/v4-api',route=>route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({error:'V4 Firebase non configuré'})}));await page.goto(local.url);await page.getByText('V4 Firebase non configuré',{exact:true}).waitFor();assert.equal(await page.locator('[data-action="start"]').count(),0);assert.equal(await page.locator('[data-action="reload"]').count(),1);}finally{await b.close();await local.close()}
});
test('reward UI child request, linked parent refund and Snap age confirmation',async()=>{
 const b=await browser(),local=await startLocalServer({fixtureAuthenticate:async header=>header==='Bearer qa-local-parent'?{uid:'qa-local-parent',parent:true,studentUids:['qa-local-child']}:{uid:'qa-local-child'}});try{
  await local.store.transact('students/qa-local-child',s=>{s.xp=11000;s.totalEarned=11000});
  const child=await b.newPage();await child.goto(local.url+'/#rewards');await child.locator('[data-action="redeem"][data-id="screen15"]').click();await child.getByText('En attente du parent',{exact:false}).waitFor();
  const parent=await b.newPage();await parent.route('**/.netlify/functions/v4-api',route=>route.continue({headers:{...route.request().headers(),authorization:'Bearer qa-local-parent'}}));await parent.goto(local.url+'/#parent');
  await parent.locator('[data-action="rejectReward"]').click();await parent.getByText('Aucune demande à examiner.',{exact:true}).waitFor();assert.equal((await local.store.read('students/qa-local-child')).xp,11000);
  await child.reload();await child.locator('[data-action="redeem"][data-id="snap"]').click();await child.getByText('En attente du parent',{exact:false}).waitFor();
  await parent.reload();await parent.locator('[data-action="approveReward"]').click();await parent.getByText('Confirme qu’Élise a au moins 13 ans avant d’approuver l’accès Snap.',{exact:true}).waitFor();
  let state=await local.store.read('students/qa-local-child');assert.equal(Object.values(state.rewardRequests).find(r=>r.rewardId==='snap').status,'pending');
  await parent.locator('[data-age-confirm]').check();await parent.locator('[data-action="approveReward"]').click();await parent.getByText('Aucune demande à examiner.',{exact:true}).waitFor();state=await local.store.read('students/qa-local-child');assert.equal(state.xp,1000);assert.equal(Object.values(state.rewardRequests).find(r=>r.rewardId==='snap').status,'approved');
 }finally{await b.close();await local.close()}
});
