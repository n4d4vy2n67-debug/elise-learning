// Presentation safeguards against the actual API, never mocks lesson outcomes.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {startLocalServer} from './v4-local-server.mjs';
const local=await startLocalServer();
const browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,args:['--no-sandbox','--single-process','--disable-gpu','--no-zygote','--use-gl=angle','--use-angle=swiftshader']}: {})});
try{
 const page=await browser.newPage({viewport:{width:390,height:844}});page.setDefaultTimeout(10000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(local.url);await page.getByRole('heading',{name:'Bonjour Élise'}).waitFor();
 assert.deepEqual(await page.locator('nav a').allTextContents(),['Mes missions','Historique','Récompenses','Espace parent','Test qualité']);
 assert.equal(await page.locator('section.card.math').count(),1);assert.equal(await page.locator('section.card.english').count(),1);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 await page.locator('section.math [data-action="start"]').first().click();await page.getByRole('button',{name:'Commencer les 10 exercices'}).waitFor();
 assert.deepEqual(await page.locator('.steps span').allTextContents(),['Théorie','Entraînement','Mini-test','Bilan']);
 assert.equal(await page.locator('.rose-companion').count(),1);
 assert.equal(await page.locator('.rose-companion').getAttribute('aria-hidden'),'true');
 for(const width of [320,390,768]){await page.setViewportSize({width,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);assert.equal(await page.locator('.rose-companion').evaluate(e=>e.scrollWidth<=e.clientWidth),true);}
 await page.setViewportSize({width:390,height:844});
 await page.getByRole('button',{name:'Commencer les 10 exercices'}).click();
 let student=await local.store.read('students/qa-local-child');const session=Object.values(student.sessions)[0];
 async function fill(q,correct=true){await page.getByRole('heading',{name:q.prompt,exact:true}).waitFor();const value=q.options?.length?q.options[correct?q.correctIndex:(q.correctIndex+1)%q.options.length]:correct?q.accepted[0]:'clearly-invalid-answer';if(q.options?.length)await page.getByRole('radio',{name:value,exact:true}).check();else await page.locator('[name="answer"]').fill(value);}
 async function submit(){await page.getByRole('button',{name:'Valider ma réponse'}).click();await page.waitForFunction(()=>!document.querySelector('#app').classList.contains('busy'));}
 // Failed network cannot turn an unconfirmed answer into a celebration.
 await page.waitForFunction(()=>!document.querySelector('.rose-companion')?.classList.contains('playing'));
 await fill(session.practice[0]);await page.route('**/.netlify/functions/v4-api',route=>route.abort());await submit();
 assert.equal(await page.locator('.rose-companion.playing').count(),0);assert.equal(await page.locator('[data-motion="2"]').count(),0);assert.equal(await page.locator('.notice.success').count(),0);
 assert.equal((await local.store.read('students/qa-local-child')).xp,0);
 await page.unroute('**/.netlify/functions/v4-api');await submit();assert.equal(await page.locator('.rose-companion').getAttribute('data-motion'),'2');assert.equal((await local.store.read('students/qa-local-child')).xp,0);
 await page.getByRole('button',{name:'Question suivante'}).click();
 await fill(session.practice[1],false);await submit();assert.equal(await page.locator('.rose-companion').getAttribute('data-motion'),'3');assert.match(await page.locator('.rose-message').innerText(),/Courage/);
 if(process.env.QA_SCREENSHOT_DIR)await page.screenshot({path:process.env.QA_SCREENSHOT_DIR+'/practice.png',fullPage:true});
 await page.getByRole('button',{name:'Question suivante'}).click();
 for(const q of session.practice.slice(2)){await fill(q);await submit();await page.getByRole('button',{name:'Question suivante'}).click();}
 await page.getByRole('button',{name:'Commencer le mini-test'}).click();await page.waitForFunction(()=>document.querySelector('#app').dataset.lessonStage==='test');
 if(process.env.QA_SCREENSHOT_DIR)await page.screenshot({path:process.env.QA_SCREENSHOT_DIR+'/minitest.png',fullPage:true});
 for(const q of session.test){assert.equal(await page.locator('.rose-companion').count(),0);assert.equal(await page.locator('[data-action="help"]').count(),0);await fill(q);await submit();assert.equal(await page.locator('.notice.success').count(),0);}
 assert.equal(await page.locator('.rose-companion').count(),0);
 await page.route('**/.netlify/functions/v4-api',route=>route.abort());await page.getByRole('button',{name:'Terminer et voir mon bilan'}).click();await page.waitForFunction(()=>!document.querySelector('#app').classList.contains('busy'));
 assert.equal(await page.locator('.rose-companion').count(),0);assert.equal((await local.store.read('students/qa-local-child')).xp,0);
 await page.unroute('**/.netlify/functions/v4-api');await page.getByRole('button',{name:'Terminer et voir mon bilan'}).click();await page.getByText('+190 XP confirmés par le serveur.',{exact:true}).waitFor();
 assert.equal(await page.locator('.rose-companion').getAttribute('data-motion'),'8');assert.equal((await local.store.read('students/qa-local-child')).xp,190);
 // Every approved scene remains bounded; duplicate event does not replay.
 assert.deepEqual(await page.evaluate(async()=>{const m=await import('./presentation.mjs');const app=document.querySelector('#app');return [m.playCompanion(app,9,'qa-proof'),m.playCompanion(app,9,'qa-proof')]}),[true,false]);
 await page.waitForFunction(()=>!document.querySelector('.rose-companion')?.classList.contains('playing'));
 assert.equal(await page.locator('.rose-mascot').evaluate(e=>getComputedStyle(e).animationName),'none');
 await page.emulateMedia({reducedMotion:'reduce'});await page.evaluate(async()=>{const m=await import('./presentation.mjs');m.playCompanion(document.querySelector('#app'),9,'reduced-proof')});
 assert.equal(await page.locator('.rose-companion.playing').count(),0);assert.equal(await page.locator('.rose-mascot').evaluate(e=>getComputedStyle(e).animationName),'none');
 await page.getByRole('button',{name:'Retour à mes missions',exact:true}).click();await page.getByRole('heading',{name:'Bonjour Élise'}).waitFor();
 assert.equal(await page.locator('.balance strong').innerText(),'190');assert.equal(await page.locator('.rose-companion').count(),0);
 assert.deepEqual(errors,[]);console.log('PASS rose presentation: navigation/stages intact, mobile, confirmed-only feedback/XP, hidden mini-test, offline, dedup, bounded motion, reduced motion');
}finally{await browser.close();await local.close()}
