import { randomUUID, createHash } from 'node:crypto';
export const REWARDS = Object.freeze([{id:'screen15',name:'15 min de temps d’écran bonus',cost:300},{id:'games20',name:'20 min de jeux bonus',cost:350},{id:'snap20',name:'20 min de Snap bonus',cost:400},{id:'dessert',name:'Un dessert au choix',cost:500},{id:'lunch',name:'Papa prépare le déjeuner d’école',cost:600},{id:'wa15',name:'15 min de WhatsApp bonus',cost:350},{id:'snap',name:'Inscription à Snap, validation parent et âge requis',cost:10000,minAge:13}]);
export const RULES = Object.freeze({version:'4.0.0',attempts:6,chapters:3,correctXP:10,bonusXP:50,pass:80,snap:10000});
export const day = at => new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Brussels',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(at));
const days = value => Date.parse(`${value}T00:00:00Z`)/86400000;
const fail = message => { throw new Error(message); };
const normalise = value => String(value).normalize('NFKC').toLowerCase().replace(/[’‘]/g,"'").trim().replace(/\s+/g,' ');
export const initialState = () => ({xp:0,totalEarned:0,sessions:{},daily:{},history:[],ledger:[],progress:{math:0,english:0},mastery:{math:[],english:[]},lastActivityDay:null,lastActivityXP:null,inactivity:null,notifications:[],requests:{},rewardRequests:{},migration:null});
export function penalty(state, at) {
  if (!state.lastActivityDay) return;
  const anchor=state.lastActivityDay, pct=Math.min(20,Math.max(0,days(day(at))-days(anchor)-3)*5);
  if (!state.inactivity || state.inactivity.anchor!==anchor) state.inactivity={anchor,baseXP:state.lastActivityXP??state.xp,pctApplied:0};
  const p=state.inactivity;
  if(pct>p.pctApplied){const due=Math.floor(p.baseXP*pct/100)-Math.floor(p.baseXP*p.pctApplied/100), debit=Math.min(state.xp,due);state.xp-=debit;p.pctApplied=pct;state.ledger.push({id:`idle:${anchor}:${pct}`,delta:-debit,due,applied:debit,uncollected:due-debit,noDebt:true,at});}
}
const safeId = value => typeof value==='string'&&/^[a-zA-Z0-9_.:-]{1,128}$/.test(value)&&!['__proto__','constructor','prototype'].includes(value);
const questionDTO=q=>Object.fromEntries(['id','family','prompt','type','options','skills'].filter(k=>q[k]!==undefined).map(k=>[k,q[k]]));
export function sessionDTO(s){return {id:s.id,subject:s.subject,chapterId:s.chapterId,status:s.status,mode:s.mode,title:s.title,objective:s.objective,...(['theory','practice','completed'].includes(s.status)?{examples:s.examples}:{}),...(['theory','practice'].includes(s.status)?{theory:s.theory}:{}),practice:s.status==='test'?[]:s.practice.map(questionDTO),...(['test','completed'].includes(s.status)?{test:s.test.map(questionDTO)}:{}),answers:Object.fromEntries(Object.entries(s.answers).filter(([id])=>s.status!=='test'||s.test.some(q=>q.id===id)).map(([id,a])=>[id,{answer:a.answer,...(s.status==='completed'||s.practice.some(q=>q.id===id)?{correct:a.correct,explanation:a.explanation}:{})}])),...(s.result?{result:s.result}:{}),...(s.status==='completed'?{corrections:[...s.practice,...s.test].map(q=>({...questionDTO(q),accepted:q.accepted,correctIndex:q.correctIndex,explanation:q.explanation}))}:{})};}
function chapterList(catalogue,subject){return catalogue.filter(c=>c.subject===subject);}
function checkQuestion(q){if(!safeId(q.id)||!q.prompt||!q.family)fail('Invalid generated question');if(q.options?.length){const options=q.options.map(normalise);if(new Set(options).size!==options.length)fail('Duplicate choices');if(!Number.isInteger(q.correctIndex)||q.correctIndex<0||q.correctIndex>=q.options.length)fail('Invalid correct choice');if(q.accepted){const valid=options.filter(x=>q.accepted.map(normalise).includes(x));if(valid.length>1)fail('Ambiguous choices');}}else if(!Array.isArray(q.accepted)||!q.accepted.length)fail('Missing accepted answers');}
function selectQuestions(chapter,seed,previous){
  const generated=chapter.generate?chapter.generate(seed,{previousFingerprints:previous}):chapter.questions;
  let practice,test;
  if(generated?.practice){practice=generated.practice;test=generated.test;}else{
    if(Array.isArray(generated)&&generated.length===15){practice=generated.slice(0,10);test=generated.slice(10,15);}else{
    const all=[...(generated??[])].sort((a,b)=>createHash('sha256').update(seed+a.id).digest('hex').localeCompare(createHash('sha256').update(seed+b.id).digest('hex')));
    const fresh=all.filter(q=>!previous.includes(q.fingerprint??normalise(q.prompt)));const pool=fresh.length>=15?fresh:all;practice=pool.slice(0,10);test=pool.slice(10,15);
    }
  }
  if(practice?.length!==10||test?.length!==5)fail('Chapter cannot provide 10+5 questions');
  const all=[...practice,...test];all.forEach(checkQuestion);
  if(new Set(all.map(q=>q.id)).size!==15||new Set(all.map(q=>q.fingerprint??normalise(q.prompt))).size!==15)fail('Repeated questions');
  return {practice:structuredClone(practice),test:structuredClone(test)};
}
export function correct(q,answer){if(q.options?.length){const index=typeof answer==='number'?answer:q.options.findIndex(x=>normalise(x)===normalise(answer));return index===q.correctIndex;}return q.accepted.map(normalise).includes(normalise(answer));}
export function applyAction(state,input,{catalogue,at=Date.now(),qa=false}={}) {
  const action=input.action;
  const list=subject=>chapterList(catalogue,subject);
  const get=()=>state.sessions[input.sessionId]??fail('Unknown session');
  const today=day(at);if(!qa&&state.lastActivityDay&&today<state.lastActivityDay)fail('Chronology violation');const isNormal=s=>s.mode==='normal';
  const bucket=subject=>state.daily[`${subject}:${today}`]??={attempts:0,passed:[]};
  const dto=s=>sessionDTO(s);
  if(action==='dashboard'){
    if(!qa)penalty(state,at);
    return {xp:state.xp,totalEarned:state.totalEarned,history:state.history,daily:state.daily,progress:Object.fromEntries(['math','english'].map(subject=>[subject,list(subject)[state.progress[subject]]?.id??null])),catalogue:catalogue.map(c=>({id:c.id,subject:c.subject,title:c.title})),active:Object.fromEntries(['math','english'].map(subject=>[subject,Object.values(state.sessions).filter(s=>s.subject===subject&&s.mode===(qa?'qa':'normal')&&['theory','practice','test'].includes(s.status)).map(dto)[0]??null])),notificationStatus:{sending:state.notifications.filter(x=>x.status==='sending').length,review:state.notifications.filter(x=>x.status==='review').length,pending:state.notifications.filter(x=>x.status==='pending').length,failed:state.notifications.filter(x=>x.status==='failed').length,accepted:state.notifications.filter(x=>x.status==='accepted').length},snapTarget:RULES.snap,rewards:REWARDS,redemptions:[...(state.migration?.redemptions??[]).map((x,i)=>({...x,id:x.id??`legacy-reward:${i}`,legacy:true})),...Object.values(state.rewardRequests??{})],qa};
  }
  if(action==='create'){
    if(!safeId(input.requestId))fail('Invalid request id');
    const requestKey=`create:${input.requestId}`;
    if(state.requests[requestKey])return dto(state.sessions[state.requests[requestKey]]);
    const c=catalogue.find(c=>c.id===input.chapterId&&c.subject===input.subject)??fail('Unknown chapter');
    const active=Object.values(state.sessions).find(s=>s.subject===c.subject&&s.mode===(qa?'qa':'normal')&&['theory','practice','test'].includes(s.status));
    if(active)return dto(active);
    if(!qa){const b=bucket(c.subject);if(b.attempts>=6||b.passed.length>=3)fail('Daily limit reached');if(list(c.subject).findIndex(x=>x.id===c.id)>state.progress[c.subject])fail('Chapter locked');penalty(state,at);}
    const previous=Object.values(state.sessions).filter(s=>s.chapterId===c.id&&s.mode===(qa?'qa':'normal')).slice(-6).flatMap(s=>[...s.practice,...s.test].map(q=>q.fingerprint??normalise(q.prompt)));
    const id=randomUUID(), questions=selectQuestions(c,id,previous);
    const s={id,chapterId:c.id,subject:c.subject,mode:qa?'qa':'normal',status:'theory',createdAt:at,title:c.title,objective:c.objective??'',examples:c.examples??[],theory:c.theory,rules:{...RULES},contentVersion:c.version??'4.0.0',...questions,answers:{}};
    state.sessions[id]=s;state.requests[requestKey]=id;return dto(s);
  }
  if(action==='redeem'){
    if(qa)fail('Rewards unavailable in QA');if(!safeId(input.requestId))fail('Invalid request id');const id=`reward:${input.requestId}`;
    state.rewardRequests??={};if(state.rewardRequests[id])return {xp:state.xp,request:state.rewardRequests[id],alreadyApplied:true};
    const reward=REWARDS.find(r=>r.id===input.rewardId)??fail('Unknown reward');if(state.xp<reward.cost)fail('Insufficient points');
    if(reward.id==='snap'&&Object.values(state.rewardRequests).some(r=>r.rewardId==='snap'&&['pending','approved'].includes(r.status)))fail('Reward already requested');
    const request={id,rewardId:reward.id,name:reward.name,cost:reward.cost,minAge:reward.minAge??null,status:'pending',requestedAt:at};
    state.xp-=reward.cost;state.rewardRequests[id]=request;state.ledger.push({id,requestId:id,rewardId:reward.id,delta:-reward.cost,at});return {xp:state.xp,request};
  }
  if(['approveReward','rejectReward'].includes(action)){
    if(qa)fail('Rewards unavailable in QA');const request=state.rewardRequests?.[input.rewardRequestId]??fail('Unknown reward request');
    const wanted=action==='approveReward'?'approved':'rejected';if(request.status===wanted)return {xp:state.xp,request,alreadyApplied:true};if(request.status!=='pending')fail('Reward already reviewed');
    if(wanted==='approved'&&request.minAge&&input.ageConfirmed!==true)fail('Parent age confirmation required');
    request.status=wanted;request.reviewedAt=at;if(wanted==='approved'&&request.minAge)request.parentAgeConfirmedAt=at;
    if(wanted==='rejected'){state.xp+=request.cost;state.ledger.push({id:`refund:${request.id}`,requestId:request.id,delta:request.cost,at});}
    return {xp:state.xp,request};
  }
  const s=get();if(s.mode!==(qa?'qa':'normal'))fail('Session mode mismatch');if(at<s.createdAt||at<(s.testAt??s.createdAt))fail('Chronology violation');
  if(action==='practice'){if(s.status==='theory'){s.status='practice';s.practiceAt=at;if(isNormal(s))state.notifications.push({id:`${s.id}:start`,sessionId:s.id,type:'start',status:'pending',at});}else if(s.status!=='practice')fail('Invalid phase');return dto(s);}
  if(action==='startTest'){if(s.status==='test')return dto(s);if(s.status!=='practice'||!s.practice.every(q=>s.answers[q.id]))fail('Complete 10 practice answers first');s.status='test';s.testAt=at;return dto(s);}
  if(action==='answer'){
    if(!['practice','test'].includes(s.status))fail('Invalid phase');const q=(s.status==='practice'?s.practice:s.test).find(q=>q.id===input.questionId)??fail('Question unavailable');
    if(typeof input.answer!=='string'&&typeof input.answer!=='number')fail('Invalid answer');if(typeof input.answer==='number'&&(!Number.isInteger(input.answer)||!q.options?.length||input.answer<0||input.answer>=q.options.length))fail('Invalid choice');if(String(input.answer).length>1000)fail('Answer too long');
    s.answers[q.id]??={answer:input.answer,correct:correct(q,input.answer),explanation:q.explanation,at};
    return {questionId:q.id,recorded:true,...(s.status==='practice'?{correct:s.answers[q.id].correct,explanation:q.explanation}:{}),session:dto(s)};
  }
  if(action==='abandon'){if(['theory','practice','test'].includes(s.status)){s.status='abandoned';s.abandonedAt=at;}return dto(s);}
  if(action==='feedback'){if(s.status!=='completed')fail('Feedback requires completed session');if(!['easy','just','hard'].includes(input.difficulty)||typeof(input.comment??'')!=='string'||String(input.comment??'').length>1000)fail('Invalid feedback');s.feedback={difficulty:input.difficulty,comment:input.comment??'',enjoy:['yes','neutral','no'].includes(input.enjoy)?input.enjoy:null,at};const h=state.history.find(h=>h.id===s.id);if(isNormal(s)&&h)h.feedback=s.feedback;return {recorded:true};}
  if(action==='help'){if(!['practice','completed'].includes(s.status))fail('Help unavailable during this phase');const q=[...s.practice,...(s.status==='completed'?s.test:[])].find(q=>q.id===input.questionId)??fail('Question unavailable');const minute=Math.floor(at/60000);if(state.helpUsage?.minute!==minute)state.helpUsage={minute,count:0};if(state.helpUsage.count>=6)fail('Help rate limit');state.helpUsage.count++;return {allowed:true,context:{chapterId:s.chapterId,theory:s.theory,question:{prompt:q.prompt,family:q.family},stage:s.status}};}
  if(action==='finish'){
    if(s.status==='completed')return dto(s);if(s.status!=='test'||Object.keys(s.answers).length!==15||![...s.practice,...s.test].every(q=>s.answers[q.id]))fail('Complete exactly 15 answers first');
    const testCorrect=s.test.filter(q=>s.answers[q.id].correct).length,practiceCorrect=s.practice.filter(q=>s.answers[q.id].correct).length,score=testCorrect*20,passed=score>=s.rules.pass;
    const earned=isNormal(s)?(testCorrect+practiceCorrect)*s.rules.correctXP+(passed?s.rules.bonusXP:0):0, index=list(s.subject).findIndex(c=>c.id===s.chapterId),nextChapterId=passed?(list(s.subject)[index+1]?.id??null):s.chapterId;
    if(isNormal(s)){penalty(state,at);const b=bucket(s.subject);b.attempts++;if(passed&&!b.passed.includes(s.chapterId))b.passed.push(s.chapterId);state.xp+=earned;state.totalEarned+=earned;state.ledger.push({id:`finish:${s.id}`,delta:earned,at});if(passed){if(!state.mastery[s.subject].includes(s.chapterId))state.mastery[s.subject].push(s.chapterId);state.progress[s.subject]=Math.max(state.progress[s.subject],index+1);}state.lastActivityDay=today;state.lastActivityXP=state.xp;state.inactivity=null;}
    s.status='completed';s.completedAt=at;s.result={score,passed,earned,nextChapterId,programmeComplete:passed&&!nextChapterId,practiceCorrect,testCorrect};
    if(isNormal(s)){state.history.push({id:s.id,chapterId:s.chapterId,subject:s.subject,day:today,...s.result,durations:{theory:s.practiceAt-s.createdAt,practice:s.testAt-s.practiceAt,test:at-s.testAt,total:at-s.createdAt}});state.notifications.push({id:`${s.id}:finish`,sessionId:s.id,type:'finish',status:'pending',at,result:s.result,history:state.history.at(-1)});}return dto(s);
  }
  fail('Unknown action');
}
