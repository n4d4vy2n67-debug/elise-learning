// Elise Learning V2.4 · daily varied exercises
(function(){
  const DAY = new Date().toISOString().slice(0,10);
  function hash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
  function rng(seed){let x=hash(seed);return()=>{x+=0x6D2B79F5;let t=x;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
  function pick(r,a){return a[Math.floor(r()*a.length)]}
  function shuffle(r,a){a=a.slice();for(let i=a.length-1;i>0;i--){let j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
  const signed=n=>n<0?'−'+Math.abs(n):String(n);
  function mathQ(type,r,test){
    let a,b,c,ans,opts;
    const pre=test?'TEST · ':'';
    if(type==='integer'){a=Math.floor(r()*19)-9;b=Math.floor(r()*19)-9;c=Math.floor(r()*13)-6;ans=a+b-c;return{t:pre+`${signed(a)} + (${signed(b)}) − (${signed(c)}) =`,type:'text',accept:[String(ans),signed(ans)],e:`Calcule de gauche à droite : le résultat est ${signed(ans)}.`}}
    if(type==='priority'){a=2+Math.floor(r()*8);b=2+Math.floor(r()*7);c=2+Math.floor(r()*6);ans=a+b*c;return{t:pre+`${a} + ${b} × ${c} =`,type:'text',accept:[String(ans)],e:`La multiplication passe avant l'addition : ${b}×${c}=${b*c}, puis +${a} = ${ans}.`}}
    if(type==='parentheses'){a=2+Math.floor(r()*8);b=2+Math.floor(r()*8);c=2+Math.floor(r()*5);ans=(a+b)*c;return{t:pre+`(${a} + ${b}) × ${c} =`,type:'text',accept:[String(ans)],e:`Parenthèses d'abord : ${a}+${b}=${a+b}, puis ×${c} = ${ans}.`}}
    if(type==='power'){a=2+Math.floor(r()*5);b=2+Math.floor(r()*4);ans=a*a+b;return{t:pre+`${a}² + ${b} =`,type:'text',accept:[String(ans)],e:`${a}²=${a*a}, puis +${b} = ${ans}.`}}
    if(type==='fraction'){let d=pick(r,[2,3,4,5,6,8,10]);a=1+Math.floor(r()*(d-1));b=1+Math.floor(r()*(d-a));ans=a+b;return{t:pre+`${a}/${d} + ${b}/${d} = ?/${d}`,type:'text',accept:[String(ans),ans+'/'+d],e:`Même dénominateur : additionne les numérateurs. ${a}+${b}=${ans}.`}}
    if(type==='decimal'){a=(10+Math.floor(r()*90))/10;b=(10+Math.floor(r()*90))/10;ans=(a+b).toFixed(1).replace('.',',');return{t:pre+`${String(a).replace('.',',')} + ${String(b).replace('.',',')} =`,type:'text',accept:[ans,ans.replace(',','.')],e:`Aligne les virgules : résultat ${ans}.`}}
    if(type==='proportion'){a=pick(r,[2,3,4,5]);b=pick(r,[2,3,4]);c=a*b;ans=c*3;return{t:pre+`${a} cahiers coûtent ${c} €. Combien coûtent ${a*3} cahiers ?`,type:'text',accept:[String(ans),ans+' €',ans+'€'],e:`Il y a 3 fois plus de cahiers, donc 3 fois le prix : ${ans} €.`}}
    if(type==='conversion'){a=1+Math.floor(r()*9);ans=a*100;return{t:pre+`${a} m = combien de cm ?`,type:'text',accept:[String(ans),ans+' cm'],e:`1 m = 100 cm, donc ${a} m = ${ans} cm.`}}
    if(type==='geometry'){a=2+Math.floor(r()*9);b=2+Math.floor(r()*8);ans=2*(a+b);return{t:pre+`Un rectangle mesure ${a} cm sur ${b} cm. Quel est son périmètre ?`,type:'text',accept:[String(ans),ans+' cm'],e:`Périmètre = 2 × (longueur + largeur) = ${ans} cm.`}}
    a=2+Math.floor(r()*9);b=a+1+Math.floor(r()*8);ans=b-a;opts=shuffle(r,[ans,ans+1,Math.max(1,ans-1)]);return{t:pre+`Quel nombre faut-il ajouter à ${a} pour obtenir ${b} ?`,a:opts.map(String),c:opts.indexOf(ans),e:`${b}−${a}=${ans}.`}
  }
  const EN={
    be:[['I ___ happy today.','am'],['She ___ at school.','is'],['We ___ ready.','are'],['They ___ in the garden.','are'],['He ___ my friend.','is']],
    have:[['I ___ a blue bag.','have'],['She ___ two brothers.','has'],['We ___ English today.','have'],['Tom ___ a new book.','has']],
    vocab:[['Translate: « chat »','cat'],['Translate: « école »','school'],['Translate: « maison »','house'],['Translate: « ami »','friend'],['Translate: « livre »','book'],['Translate: « chien »','dog']],
    fr:[['Translate: “I am tired.”','je suis fatiguée'],['Translate: “She is at home.”','elle est à la maison'],['Translate: “We have a dog.”','nous avons un chien'],['Translate: “He is my friend.”','il est mon ami']],
    neg:[['Put in the negative: I am late.','i am not late'],['Put in the negative: She is tired.','she is not tired'],['Put in the negative: They are ready.','they are not ready']],
    order:[['Put in order: happy / is / She','she is happy'],['Put in order: are / We / ready','we are ready'],['Put in order: a dog / have / I','i have a dog']],
    correct:[['Correct: He are at home.','he is at home'],['Correct: They is ready.','they are ready'],['Correct: She have a book.','she has a book']],
    question:[['Complete: ___ you ready?','are'],['Complete: ___ she at school?','is'],['Complete: ___ they happy?','are']]
  };
  function englishQ(type,r,test){
    const row=pick(r,EN[type]), pre=test?'TEST · ':'', answer=row[1], alts=answer==="am"?["am","is","are"]:answer==="is"?["am","is","are"]:answer==="are"?["am","is","are"]:answer==="have"?["have","has","is"]:answer==="has"?["have","has","are"]:null;
    if(alts){return{t:pre+row[0],a:alts,c:alts.indexOf(answer),e:`La bonne réponse est “${answer}”.`}}
    return{t:pre+row[0],type:'text',accept:[answer,answer+'.',answer.replace(" not ","n't ")],e:`Réponse : ${answer}.`}
  }
  const mathTypes=['integer','priority','parentheses','power','fraction','decimal','proportion','conversion','geometry','logic'];
  const englishTypes=['be','have','vocab','fr','neg','order','correct','question'];
  function dailyQuestions(subject){
    const r=rng(DAY+'|'+subject+'|v2.4'), types=subject==='math'?mathTypes:englishTypes;
    // Rotate the starting family by day, then shuffle: at least 5 different families in practice.
    const offset=hash(DAY+'|'+subject)%types.length, rotated=types.slice(offset).concat(types.slice(0,offset));
    const practiceTypes=shuffle(r,rotated).slice(0,5).flatMap(x=>[x,x]).slice(0,10);
    const testTypes=shuffle(r,rotated).slice(0,5);
    return practiceTypes.map(t=>subject==='math'?mathQ(t,r,false):englishQ(t,r,false))
      .concat(testTypes.map(t=>subject==='math'?mathQ(t,r,true):englishQ(t,r,true)));
  }
  const previousBegin=begin;
  begin=function(k){
    lessons[k].q=dailyQuestions(k);
    S.exerciseHistory=S.exerciseHistory||[];
    if(!S.exerciseHistory.some(x=>x.day===DAY&&x.subject===k)){
      S.exerciseHistory.unshift({day:DAY,subject:k,types:lessons[k].q.map(q=>q.t)});
      S.exerciseHistory=S.exerciseHistory.slice(0,30);
      save();
    }
    previousBegin(k);
  };
  const previousDone=done;
  done=function(){previousDone();if(currentRec){currentRec.version='V2.4';save();}};
  // Version display is owned by the latest version layer (V2.6).
  document.querySelectorAll('[data-start="english"]').forEach(b=>{const card=b.closest('.card');if(card){card.querySelector('.muted').textContent='🇬🇧 ANGLAIS · NIVEAU ADAPTÉ';card.querySelector('h2').textContent='Anglais · mission du jour';card.querySelector('p').textContent='10 exercices variés + 5 questions de test. Les formats changent chaque jour.'}});
  document.querySelectorAll('[data-start="math"]').forEach(b=>{const card=b.closest('.card');if(card){card.querySelector('h2').textContent='Maths · mission du jour';card.querySelector('p').textContent='10 exercices variés + 5 questions de test. Plusieurs types de problèmes à chaque séance.'}});
})();