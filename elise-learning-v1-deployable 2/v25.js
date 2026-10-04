// Elise Learning V2.5 · regularity XP + AI coach preparation
(function(){
  const VERSION25='V2.5';
  const DAILY_XP_CAP=400;
  const localDay=()=>{const d=new Date(),y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');return y+'-'+m+'-'+day};
  function sessionDay(x){const d=new Date(x.dateISO||0);if(!isFinite(d))return '';return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
  function sessionsToday(subject){const day=localDay();return (S.sessions||[]).filter(x=>x.subject===subject&&sessionDay(x)===day).length}
  function xpToday(){const day=localDay();return (S.sessions||[]).filter(x=>sessionDay(x)===day).reduce((sum,x)=>sum+Number(x.xpEarned||0),0)}
  const beforeDone=done;
  done=function(){
    const subject=lesson&&lesson.key;
    const previous=sessionsToday(subject);
    const xpBefore=Number(S.xp||0);
    const earnedBeforeToday=xpToday();
    beforeDone();
    if(!currentRec)return;
    const raw=Number(currentRec.xpEarned||0);
    const factor=previous===0?1:previous===1?.5:0;
    const subjectAward=Math.round(raw*factor);
    const remaining=Math.max(0,DAILY_XP_CAP-earnedBeforeToday);
    const awarded=Math.min(subjectAward,remaining);
    const correction=raw-awarded;
    if(correction>0)S.xp=Math.max(0,Number(S.xp||0)-correction);
    currentRec.version=VERSION25;
    currentRec.xpRaw=raw;
    currentRec.xpEarned=awarded;
    currentRec.xpFactor=factor;
    currentRec.dailyAttempt=previous+1;
    save();
    const earned=document.getElementById('earned');
    if(earned){
      earned.textContent='+ '+awarded+' XP';
      if(factor===.5)earned.textContent+=' · 2e séance : 50 %';
      if(factor===0)earned.textContent+=' · entraînement libre : plafond matière atteint';
      else if(awarded<subjectAward)earned.textContent+=' · plafond quotidien de '+DAILY_XP_CAP+' XP atteint';
    }
  };

  // AI Coach UI is ready; activation requires a secure server endpoint.
  function ensureCoach(){
    if(document.getElementById('aiCoach'))return;
    const box=document.createElement('div');
    box.id='aiCoach'; box.className='coachBox';
    box.innerHTML='<button id="coachOpen" class="coachBtn">🎙️ Demander de l’aide au Coach Elise</button><div id="coachPanel" hidden><div class="muted"><b>Coach Elise</b> · aide pédagogique</div><p id="coachStatus">Explique avec tes mots ce que tu ne comprends pas. Le coach donnera des indices sans donner directement la réponse.</p><button id="coachMic" class="primary">🎙️ Parler</button><textarea id="coachText" rows="2" placeholder="Ou écris ta question…"></textarea><button id="coachSend" class="primary">Envoyer ma question</button><div id="coachAnswer" class="feedback" hidden></div></div>';
    const quiz=document.getElementById('quiz'); if(quiz)quiz.parentNode.insertBefore(box,quiz);
    document.getElementById('coachOpen').onclick=()=>{const p=document.getElementById('coachPanel');p.hidden=!p.hidden};
    const ask=async text=>{
      const answer=document.getElementById('coachAnswer'); answer.hidden=false; answer.className='feedback'; answer.textContent='Coach en préparation…';
      const payload={message:text,subject:lesson?.key||'',question:lesson?.q?.[i]?.t||'',phase:i<PRACTICE?'practice':'test',level:'2e secondaire francophone',rule:'Donne un indice progressif, pas la réponse directe.'};
      try{
        const r=await fetch('/.netlify/functions/coach',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
        if(!r.ok)throw new Error('inactive');
        const data=await r.json(); answer.textContent=data.answer||'Je n’ai pas pu répondre.';
        if(data.answer&&'speechSynthesis' in window){const u=new SpeechSynthesisUtterance(data.answer);u.lang='fr-BE';speechSynthesis.speak(u)}
      }catch(e){answer.innerHTML='<b>🎙️ Coach Elise est prêt côté application.</b><br>L’activation de l’IA orale nécessite encore la connexion sécurisée au service IA.'}
    };
    document.getElementById('coachSend').onclick=()=>{const t=document.getElementById('coachText').value.trim();if(t)ask(t)};
    document.getElementById('coachMic').onclick=()=>{
      const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
      if(!SR){document.getElementById('coachStatus').textContent='La reconnaissance vocale de ce navigateur n’est pas disponible. Tu peux écrire ta question.';return}
      const r=new SR();r.lang='fr-BE';r.interimResults=false;
      document.getElementById('coachStatus').textContent='Je t’écoute…';
      r.onresult=e=>{const t=e.results[0][0].transcript;document.getElementById('coachText').value=t;document.getElementById('coachStatus').textContent='Question entendue : '+t;ask(t)};
      r.onerror=()=>document.getElementById('coachStatus').textContent='Je n’ai pas bien entendu. Réessaie ou écris ta question.';
      r.start();
    };
  }
  ensureCoach();

  const rules=document.querySelector('.rulesBox');
  if(rules){
    const p=document.createElement('p');
    p.innerHTML='<b>XP par matière et par jour</b><br>1re séance : 100 % des XP · 2e séance : 50 % · à partir de la 3e : 0 XP. Maximum '+DAILY_XP_CAP+' XP au total par jour. Tu peux toujours continuer à t’entraîner.';
    const button=rules.querySelector('button'); rules.insertBefore(p,button);
  }
  const style=document.createElement('style');
  style.textContent='.coachBox{background:#fff;border:2px solid #ded7ff;border-radius:20px;padding:14px;margin:12px 0}.coachBtn{width:100%;background:#ece8ff;color:#5543bd}.coachBox textarea{width:100%;margin-top:10px}';
  document.head.appendChild(style);
  document.title='Elise Learning · '+VERSION25;
  document.querySelectorAll('footer').forEach(x=>x.textContent='Elise Learning · '+VERSION25);
  document.querySelectorAll('.pill').forEach(x=>{if(/^V2\./.test(x.textContent.trim()))x.textContent=VERSION25});
})();