const fs=require("fs"),vm=require("vm"),path=require("path");
const root=path.join(__dirname,"..","elise-learning-v1-deployable 2");global.window=global;
for(const f of ["teacher-rules.js","pedagogy-orchestrator.js"])vm.runInThisContext(fs.readFileSync(path.join(root,f),"utf8"),{filename:f});
function check(subject,score,index,expected,target){const d=ElisePedagogy.decide({subject,score,topicIndex:index,errors:[{question:"sample error"}],previousExerciseIds:["old-1"]});if(d.action!==expected||d.targetTopicIndex!==target)throw new Error(subject+" "+score+" failed");}
for(const s of ["english","math"]){check(s,100,2,"ADVANCE",3);check(s,80,2,"ADVANCE",3);check(s,79,2,"RETRY",2);check(s,0,2,"RETRY",2)}
console.log("ORCHESTRATOR QA PASS");