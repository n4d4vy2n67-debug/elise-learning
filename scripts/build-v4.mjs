import {mkdir, copyFile, rm} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const output=path.join(root,'dist');
await rm(output,{recursive:true,force:true});
await mkdir(output,{recursive:true});
await mkdir(path.join(output,'assets'),{recursive:true});
// Only browser assets are public. Content generators/correctors and server code
// must never be copied into the published directory.
for(const file of ['index.html','app.mjs','style.css','client.mjs','auth.mjs','presentation.mjs','assets/companions-rose.jpg','assets/math-rose.png','assets/english-rose.png'])
  await copyFile(path.join(root,'v4',file),path.join(output,file));
console.log('V4 browser assets built; server and answer generators remain private.');
