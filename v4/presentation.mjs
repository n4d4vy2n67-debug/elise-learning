// Decorative presentation only. No storage, requests, scoring or lesson decisions.
const messages=['À ton rythme','C’est parti !','Bien joué !','Courage, tu vas y arriver','Un indice pour avancer','On reprend tranquillement','Ton objectif','Chaque essai compte','Bravo pour tes efforts !','Excellent, carton plein !'];
const seen=new Set();
let timer;
export function clearCompanion(app){clearTimeout(timer);app.querySelector('.rose-companion')?.remove();}
export function mountCompanion(app,{stage,subject,mode='normal',earned=0}={}){
 clearCompanion(app);
 app.dataset.lessonStage=stage||'';
 if(stage==='test'||!['theory','practice','completed','rewards'].includes(stage))return;
 const target=app.querySelector('#lesson')||app.querySelector('.card');if(!target)return;
 const index=stage==='rewards'?6:stage==='completed'?(mode==='qa'||earned<=0?7:earned>=200?9:8):stage==='practice'?1:0;
 const rail=document.createElement('aside');rail.className='rose-companion';rail.setAttribute('aria-hidden','true');rail.dataset.motion=String(index);
 const mascot=document.createElement('span');mascot.className='rose-mascot';
 const copy=document.createElement('p');copy.className='rose-message';
 rail.append(mascot,copy);
 if(subject&&stage!=='completed'){const art=document.createElement('img');art.className='lesson-subject-art';art.src=`./assets/${subject==='math'?'math':'english'}-rose.png`;art.alt='';art.loading='lazy';rail.append(art);}
 target.prepend(rail);setScene(rail,index,mode);
}
function setScene(rail,index,mode){rail.dataset.motion=String(index);rail.querySelector('.rose-mascot').style.backgroundPosition=`${index%5*25}% ${index<5?0:100}%`;rail.querySelector('.rose-message').textContent=mode==='qa'&&index===7?'Chaque essai compte · test qualité, sans points':messages[index];}
export function playCompanion(app,index,eventKey,mode='normal'){
 if(app.dataset.lessonStage==='test'||seen.has(eventKey))return false;
 const rail=app.querySelector('.rose-companion');if(!rail)return false;
 seen.add(eventKey);rail.classList.remove('playing',...Array.from({length:10},(_,i)=>`motion-${i}`));setScene(rail,index,mode);clearTimeout(timer);
 if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){rail.classList.add('playing',`motion-${index}`);timer=setTimeout(()=>{rail.classList.remove('playing',`motion-${index}`)},1800);}
 return true;
}
