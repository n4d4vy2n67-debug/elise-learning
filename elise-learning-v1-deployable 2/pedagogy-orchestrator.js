window.ElisePedagogy=(()=>{
 function normalizeErrors(errors){
  return (errors||[]).filter(x=>x&&!x.correct).map(x=>({question:String(x.question||""),given:x.given==null?"":String(x.given),expected:x.expected==null?"":String(x.expected)})).filter(x=>x.question);
 }
 function decide(ctx){
  if(!ctx||!["english","math"].includes(ctx.subject))throw new Error("Invalid subject");
  if(!Number.isFinite(ctx.score))throw new Error("Invalid score");
  if(!Number.isInteger(ctx.topicIndex)||ctx.topicIndex<0)throw new Error("Invalid topic index");
  const teacher=window.EliseTeachers&&window.EliseTeachers[ctx.subject];
  if(!teacher)throw new Error("Teacher unavailable");
  const errors=normalizeErrors(ctx.errors);
  const previousExerciseIds=[...new Set((ctx.previousExerciseIds||[]).map(String).filter(Boolean))];
  const d=teacher.decide({...ctx,errors,previousExerciseIds});
  const required=ctx.score>=80?"ADVANCE":"RETRY",target=required==="ADVANCE"?ctx.topicIndex+1:ctx.topicIndex;
  if(d.action!==required)throw new Error("Teacher decision violates 80% contract");
  if(d.targetTopicIndex!==target)throw new Error("Teacher target invalid");
  return {...d,subject:ctx.subject,score:ctx.score,errors,previousExerciseIds,generationContext:required==="RETRY"?{subject:ctx.subject,topicIndex:ctx.topicIndex,avoidQuestions:previousExerciseIds,focusErrors:errors,retry:true}:null};
 }
 return {decide};
})();