window.ElisePedagogy=(()=>{
 function decide(ctx){
  if(!ctx||!["english","math"].includes(ctx.subject))throw new Error("Invalid subject");
  if(!Number.isFinite(ctx.score))throw new Error("Invalid score");
  const teacher=window.EliseTeachers&&window.EliseTeachers[ctx.subject];
  if(!teacher)throw new Error("Teacher unavailable");
  const d=teacher.decide(ctx);
  const required=ctx.score>=80?"ADVANCE":"RETRY";
  if(d.action!==required)throw new Error("Teacher decision violates 80% contract");
  if(required==="ADVANCE"&&d.targetTopicIndex!==ctx.topicIndex+1)throw new Error("Advance target invalid");
  if(required==="RETRY"&&d.targetTopicIndex!==ctx.topicIndex)throw new Error("Retry target invalid");
  return {...d,subject:ctx.subject,score:ctx.score,previousExerciseIds:ctx.previousExerciseIds||[]};
 }
 return {decide};
})();