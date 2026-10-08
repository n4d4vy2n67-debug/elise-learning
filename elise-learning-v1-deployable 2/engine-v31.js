window.EliseEngine=(()=>{
 const pick=a=>a[Math.floor(Math.random()*a.length)], shuffle=a=>a.slice().sort(()=>Math.random()-.5);
 function mc(t,correct,wrong,e){let a=shuffle([correct,...wrong]);return{t,a,c:a.indexOf(correct),e}}
 function text(t,answer,e){return{t,type:"text",accept:Array.isArray(answer)?answer:[String(answer)],e}}
 const en={
 be:()=>mc(pick(["My friends ___ ready.","She ___ at school.","We ___ late.","Tom ___ happy."]),pick(["are","is"]),["am"],"Choisis am/is/are selon le sujet."),
 have:()=>mc(pick(["She ___ got a bike.","They ___ got a dog.","Tom ___ got a sister."]),pick(["has","have"]),["is"],"He/she/it → has got ; les autres → have got."),
 present:()=>mc(pick(["She ___ hockey on Saturday.","They ___ to school every day.","Tom ___ English."]),pick(["plays","go","studies"]),["play","goes"],"Au present simple, he/she/it prend généralement -s."),
 doDoes:()=>mc(pick(["___ she like music?","___ they play hockey?","___ Tom live here?"]),pick(["Does","Do"]),["Is"],"Does avec he/she/it ; Do avec I/you/we/they."),
 frequency:()=>mc("Choose an adverb meaning « jamais ».","never",["often","always"],"Never = jamais."),
 pronouns:()=>mc("Replace « Sarah » by a subject pronoun.","she",["her","they"],"Sarah → she."),
 possessives:()=>mc("This is ___ book. (elle)", "her",["his","their"],"Her = son/sa à elle."),
 articles:()=>mc("I have ___ apple.","an",["a","the"],"An devant un son voyelle."),
 plurals:()=>mc("Plural of « child »","children",["childs","childes"],"Child → children."),
 there:()=>mc("___ two books on the table.","There are",["There is","It are"],"Pluriel → There are."),
 can:()=>mc("She ___ swim very well.","can",["cans","does can"],"Après can, verbe à l'infinitif sans to."),
 imperative:()=>mc("Choose the correct instruction.","Open your book.",["You open your book?","To open your book."],"L'impératif utilise la base verbale."),
 questionWords:()=>mc("___ do you live? — In Brussels.","Where",["When","Who"],"Where demande un lieu."),
 prepositions:()=>mc("The lesson starts ___ 9 o'clock.","at",["in","on"],"At avec une heure précise."),
 presentContinuous:()=>mc("She ___ reading now.","is",["does","has"],"Present continuous = be + -ing."),
 comparison:()=>mc("A train is ___ than a bicycle.","faster",["fastest","more fast"],"Comparatif court : adjectif + -er."),
 someAny:()=>mc("Have you got ___ brothers?","any",["some","a"],"Dans une question, on emploie généralement any."),
 vocabDaily:()=>mc("« devoirs » in English","homework",["housework","lesson"],"Homework = devoirs scolaires."),
 sentenceOrder:()=>mc("Choose the correct sentence.","She often plays hockey.",["She plays often hockey.","Often she hockey plays."],"L'adverbe de fréquence précède généralement le verbe principal."),
 reading:()=>mc("Emma goes to school by bike. How does Emma go to school?","By bike.",["By bus.","On foot."],"La réponse est explicitement donnée dans la phrase."),
 translation:()=>mc("Translate « Elle aime l'anglais. »","She likes English.",["She like English.","Her likes English."],"She → likes au present simple.")
 };
 const math={
 integers:()=>{let a=Math.floor(Math.random()*21)-10,b=Math.floor(Math.random()*21)-10;return text(a+" + ("+b+") =",a+b,"Additionne les entiers relatifs.")},
 priorities:()=>{let a=2+Math.floor(Math.random()*8),b=2+Math.floor(Math.random()*8),d=2+Math.floor(Math.random()*5);return text(a+" + "+b+" × "+d+" =",a+b*d,"La multiplication se fait avant l'addition.")},
 powers:()=>{let a=2+Math.floor(Math.random()*7);return text(a+"² =",a*a,"Un carré multiplie le nombre par lui-même.")},
 fractions:()=>mc("Which fraction equals 1/2?","2/4",["2/3","3/4"],"2/4 se simplifie en 1/2."),
 decimals:()=>{let a=(Math.floor(Math.random()*90)+10)/10,b=(Math.floor(Math.random()*90)+10)/10;return text(a+" + "+b+" =",String(Math.round((a+b)*10)/10).replace(".",","),"Additionne les nombres décimaux.")},
 divisibility:()=>mc("Which number is divisible by 3?","18",["17","19"],"18 = 3 × 6."),
 percent:()=>{let n=pick([50,80,100,120,200]);return text("25% de "+n+" =",n/4,"25% = un quart.")},
 proportion:()=>text("3 cahiers coûtent 6 €. Combien coûtent 5 cahiers ?","10","Un cahier coûte 2 €, donc 5 coûtent 10 €."),
 literal:()=>mc("Reduce: 3x + 2x","5x",["6x","5"],"On additionne les coefficients."),
 distributivity:()=>mc("Develop: 3(x + 2)","3x + 6",["3x + 2","x + 6"],"Multiplie 3 par chaque terme."),
 equations:()=>{let x=2+Math.floor(Math.random()*10),a=2+Math.floor(Math.random()*8);return text("x + "+a+" = "+(x+a)+". x =",x,"Soustrais "+a+" des deux côtés.")},
 coordinates:()=>mc("Point A(3 ; -2). What is its x-coordinate?","3",["-2","1"],"La première coordonnée est l'abscisse."),
 angles:()=>mc("Un angle de 90° est...","droit",["aigu","obtus"],"Un angle droit mesure 90°."),
 triangles:()=>mc("Un triangle avec 3 côtés égaux est...","équilatéral",["isocèle seulement","rectangle"],"Équilatéral = trois côtés égaux."),
 perimeterArea:()=>{let a=2+Math.floor(Math.random()*8),b=2+Math.floor(Math.random()*8);return text("Aire d'un rectangle "+a+" cm × "+b+" cm =",a*b,"Aire = longueur × largeur.")},
 solids:()=>text("1 litre = ___ cm³","1000","1 L = 1 dm³ = 1000 cm³."),
 symmetry:()=>mc("Une symétrie axiale conserve-t-elle les longueurs ?","oui",["non","seulement parfois"],"La symétrie axiale conserve les distances."),
 statistics:()=>text("Moyenne de 4, 6 et 8 =","6","(4+6+8) ÷ 3 = 6."),
 wordProblems:()=>text("Un livre coûte 12 €. Deux livres et un stylo à 3 € coûtent...","27","2 × 12 + 3 = 27."),
 logic:()=>mc("Suite : 2, 4, 8, 16, ...","32",["24","30"],"Chaque terme est doublé.")
 };
 function theory(subject,item){let listen=subject==="english"?'<button id="listen">🔊 Écouter les exemples</button><br><br>':"";return '<div class="muted">NOTION '+item.order+'</div><h2>'+item.title+'</h2><p>'+item.scope+'</p><p><b>Méthode :</b> lis le rappel, puis applique-le dans plusieurs types de questions.</p>'+listen+'<button id="practice" class="primary">Commencer l\'entraînement →</button>'}
 function build(subject,index,context={}){let cat=subject==="english"?window.ELISE_CATALOG_EN:window.ELISE_CATALOG_MATH,item=cat[index%cat.length],gen=((window.ELISE_EXTRA&&window.ELISE_EXTRA[subject]&&window.ELISE_EXTRA[subject][item.id])||(subject==="english"?en:math)[item.id]),q=[],seen=new Set(),avoid=new Set((context.avoidQuestions||[]).map(String)),focus=(context.focusErrors||[]).map(x=>String(x.question||"")).filter(Boolean);for(let i=0;i<15;i++){let z,tries=0,key="",raw="";do{z=gen?gen():mc("Choisis la réponse correcte.","A",["B","C"],item.scope);raw=String(z.t||"").replace(/^TEST · /,"");key=raw+"|"+(z.type==="text"?(z.accept||[]).join("/"):(z.a||[]).join("/"));tries++}while((seen.has(key)||avoid.has(raw))&&tries<80);if(avoid.has(raw)&&context.retry){throw new Error("Insufficient fresh exercise variants for "+subject+"/"+item.id)}seen.add(key);z.t=(i>=10?"TEST · ":"")+raw;if(context.retry&&focus.length)z.retryFocus=focus[i%focus.length];q.push(z)}return{key:subject,topicIndex:index%cat.length,topicId:item.id,title:(subject==="english"?"🇬🇧 ":"➗ ")+item.title,theory:theory(subject,item),examples:item.scope,q}}
 return{build};
})();