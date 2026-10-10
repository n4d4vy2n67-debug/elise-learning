// Local integration harness: actual production API/core with explicit in-memory fixture auth.
// Never imported by Netlify handler. Always binds loopback and advertises unvalidated cloud.
import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createAPI} from '../v4/server/api.mjs';
import {MemoryStore} from '../v4/server/store.mjs';
const root=resolve(fileURLToPath(new URL('../v4/',import.meta.url)));
export async function startLocalServer({port=0,catalogue,clock=()=>Date.now(),fixtureAuthenticate}={}){
 if(!catalogue){const [{mathChapters,generateMath},{englishChapters,generateEnglish}]=await Promise.all([import('../v4/content/math.mjs'),import('../v4/content/english.mjs')]);catalogue=[...mathChapters.map(c=>({...c,subject:'math',theory:c.theoryHtml??c.theory,generate:(seed,{previousFingerprints})=>generateMath(c.id,{seed,avoidFingerprints:previousFingerprints})})),...englishChapters.map(c=>({...c,subject:'english',theory:c.theoryHtml??c.theory,generate:(seed,{previousFingerprints})=>generateEnglish(c.id,{seed,avoidFingerprints:previousFingerprints})}))];}
 const store=new MemoryStore();const authenticate=fixtureAuthenticate??(async header=>{if(header!=='Bearer qa-local-child')throw new Error('Authentication token invalid');return{uid:'qa-local-child'}});
 const api=createAPI({store,authenticate,catalogue,clock,environment:'test',publicConfig:{localTest:true,fixtureToken:"qa-local-child",configured:true,firebase:{apiKey:'local-fixture-only'}}});
 const server=http.createServer(async(req,res)=>{try{if(req.url.startsWith('/.netlify/functions/v4-api')){let chunks=[];for await(let chunk of req)chunks.push(chunk);let r=await api({httpMethod:req.method,body:Buffer.concat(chunks).toString(),headers:req.headers});res.writeHead(r.statusCode,r.headers);res.end(r.body);return;}let pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(!['/','/index.html','/app.mjs','/style.css','/client.mjs','/auth.mjs','/presentation.mjs','/assets/companions-rose.jpg','/assets/math-rose.png','/assets/english-rose.png'].includes(pathname)){res.writeHead(404);res.end('Private asset');return;}let file=resolve(root,'.'+(pathname==='/'?'/index.html':pathname));if(!file.startsWith(root+'/')){res.writeHead(403);res.end();return;}let content=await readFile(file);res.writeHead(200,{'Content-Type':({'.html':'text/html','.mjs':'text/javascript','.css':'text/css','.jpg':'image/jpeg','.png':'image/png'})[extname(file)]??'application/octet-stream','Cache-Control':'no-store'});res.end(content);}catch(error){res.writeHead(404);res.end(error.message)}});
 await new Promise(r=>server.listen(port,'127.0.0.1',r));return{server,store,catalogue,url:`http://127.0.0.1:${server.address().port}`,close:()=>new Promise(r=>server.close(r))};
}
if(process.argv[1]===fileURLToPath(import.meta.url)){const local=await startLocalServer({port:Number(process.env.PORT??4173)});console.log(`Local fixture, cloud not validated: ${local.url}`);}
