import test from 'node:test';
import assert from 'node:assert/strict';
import {readdir,readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
const root=new URL('../',import.meta.url);
test('publish output has only public browser assets and no answer generators',async()=>{
 execFileSync(process.execPath,['scripts/build-v4.mjs'],{cwd:root});
 const files=(await readdir(new URL('dist/',root))).sort();
 assert.deepEqual(files,['app.mjs','assets','auth.mjs','client.mjs','index.html','presentation.mjs','style.css']);
 const assets=(await readdir(new URL('dist/assets/',root))).sort();
 assert.deepEqual(assets,['companions-rose.jpg','english-rose.png','math-rose.png']);
 for(const file of files.filter(f=>f!=='assets')){
  const text=await readFile(new URL('dist/'+file,root),'utf8');
  assert.ok(!/generateEnglish|generateMath|correctIndex\s*:|accepted\s*:|FIREBASE_ADMIN_SERVICE_ACCOUNT|BEGIN PRIVATE KEY/.test(text),file+' private assets not published');
 }
 const netlify=await readFile(new URL('netlify.toml',root),'utf8');assert.match(netlify,/publish\s*=\s*"dist"/);
});
