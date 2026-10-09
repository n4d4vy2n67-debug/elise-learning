import {createHash} from 'node:crypto';
export const LEGACY_ORDER={math:['integers','priorities','powers','fractions','decimals','divisibility','percent','proportion','literal','distributivity','equations','coordinates','angles','triangles','perimeterArea','solids','symmetry','statistics','wordProblems','logic'],english:['be','have','present','doDoes','frequency','pronouns','possessives','articles','plurals','there','can','imperative','questionWords','prepositions','presentContinuous','comparison','someAny','vocabDaily','sentenceOrder','reading','translation']};
const validDay=value=>{if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;const date=new Date(`${value}T00:00:00Z`);return Number.isFinite(date.getTime())&&date.toISOString().slice(0,10)===value;};
export function planMigration(source,{version='v4-1',chapterMapping={},catalogue=[]}={}){
  if(!source||typeof source!=='object'||Array.isArray(source))throw new Error('Invalid migration source');
  if(!Number.isSafeInteger(source.xp)||source.xp<0)throw new Error('Source XP must be evidenced nonnegative integer');
  if(source.history&&source.sessions&&JSON.stringify(source.history)!==JSON.stringify(source.sessions))throw new Error('Conflicting legacy histories require reconciliation');
  const legacy=source.history??source.sessions??[];
  if(!Array.isArray(legacy))throw new Error('Legacy history must be an array');
  const history=legacy.map((x,i)=>({...structuredClone(x),id:String(x.id??`legacy:${i}`),score:x.score??x.pct??null,earned:x.earned??x.xpEarned??null,day:x.day??x.localDay??null,chapterId:chapterMapping[x.chapterId??x.topicId]??x.chapterId??x.topicId??null,...(chapterMapping[x.chapterId??x.topicId]?{chapterId:chapterMapping[x.chapterId??x.topicId]}:{}),sourceChapterId:x.chapterId??x.topicId??null}));
  if(new Set(history.map(x=>x.id)).size!==history.length)throw new Error('Duplicate legacy history ids');
  const progress={};for(const subject of ['math','english']){
    const raw=source[`${subject}TopicV31`]??source[`${subject}Topic`];
    if(raw!==undefined){if(!Number.isSafeInteger(raw)||raw<0)throw new Error('Invalid legacy progression');const count=catalogue.filter(c=>c.subject===subject).length;if(raw>LEGACY_ORDER[subject].length)throw new Error('Legacy progression outside catalogue');const oldId=LEGACY_ORDER[subject][raw],newList=catalogue.filter(c=>c.subject===subject);if(count&&oldId&&!newList.some(c=>c.id===(chapterMapping[oldId]??oldId)))throw new Error('Legacy chapter not mapped');progress[subject]=count?(oldId?newList.findIndex(c=>c.id===(chapterMapping[oldId]??oldId)):count):raw;}
  }
  const daily={},mastery={math:[],english:[]};
  for(const row of history){if(!['math','english'].includes(row.subject)||row.testMode===true)continue;const d=row.day;if(d&&!validDay(d))throw new Error('Invalid legacy history date');if(d){const key=`${row.subject}:${d}`,b=daily[key]??={attempts:0,passed:[]};b.attempts++;if(typeof row.score==='number'&&row.score>=80&&row.chapterId&&!b.passed.includes(row.chapterId))b.passed.push(row.chapterId);}if(typeof row.score==='number'&&row.score>=80&&row.chapterId&&!mastery[row.subject].includes(row.chapterId))mastery[row.subject].push(row.chapterId);}
  const lastDay=source.lastDay??source.lastActivityDay??null;
  if(lastDay&&!validDay(lastDay))throw new Error('Invalid legacy activity date');
  if(source.penaltyBaseDay&&!validDay(source.penaltyBaseDay))throw new Error('Invalid legacy penalty date');
  let inactivity=null;
  if(source.penaltyBaseDay&&Number.isSafeInteger(source.penaltyBaseXp)&&source.penaltyBaseXp>=0){const suffix=Number(String(source.penaltyKey??'').split(':').at(-1));inactivity={anchor:source.penaltyBaseDay,baseXP:source.penaltyBaseXp,pctApplied:Number.isInteger(suffix)&&suffix>=0&&suffix<=4?suffix*5:0};}
  return {version,sourceChecksum:createHash('sha256').update(JSON.stringify(source)).digest('hex'),xp:source.xp,history,progress,daily,mastery,lastDay,inactivity,redemptions:structuredClone(source.redemptions??[]),original:structuredClone(source),warnings:['Source identity and backup restoration must be verified before applying','Legacy ordinal progression must use the matching V3 catalogue order; unknown fields are retained','No historical points or validations are invented']};
}
export function applyMigration(state,plan,{backupVerified=false,identityVerified=false}={}){
  if(state.migration?.version===plan.version){if(state.migration.sourceChecksum!==plan.sourceChecksum)throw new Error('Conflicting migration source');return {alreadyApplied:true};}
  if(!backupVerified||!identityVerified)throw new Error('Verified backup and identity required');
  if(state.migration||state.ledger.length||state.history.length||Object.keys(state.sessions).length||state.xp||state.totalEarned||Object.keys(state.daily).length||Object.keys(state.rewardRequests??{}).length||state.notifications.length||Object.keys(state.requests).length||Object.values(state.progress).some(x=>x!==0)||Object.values(state.mastery??{}).some(x=>x.length)||state.lastActivityDay||state.inactivity)throw new Error('Target is not empty; manual reconciliation required');
  state.xp=plan.xp;state.history=plan.history;state.daily=plan.daily??{};state.mastery=plan.mastery??{math:[],english:[]};Object.assign(state.progress,plan.progress);state.lastActivityDay=plan.lastDay;state.lastActivityXP=plan.inactivity?.baseXP??plan.xp;state.inactivity=plan.inactivity;
  state.migration={...plan,applied:true};return {xp:state.xp,historyCount:state.history.length,progress:state.progress};
}
