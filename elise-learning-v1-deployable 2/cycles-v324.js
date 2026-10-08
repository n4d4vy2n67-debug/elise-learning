window.EliseCycles=(()=>{
const MAX=5;
function catalog(subject){return subject==='english'?window.ELISE_CATALOG_EN:window.ELISE_CATALOG_MATH}
function state(S,subject){const cat=catalog(subject)||[];let index=Math.max(0,Number(S[subject+'TopicV31']||0)),cycle=Math.max(1,Math.min(MAX,Number(S[subject+'Cycle']||1)));if(index>=cat.length&&cat.length){cycle=Math.min(MAX,cycle+Math.floor(index/cat.length));index%=cat.length}return{cycle,index,completed:!!S[subject+'Completed']}}
function advance(S,subject,score){const cat=catalog(subject)||[];if(!cat.length)throw Error('Missing catalog '+subject);const before=state(S,subject);if(before.completed||score<80)return{...before,advanced:false,finishedNow:false};let index=before.index+1,cycle=before.cycle,finishedNow=false;if(index>=cat.length){index=0;if(cycle===MAX){finishedNow=true;S[subject+'Completed']=true}else cycle++}S[subject+'TopicV31']=index;S[subject+'Cycle']=cycle;return{cycle,index,completed:!!S[subject+'Completed'],advanced:true,finishedNow}}
function label(S,subject){const s=state(S,subject);return s.completed?'Parcours terminé · 5/5':'Cycle '+s.cycle+'/5'}
return{MAX,state,advance,label};
})();
