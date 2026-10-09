import {createHash} from 'node:crypto';
const checksum=buffer=>createHash('sha256').update(buffer).digest('hex');
// Base64 chunk + small metadata remains below 64 KiB per archive document.
export function archiveMigration(migration){
  const bytes=Buffer.from(JSON.stringify(migration),'utf8'),chunks=[];
  for(let offset=0;offset<bytes.length;offset+=45000)chunks.push({index:chunks.length,data:bytes.subarray(offset,offset+45000).toString('base64')});
  if(chunks.length>400)throw new Error('Migration archive exceeds safe transaction capacity; staged operator import required');
  return {pointer:{archived:true,version:migration.version,sourceChecksum:migration.sourceChecksum,archiveChecksum:checksum(bytes),chunks:chunks.length},chunks};
}
export function restoreMigration(pointer,chunks){
  if(chunks.length!==pointer.chunks)throw new Error('Incomplete migration archive');
  const ordered=[...chunks].sort((a,b)=>a.index-b.index);
  if(ordered.some((c,i)=>c.index!==i||typeof c.data!=='string'))throw new Error('Invalid migration archive chunks');
  const bytes=Buffer.concat(ordered.map(c=>Buffer.from(c.data,'base64')));
  if(checksum(bytes)!==pointer.archiveChecksum)throw new Error('Migration archive checksum mismatch');
  const migration=JSON.parse(bytes.toString('utf8'));
  if(migration.version!==pointer.version||migration.sourceChecksum!==pointer.sourceChecksum)throw new Error('Migration archive identity mismatch');
  return migration;
}
