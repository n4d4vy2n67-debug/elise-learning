// Browser journey against the real local API, with explicit fixture auth/storage.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {startLocalServer} from './v4-local-server.mjs';
const local=await startLocalServer();const browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE}:{}),args:['--no-sandbox','--single-process','--disable-gpu','--no-zygote','--use-gl=angle','--use-angle=swiftshader']});
try{
 await local.store.transact('students/qa-local-child',s=>{s.xp=2400;s.progress.math=2});
 const page=await browser.newPage();page.setDefaultTimeout(10000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(local.url);await page.getByRole('heading',{name:'Bonjour Élise'}).waitFor();
 assert.equal(await page.locator('.balance strong').innerText(),'2400');assert.equal(await page.locator('.version').innerText(),'version v4');
 const realBefore=await local.store.read('students/qa-local-child');
 const pendingIsolation=await page.evaluate(async()=>{const c=await import('./client.mjs');c.savePending({mode:'normal',sessionId:'normal-offline'});c.savePending({mode:'qa',sessionId:'qa-offline'});const before=[c.pending('normal')?.sessionId,c.pending('qa')?.sessionId];c.clearPending('qa');const after=c.pending('normal')?.sessionId;c.clearPending('normal');return {before,after}});assert.deepEqual(pendingIsolation,{before:['normal-offline','qa-offline'],after:'normal-offline'});

 await page.getByRole('link',{name:'Test qualité'}).click();await page.getByRole('heading',{name:'Test qualité',exact:true}).waitFor();
 assert.equal(await page.locator('#qa-chapter').count(),0);assert.equal(await page.locator('.balance').count(),0);
 await page.locator('section.math [data-action="start"]').first().click();await page.getByRole('button',{name:'Commencer les 10 exercices'}).click();
 let state=await local.store.read('qaStudents/qa-local-child');const session=Object.values(state.sessions)[0];
 assert.equal(session.chapterId,local.catalogue.find(c=>c.subject==='math').id);
 async function answer(q){await page.getByRole('heading',{name:q.prompt,exact:true}).waitFor();const value=q.options?.length?q.options[q.correctIndex]:q.accepted[0];if(q.options?.length)await page.getByRole('radio',{name:value,exact:true}).check();else await page.locator('[name="answer"]').fill(value);await page.getByRole('button',{name:'Valider ma réponse'}).click();await page.waitForFunction(()=>!document.querySelector('#app').classList.contains('busy'));}
 for(const q of session.practice){await answer(q);await page.getByRole('button',{name:'Question suivante'}).click();}
 await page.getByRole('button',{name:'Commencer le mini-test'}).click();
 for(const q of session.test)await answer(q);
 await page.getByRole('button',{name:'Terminer et voir mon bilan'}).click();await page.getByText('Test qualité : aucun point crédité.',{exact:true}).waitFor();assert.equal(await page.locator('.rose-companion').getAttribute('data-motion'),'7');assert.match(await page.locator('.rose-message').innerText(),/test qualité, sans points/);
 await page.getByRole('button',{name:'Retour au test qualité',exact:true}).click();await page.getByRole('heading',{name:'Test qualité',exact:true}).waitFor();
 assert.equal(await page.locator('section.math h2').innerText(),local.catalogue.filter(c=>c.subject==='math')[1].title);
 await page.reload();await page.getByRole('heading',{name:'Test qualité',exact:true}).waitFor();assert.equal(await page.locator('section.math h2').innerText(),local.catalogue.filter(c=>c.subject==='math')[1].title);
 assert.deepEqual(await local.store.read('students/qa-local-child'),realBefore);
 await page.getByRole('button',{name:'Retour aux missions normales'}).click();await page.getByRole('heading',{name:'Bonjour Élise'}).waitFor();assert.equal(await page.locator('.balance strong').innerText(),'2400');assert.equal(await page.locator('section.math h2').innerText(),local.catalogue.filter(c=>c.subject==='math')[2].title);
 assert.deepEqual(errors,[]);console.log('PASS browser QA mission mirror, persistence, return to normal, version label, unchanged real points/progression');
}finally{await browser.close();await local.close()}
