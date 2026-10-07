const fs=require("fs"),vm=require("vm"),path=require("path");
const root=path.join(__dirname,"..","elise-learning-v1-deployable 2");global.window=global;
for(const f of ["teacher-rules.js","pedagogy-orchestrator.js"])vm.runInThisContext(fs.readFileSync(path.join(root,f),"utf8"),{filename:f});
function check(subject,score,index,expected,target){const d=ElisePedagogy.decide({subject,score,topicIndex:index,errors:[{question:"sample error",correct:false}],previousExerciseIds:["old-1"]});if(d.action!==expected||d.targetTopicIndex!==target)throw new Error(subject+" "+score+" failed");if(expected==="RETRY"&&(!d.generationContext||d.generationContext.topicIndex!==index||!d.generationContext.focusErrors.length||!d.generationContext.avoidQuestions.includes("old-1")))throw new Error(subject+" "+score+" missing remediation context");if(expected==="ADVANCE"&&d.generationContext!==null)throw new Error(subject+" "+score+" should clear remediation context");}
for(const s of ["english","math"]){check(s,100,2,"ADVANCE",3);check(s,80,2,"ADVANCE",3);check(s,79,2,"RETRY",2);check(s,0,2,"RETRY",2)}
// The orchestrator must reject a teacher that tries to violate the threshold.
const original=EliseTeachers.english.decide;
EliseTeachers.english.decide=ctx=>({teacher:"english",action:"ADVANCE",targetTopicIndex:ctx.topicIndex+1,focus:[]});
let rejected=false;try{ElisePedagogy.decide({subject:"english",score:79,topicIndex:2,errors:[],previousExerciseIds:[]})}catch(e){rejected=true}
EliseTeachers.english.decide=original;
if(!rejected)throw new Error("Orchestrator accepted a teacher decision violating 80% contract");
console.log("ORCHESTRATOR QA PASS");