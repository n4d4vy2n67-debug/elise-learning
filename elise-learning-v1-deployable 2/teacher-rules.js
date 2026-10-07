window.EliseTeachers={
 english:{
  decide(ctx){return {teacher:"english",action:ctx.score>=80?"ADVANCE":"RETRY",targetTopicIndex:ctx.score>=80?ctx.topicIndex+1:ctx.topicIndex,focus:ctx.score>=80?[]:ctx.errors.map(x=>x.question).slice(0,5)}}
 },
 math:{
  decide(ctx){return {teacher:"math",action:ctx.score>=80?"ADVANCE":"RETRY",targetTopicIndex:ctx.score>=80?ctx.topicIndex+1:ctx.topicIndex,focus:ctx.score>=80?[]:ctx.errors.map(x=>x.question).slice(0,5)}}
 }
};