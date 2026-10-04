// Elise Learning V2.6
(function(){
 const V='V2.6';
 const practice=[
 {t:"Complete: I ___ ready for school.",type:"text",accept:["am"],e:"I → AM."},
 {t:"She ___ my English teacher.",a:["am","is","are"],c:1,e:"She → IS."},
 {t:"Complete: He ___ twelve years old.",type:"text",accept:["is"],e:"He → IS."},
 {t:"It ___ cold today.",a:["am","is","are"],c:1,e:"It → IS."},
 {t:"Complete: We ___ in the same class.",type:"text",accept:["are"],e:"We → ARE."},
 {t:"They ___ at the sports centre.",a:["am","is","are"],c:2,e:"They → ARE."},
 {t:"My sister ___ at home.",a:["am","is","are"],c:1,e:"My sister = she → IS."},
 {t:"My friends ___ in Brussels.",a:["am","is","are"],c:2,e:"My friends = they → ARE."},
 {t:"The dog ___ under the table.",a:["am","is","are"],c:1,e:"The dog = it → IS."},
 {t:"Tom and Max ___ classmates.",a:["am","is","are"],c:2,e:"Tom and Max = they → ARE."},
 {t:"My parents ___ at work.",a:["am","is","are"],c:2,e:"My parents = they → ARE."},
 {t:"Emma ___ good at hockey.",a:["am","is","are"],c:1,e:"Emma = she → IS."},
 {t:"The books ___ on my desk.",a:["am","is","are"],c:2,e:"The books = they → ARE."},
 {t:"Complete: My brother and I ___ hungry.",type:"text",accept:["are"],e:"My brother and I = we → ARE."},
 {t:"Complete: This exercise ___ easy.",type:"text",accept:["is"],e:"This exercise = it → IS."},
 {t:"Complete: Your shoes ___ new.",type:"text",accept:["are"],e:"Your shoes = they → ARE."},
 {t:"Correct the verb: They is tired.",type:"text",accept:["they are tired","they are tired."],e:"They → ARE."},
 {t:"Correct the verb: We is ready.",type:"text",accept:["we are ready","we are ready."],e:"We → ARE."},
 {t:"Correct the verb: I is happy.",type:"text",accept:["i am happy","i am happy."],e:"I → AM."},
 {t:"Choose the correct sentence.",a:["She am happy.","She is happy.","She are happy."],c:1,e:"She → IS."},
 {t:"Choose the correct sentence.",a:["We are ready.","We is ready.","We am ready."],c:0,e:"We → ARE."},
 {t:"Choose the correct sentence.",a:["I are late.","I is late.","I am late."],c:2,e:"I → AM."},
 {t:"The children ___ outside.",a:["am","is","are"],c:2,e:"The children = they → ARE."},
 {t:"My cousin ___ from London.",a:["am","is","are"],c:1,e:"My cousin = he/she → IS."}
 ];
 const test=[
 {t:"TEST · Complete: My cousin ___ from London.",type:"text",accept:["is"],e:"My cousin = he/she → IS."},
 {t:"TEST · Complete: We ___ good friends.",type:"text",accept:["are"],e:"We → ARE."},
 {t:"TEST · Complete: I ___ in second year.",type:"text",accept:["am"],e:"I → AM."},
 {t:"TEST · The windows ___ open.",a:["am","is","are"],c:2,e:"The windows = they → ARE."},
 {t:"TEST · Our teacher ___ in the classroom.",a:["am","is","are"],c:1,e:"Our teacher = he/she → IS."},
 {t:"TEST · You ___ very organised.",a:["am","is","are"],c:2,e:"You → ARE."},
 {t:"TEST · Correct the verb: My parents is here.",type:"text",accept:["my parents are here","my parents are here."],e:"My parents = they → ARE."},
 {t:"TEST · Correct the verb: He are my neighbour.",type:"text",accept:["he is my neighbour","he is my neighbour."],e:"He → IS."},
 {t:"TEST · Choose the correct sentence.",a:["It are difficult.","It is difficult.","It am difficult."],c:1,e:"It → IS."},
 {t:"TEST · Choose the correct sentence.",a:["Sarah and I are ready.","Sarah and I is ready.","Sarah and I am ready."],c:0,e:"Sarah and I = we → ARE."}
 ];
 function shuffle(a){for(let x=[...a],j=x.length-1;j>0;j--){let k=Math.floor(Math.random()*(j+1));[x[j],x[k]]=[x[k],x[j]]}return x}
 function pick(pool,n,key){let old=[];try{old=JSON.parse(localStorage.getItem(key)||"[]");if(!Array.isArray(old))old=[]}catch(e){old=[]};let x=shuffle(pool.filter(q=>!old.includes(q.t)));if(x.length<n)x=x.concat(shuffle(pool.filter(q=>!x.includes(q))));let out=x.slice(0,n);localStorage.setItem(key,JSON.stringify(out.map(q=>q.t).concat(old).slice(0,20)));return out}
 function voice(){let vs=speechSynthesis.getVoices().filter(v=>/^en/i.test(v.lang)),f=/samantha|victoria|karen|moira|serena|ava|susan|female/i;return vs.find(v=>/en-GB/i.test(v.lang)&&f.test(v.name))||vs.find(v=>f.test(v.name))||vs.find(v=>/en-GB/i.test(v.lang))||vs[0]}
 function speak(s){speechSynthesis.cancel();let u=new SpeechSynthesisUtterance(s);u.lang="en-GB";u.rate=.70;u.pitch=1.08;let v=voice();if(v)u.voice=v;speechSynthesis.speak(u)}
 function prepareEnglish(){lessons.english.title="🇬🇧 TO BE · présent affirmatif";lessons.english.theory='<div class="muted">OBJECTIF DU JOUR</div><h2>Conjuguer TO BE au présent affirmatif</h2><p><b>I am</b> · <b>he/she/it is</b> · <b>you/we/they are</b>.</p><p><b>Méthode :</b> repère le sujet → remplace-le par un pronom → choisis <b>am, is ou are</b>.</p><p>Exemples : <i>I am ready. She is at school. They are happy.</i></p><p class="muted">Les exercices portent uniquement sur cette théorie. La négation, les questions et la traduction seront proposées dans leurs propres leçons.</p><button id="listen">🔊 Écouter lentement</button><br><br><button id="practice" class="primary">Commencer l\'entraînement →</button>';lessons.english.q=[...pick(practice,10,"v26ep"),...pick(test,5,"v26et")]}
 const englishButton=document.querySelector('[data-start="english"]');
 if(englishButton)englishButton.onclick=function(){try{prepareEnglish();begin("english");const listen=document.getElementById("listen");if(listen)listen.onclick=()=>speak("I am ready. She is at school. They are happy. We are in the same class.")}catch(e){console.error("V2.6 English start error",e);alert("Le cours d’anglais n’a pas pu démarrer. Recharge la page et réessaie.")}};
 let coach=document.getElementById("aiCoach"),quiz=document.getElementById("quiz");if(coach&&quiz)quiz.parentNode.insertBefore(coach,quiz.nextSibling);
 const oldDone=done;done=function(){oldDone();if(currentRec){currentRec.version=V;save()}};
 document.title="Elise Learning · "+V;document.querySelectorAll("footer").forEach(x=>x.textContent="Elise Learning · "+V);document.querySelectorAll(".pill").forEach(x=>{if(/^V2\./.test(x.textContent.trim()))x.textContent=V});
})();