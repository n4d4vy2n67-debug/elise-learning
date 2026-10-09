/** Teacher-approved basic English building blocks. No unconstrained AI generation. */
const FAMILIES = ['recognize','complete','order','transform','produce'];
const catalog=[];
const banks=new Map();
function add(id,title,objective,theory,examples,rows,prerequisites=[]){
 const families=FAMILIES.map(id=>({id,label:({recognize:'Reconnaître',complete:'Compléter',order:'Remettre en ordre',transform:'Corriger',produce:'Produire une phrase'})[id]}));
 catalog.push({id,title,objective,prerequisites,theoryHtml:`<h2>${title}</h2><p>${theory}</p><p>Entraînement : choisir une phrase correcte, compléter, remettre les mots en ordre, corriger une erreur et écrire une phrase guidée. Utilise les exemples et le vocabulaire de cette fiche. Au mini-test, travaille sans aide.</p>`,examples,families});
 banks.set(id,rows);
}
// A marked segment specifies the sole tested contrast; distractors must be incorrect in this context.
function row(marked,fr,wrong,explanation,variants=[]){
 const parts=marked.split('|'); if(parts.length!==3)throw Error('Invalid teacher template '+marked);
 const [before,target,after]=parts;
 return {sentence:before+target+after,before,target,after,fr,wrong,explanation,variants};
}
const subjects=[
 ['I','je','am','have','do','my','me','Je'],['you','tu','are','have','do','your','you','Tu'],
 ['he','il','is','has','does','his','him','Il'],['she','elle','is','has','does','her','her','Elle'],
 ['we','nous','are','have','do','our','us','Nous'],['they','ils','are','have','do','their','them','Ils']
];
const cap=s=>s[0].toUpperCase()+s.slice(1);
const states=[['happy','content'],['tired','fatigué'],['ready','prêt'],['at school',"à l’école"],['at home','à la maison'],['in the garden','dans le jardin'],['in the kitchen','dans la cuisine'],['late','en retard'],['in the park','dans le parc'],['in the classroom','dans la classe']];
const objects=[['a dog','un chien'],['a cat','un chat'],['a bike','un vélo'],['a brother','un frère'],['a sister','une sœur'],['a blue bag','un sac bleu'],['a red pen','un stylo rouge'],['a book','un livre'],['a ball','un ballon'],['a phone','un téléphone'],['a ruler','une latte'],['a green pencil','un crayon vert']];
const verbs=[['play','plays','football','au football'],['read','reads','a book','un livre'],['eat','eats','an apple','une pomme'],['drink','drinks','water',"de l’eau"],['like','likes','music','la musique'],['watch','watches','television','la télévision'],['walk','walks','to school',"jusqu’à l’école"],['open','opens','the door','la porte'],['clean','cleans','the kitchen','la cuisine'],['visit','visits','a friend','un ami']];
const conjugations={play:['joue','joues','joue','joue','jouons','jouent'],read:['lis','lis','lit','lit','lisons','lisent'],eat:['mange','manges','mange','mange','mangeons','mangent'],drink:['bois','bois','boit','boit','buvons','boivent'],like:['aime','aimes','aime','aime','aimons','aiment'],watch:['regarde','regardes','regarde','regarde','regardons','regardent'],walk:['marche','marches','marche','marche','marchons','marchent'],open:['ouvre','ouvres','ouvre','ouvre','ouvrons','ouvrent'],clean:['nettoie','nettoies','nettoie','nettoie','nettoyons','nettoient'],visit:['rends visite à','rends visite à','rend visite à','rend visite à','rendons visite à','rendent visite à']};
function frenchVerb(s,v,obj){let text=`${s[6]} ${conjugations[v][subjects.indexOf(s)]} ${obj}`;return text.replace(/^Je ([aeioué])/i,"J’$1")+'.';}
const lexicon=objects.map(x=>`${x[0]} = ${x[1]}`).concat(verbs.map(x=>`${x[0]} = ${x[3]}`)).join(' ; ');
let rows=[];
for(const s of subjects)for(const [en,fr] of states){
 rows.push(row(`${cap(s[0])} |${s[2]}| ${en}.`,`${s[6]} ${s[0]==='I'?'suis':s[0]==='you'?'es':s[0]==='we'?'sommes':s[0]==='they'?'sont':'est'} ${fr}.`,['am','is','are'].filter(x=>x!==s[2]),`Avec ${s[0]}, on utilise ${s[2]}.`));
 rows.push(row(`${cap(s[0])} |${s[2]} not| ${en}.`,`Forme négative de : ${cap(s[0])} ${s[2]} ${en}.`,[`${s[2]} no`,s[2]],'La négation de BE se construit avec not après am/is/are.',s[2]==='am'?[]:[`${cap(s[0])} ${s[2]==='is'?"isn't":"aren't"} ${en}.`]));
}
add('be','TO BE','Utiliser am, is, are et leur négation.','BE = être. I am ; you/we/they are ; he/she/it is. Négation : be + not. is not = isn’t ; are not = aren’t. Pour écrire une phrase négative guidée, garde le sujet et ajoute not. Vocabulaire : happy = content ; tired = fatigué ; ready = prêt ; school = école ; home = maison ; garden = jardin ; kitchen = cuisine ; late = en retard ; park = parc ; classroom = classe.',['I am happy.','She is not tired.','They are at school.'],rows);
rows=[];
for(const s of subjects)for(const [en,fr] of objects){
 const haveFr=['ai','as','a','a','avons','ont'][subjects.indexOf(s)];
 rows.push(row(`${cap(s[0])} |${s[3]} got| ${en}.`,`${s[6]==='Je'?"J’":s[6]+' '}${haveFr} ${fr}.`,[s[3]==='has'?'have got':'has got',s[3]==='has'?'has get':'have get'],`Avec ${s[0]}, on utilise ${s[3]} got pour la possession.`));
 rows.push(row(`${cap(s[0])} |${s[3]} not got| ${en}.`,`Écris au négatif : ${cap(s[0])} ${s[3]} got ${en}.`,[`${s[3]} no got`,`${s[3]} got`],"Place not après have/has ; haven't/hasn't got sont aussi corrects.",[`${cap(s[0])} ${s[3]==='has'?"hasn't":"haven't"} got ${en}.`]));
}
add('have','HAVE GOT / HAS GOT','Exprimer une possession et sa négation.','I/you/we/they have got ; he/she/it has got. Négation : have not got / has not got ; haven’t got / hasn’t got. '+lexicon,['I have got a bike.','She has got a dog.','We have not got a cat.'],rows,['be']);
rows=[];
for(const s of subjects)for(const v of verbs){const target=s[4]==='does'?v[1]:v[0]; rows.push(row(`${cap(s[0])} |${target}| ${v[2]}.`,frenchVerb(s,v[0],v[3]),[target===v[0]?v[1]:v[0],target+'ing'],'Au présent simple, he/she/it prend -s ou -es ; les autres sujets utilisent la base.'));}
add('present','Present simple','Décrire des habitudes au présent simple affirmatif.','I/you/we/they + base du verbe ; he/she/it + -s. watch → watches. Le présent simple exprime une habitude ou un goût. '+lexicon,['I read a book.','She plays football.','They like music.'],rows,['be']);
rows=[];
for(const s of subjects)for(const v of verbs){
 rows.push(row(`${cap(s[0])} |${s[4]} not| ${v[0]} ${v[2]}.`,`Écris au négatif : ${cap(s[0])} ${s[4]==='does'?v[1]:v[0]} ${v[2]}.`,[s[4]==='does'?'do not':'does not',s[4]==='does'?'does no':'do no'],'Au négatif : do/does + not + base du verbe.',[`${cap(s[0])} ${s[4]==='does'?"doesn't":"don't"} ${v[0]} ${v[2]}.`]));
 rows.push(row(`|${cap(s[4])}| ${s[0]} ${v[0]} ${v[2]}?`,`Transforme en question fermée : ${cap(s[0])} ${s[4]==='does'?v[1]:v[0]} ${v[2]}.`,[s[4]==='does'?'Do':'Does','Is'],'Dans une question au présent simple : Do/Does + sujet + base du verbe.'));
}
add('doDoes','DO / DOES','Construire questions et négations au présent simple.','Do avec I/you/we/they ; does avec he/she/it. Question : Does she play football? Négation : She does not play football. Le verbe garde sa base après do/does. don’t = do not ; doesn’t = does not. '+lexicon,['Do you like music?','Does she read a book?','He does not watch television.'],rows,['present']);
rows=[];
const freqs=[['always','toujours'],['usually','habituellement'],['often','souvent'],['sometimes','parfois'],['never','jamais']];
for(const s of subjects)for(const v of verbs.slice(0,6))for(const [en,fr] of freqs){const form=s[4]==='does'?v[1]:v[0];rows.push(row(`${cap(s[0])} |${en}| ${form} ${v[2]}.`,`Écris avec « ${en} » (= ${fr}) devant le verbe : ${cap(s[0])} ${form} ${v[2]}.`,[en+'s',en+'ly'],"L’adverbe de fréquence se place ici avant le verbe principal."));}
add('frequency','Adverbes de fréquence','Placer et comprendre les adverbes de fréquence.','always = toujours ; usually = habituellement ; often = souvent ; sometimes = parfois ; never = jamais. Place l’adverbe avant le verbe principal : She often reads. Avec BE, il vient après BE : She is often tired. never exprime déjà une négation. '+lexicon,['I always drink water.','She often reads a book.','We never watch television.'],rows,['present']);
rows=[];
const persons=[['Tom','he','him'],['Anna','she','her'],['Tom and Anna','they','them'],['Anna and I','we','us'],['the dog','it','it']];
for(const [name,subject,object]of persons)for(const [en]of states){rows.push(row(`|${cap(subject)}| ${subject==='he'||subject==='she'||subject==='it'?'is':'are'} ${en}.`,`Remplace « ${name} » par un pronom sujet : ${cap(name)} ${subject==='he'||subject==='she'||subject==='it'?'is':'are'} ${en}.`,['Me','Him','Them'].filter(x=>x.toLowerCase()!==subject).slice(0,2),'Le pronom sujet fait l’action ; he pour Tom, she pour Anna, they pour plusieurs personnes, we pour Anna et moi, it pour le chien.'));
for(const v of ['see','help','like','know'])rows.push(row(`I ${v} |${object}|.`,`Remplace uniquement le nom complément : I ${v} ${name}.`,['he','she','they','we'].filter(x=>x!==object).slice(0,2),'Après le verbe, utilise un pronom complément : him, her, them, us ou it.'));
}
add('pronouns','Pronoms personnels','Choisir pronoms sujets et compléments.','Sujets : I, you, he, she, it, we, they. Compléments : me, you, him, her, it, us, them. I see Tom → I see him. Tom is happy → He is happy. Tom = garçon ; Anna = fille ; Anna and I = nous ; dog = chien. see = voir ; help = aider ; like = aimer ; know = connaître.',['He is happy.','I see her.','We are ready.'],rows,['be']);
rows=[];
for(const s of subjects)for(const [en,fr]of objects){const noun=en.replace(/^(a|an) /,'');rows.push(row(`This is |${s[5]}| ${noun}.`,`Complète avec le possessif correspondant à « ${s[0]} » : This is ___ ${noun}.`,['my','your','his','her','our','their'].filter(x=>x!==s[5]).slice(0,2),`Le possessif correspondant à ${s[0]} est ${s[5]}.`));}
const poss=[['mine','my'],['yours','your'],['his','his'],['hers','her'],['ours','our'],['theirs','their']];
for(const [independent,adjective]of poss)for(const [en]of objects){const noun=en.replace(/^(a|an) /,'');rows.push(row(`This ${noun} is |${independent}|.`,`Réécris sans répéter le nom : This is ${adjective} ${noun}.`,[adjective==='his'?'her':adjective,independent+"'s"].filter(x=>x!==independent),'my/your/her/our/their précèdent le nom ; mine/yours/hers/ours/theirs remplacent le groupe nominal.'));}
add('possessives','Possessifs','Exprimer à qui appartient quelque chose.','I → my/mine ; you → your/yours ; he → his/his ; she → her/hers ; we → our/ours ; they → their/theirs. This is my bag → This bag is mine. my précède le nom ; mine remplace my bag. this = ceci ; '+lexicon,['This is her book.','This book is hers.','This is our bike.'],rows,['pronouns']);
rows=[];
const articleNouns=[['apple','an'],['orange','an'],['egg','an'],['umbrella','an'],['elephant','an'],['ant','an'],['ice cream','an'],['old book','an'],['blue bag','a'],['dog','a'],['cat','a'],['bike','a'],['pencil','a'],['book','a'],['ruler','a'],['ball','a'],['phone','a'],['chair','a'],['table','a'],['green pen','a']];
for(const [noun,article]of articleNouns)for(const lead of ['I have got','She has got','We have got','They have got','He has got']) rows.push(row(`${lead} |${article}| ${noun}.`,`Écris cette phrase avec l’article indéfini correct : ${lead} ___ ${noun}.`,[article==='a'?'an':'a','the'],'a devant un son consonne ; an devant un son voyelle. La consigne demande ici un article indéfini.'));
add('articles','Articles','Choisir a/an et distinguer the et absence d’article.','a = un/une devant un son consonne ; an devant un son voyelle. the désigne une chose connue : I have a dog. The dog is black. Pas d’article pour les généralités au pluriel : Dogs are animals. Dans les exercices a/an, on demande explicitement l’article indéfini. apple=pomme ; orange=orange ; egg=œuf ; umbrella=parapluie ; elephant=éléphant ; ant=fourmi ; ice cream=glace ; old=vieux ; chair=chaise ; table=table.',['I have got an apple.','She has got a dog.','The dog is black.'],rows,['have']);
rows=[];
const plurals=[['cat','cats'],['dog','dogs'],['book','books'],['pen','pens'],['bag','bags'],['bike','bikes'],['apple','apples'],['orange','oranges'],['chair','chairs'],['table','tables'],['box','boxes'],['bus','buses'],['watch','watches'],['class','classes'],['baby','babies'],['city','cities'],['child','children'],['foot','feet'],['tooth','teeth'],['person','people']];
for(const [one,many]of plurals)for(const n of [2,3,4,5,6,7])rows.push(row(`I can see ${n} |${many}|.`,`Écris au pluriel le mot donné : I can see ${n} ___ (${one}).`,[one,one+'es'].filter(x=>x!==many).concat([many+'s']).slice(0,2),`${one} devient ${many} au pluriel.`));
add('plurals','Pluriels','Former des pluriels réguliers et fréquents irréguliers.','Souvent -s ; après s/x/ch, -es ; consonne+y → -ies. child→children ; foot→feet ; tooth→teeth ; person→people. can see = peut voir. Les mots au singulier sont donnés dans les consignes.',['I can see two cats.','I can see three children.','I can see four boxes.'],rows,['articles']);
rows=[];
for(const [one,many]of plurals.slice(0,14))for(const loc of ['in the garden','in the park','in the classroom','in the kitchen']){
 rows.push(row(`|There is| a ${one} ${loc}.`,`Décris ce que tu vois : a ${one} ${loc}. Commence par There.`,['There are','There am'],'There is pour un élément singulier.'));
 rows.push(row(`|There are| three ${many} ${loc}.`,`Décris ce que tu vois : three ${many} ${loc}. Commence par There.`,['There is','There be'],'There are pour plusieurs éléments.'));
}
add('there','THERE IS / THERE ARE','Décrire la présence d’un ou plusieurs éléments.','There is = il y a un élément ; there are = il y a plusieurs éléments. a cat → there is a cat ; three cats → there are three cats. garden=jardin ; park=parc ; classroom=classe ; kitchen=cuisine.',['There is a cat in the garden.','There are three books in the classroom.'],rows,['plurals','be']);
rows=[];
const abilities=[['swim','nager'],['run','courir'],['sing','chanter'],['dance','danser'],['read','lire'],['cook','cuisiner'],['ride a bike','faire du vélo'],['play football','jouer au football'],['speak English','parler anglais'],['help a friend','aider un ami']];
for(const s of subjects)for(const [en,fr]of abilities){
 rows.push(row(`${cap(s[0])} can |${en}|.`,`Exprime cette capacité avec can : ${s[0]} / ${en}.`,[en+'s',en+'ing'],'Après can, le verbe reste à sa base pour tous les sujets.'));
 rows.push(row(`${cap(s[0])} |cannot| ${en}.`,`Exprime l’incapacité : ${s[0]} / ${en}. Utilise cannot ou can’t.`,['can','cannots'],'cannot / can’t exprime une incapacité.',[`${cap(s[0])} can't ${en}.`]));
}
add('can','CAN / CAN’T','Exprimer une capacité ou une incapacité.','Tous les sujets prennent can + base du verbe. Négation : cannot ou can’t. Question : Can you swim? can peut aussi demander la permission : Can I open the door? '+abilities.map(x=>x.join(' = ')).join(' ; '),['I can swim.','She cannot sing.','Can I open the door?'],rows,['pronouns']);
rows=[];
const commands=[['Open','the door','Ouvre la porte'],['Close','the door','Ferme la porte'],['Open','the window','Ouvre la fenêtre'],['Close','the window','Ferme la fenêtre'],['Read','the book','Lis le livre'],['Clean','the kitchen','Nettoie la cuisine'],['Wash','your hands','Lave-toi les mains'],['Listen','to the teacher','Écoute le professeur'],['Write','your name','Écris ton nom'],['Take','your bag','Prends ton sac'],['Drink','some water',"Bois de l’eau"],['Look','at the board','Regarde le tableau']];
for(const [v,obj,fr]of commands)for(const ending of ['.',' now.',' please.',' now, please.']){
 rows.push(row(`|${v}| ${obj}${ending}`,`${fr}${ending.includes('now')?' maintenant':''}${ending.includes('please')?", s’il te plaît":''}.`,[v+'s',v+'ing'],'Impératif affirmatif : commence directement par la base du verbe, sans sujet.'));
 rows.push(row(`|Do not| ${v.toLowerCase()} ${obj}${ending}`,`Écris l’interdiction correspondant à : ${v} ${obj}${ending}`,['Not','Does not'],'Impératif négatif : Do not / Don’t + base du verbe.',[`Don't ${v.toLowerCase()} ${obj}${ending}`]));
}
add('imperative','Impératif','Donner une consigne ou une interdiction.','Affirmatif : base du verbe sans sujet. Open the door. Négatif : Do not / Don’t + base. now=maintenant ; please=s’il te plaît. '+commands.map(x=>`${x[0]} ${x[1]} = ${x[2]}`).join(' ; '),['Open the door, please.','Do not close the window.'],rows,['can']);
rows=[];
const wh=[['Where','is the dog','In the garden.','lieu'],['Who','is at the door','Anna.','personne'],['When','is the match','On Saturday.','moment'],['Why','are you tired','Because I worked.','raison'],['How','are you','Fine, thank you.','état'],['What','is in the bag','A book.','chose'],['Where','is the cat','In the kitchen.','lieu'],['Who','is your teacher','Mr Brown.','personne'],['When','is your birthday','In May.','moment'],['What','is on the table','A pen.','chose'],['Why','is she late','Because the bus is late.','raison'],['How','do you go to school','By bus.','manière'],['Where','is your bike','In the park.','lieu'],['Who','is your friend','Tom.','personne'],['What','is your favourite sport','Hockey.','chose'],['When','do you play hockey','On Wednesday.','moment'],['How','old are you','Twelve.','âge'],['Where','are the books','In the bag.','lieu'],['Who','is in the kitchen','My mother.','personne'],['When','is the lesson','At nine.','moment']];
for(const [word,rest,answer,kind]of wh) rows.push(row(`|${word}| ${rest}?`,`Écris la question avec le mot interrogatif correspondant à la réponse « ${answer} » : ___ ${rest}?`,['Who','What','Where','When','Why','How'].filter(x=>x!==word).slice(0,2),`${word} demande ${kind}. La réponse donnée fixe le sens.`));
add('questionWords','Mots interrogatifs','Choisir un mot interrogatif à partir de la réponse.','Who=qui ; what=quoi/quel ; where=où ; when=quand ; why=pourquoi ; how=comment ; how old=quel âge. Lis la réponse pour choisir. because=parce que ; birthday=anniversaire ; favourite=préféré ; match=match ; lesson=leçon.',['Where is the dog?','When is the match?','Who is your friend?'],rows,['be','doDoes']);
rows=[];
const places=[['in','inside the box','dans la boîte'],['on','on top of the table','sur la table'],['under','below the chair','sous la chaise'],['next to','beside the bag','à côté du sac'],['behind','at the back of the door','derrière la porte'],['in front of','before the house','devant la maison']];
for(const thing of ['The ball','The book','The pen','The bag','The cat','The dog'])for(const [prep,meaning,fr]of places){const object=meaning.split('the ').at(-1);rows.push(row(`${thing} is |${prep}| the ${object}.`,`Décris cette position : ${thing} / ${fr}.`,['in','on','under','behind'].filter(x=>x!==prep).slice(0,2),`${prep} = ${fr.split(' ').slice(0,-2).join(' ')} ; respecte la position indiquée.`));}
for(const [prep,time]of [['on','Monday'],['on','Tuesday'],['on','Wednesday'],['on','Saturday'],['in','May'],['in','June'],['in','July'],['in','October'],['at','nine o’clock'],['at','ten o’clock'],['at','noon'],['at','midnight']]) for(const lead of ['The lesson is','The match is','The party is'])rows.push(row(`${lead} |${prep}| ${time}.`,`Complète la préposition de temps : ${lead} ___ ${time}.`,['in','on','at'].filter(x=>x!==prep),'on + jour ; in + mois ; at + heure ou noon/midnight.'));
add('prepositions','Prépositions','Indiquer une position et un moment.','Lieu : in=dans ; on=sur ; under=sous ; next to=à côté ; behind=derrière ; in front of=devant. Temps : on + jour ; in + mois ; at + heure ; at noon / at midnight. box=boîte ; table=table ; chair=chaise ; door=porte ; house=maison.',['The ball is under the chair.','The match is on Saturday.','The lesson is at nine o’clock.'],rows,['be']);
rows=[];
const continuous=[['reading','a book'],['playing','football'],['eating','an apple'],['drinking','water'],['watching','television'],['walking','to school'],['opening','the door'],['cleaning','the kitchen'],['singing','a song'],['cooking','dinner']];
for(const s of subjects)for(const [v,obj]of continuous){rows.push(row(`${cap(s[0])} |${s[2]} ${v}| ${obj} now.`,`Décris l’action en cours : ${s[0]} / ${v} ${obj} / now.`,[v,`${s[2]} ${v.replace(/ing$/,'')}`],'Present continuous = am/is/are + verbe en -ing. now indique ici une action en cours.'));}
add('presentContinuous','Present continuous','Décrire une action en cours avec BE + -ing.','I am ; he/she/it is ; you/we/they are + -ing. read→reading ; play→playing ; eat→eating ; drink→drinking ; watch→watching ; walk→walking ; open→opening ; clean→cleaning ; sing→singing ; cook→cooking. now=maintenant ; song=chanson ; dinner=repas du soir. '+lexicon,['I am reading a book now.','She is playing football now.'],rows,['be','present']);
rows=[];
const adjectives=[['tall','taller','tallest','grand'],['small','smaller','smallest','petit'],['old','older','oldest','âgé'],['young','younger','youngest','jeune'],['fast','faster','fastest','rapide'],['slow','slower','slowest','lent'],['short','shorter','shortest','court'],['long','longer','longest','long'],['big','bigger','biggest','gros'],['happy','happier','happiest','heureux'],['good','better','best','bon'],['beautiful','more beautiful','most beautiful','beau']];
for(const [a,cmp,sup]of adjectives)for(const pair of [['Tom','Anna'],['Anna','Tom'],['this dog','that dog'],['this bike','that bike']]){
 rows.push(row(`${cap(pair[0])} is |${cmp}| than ${pair[1]}.`,`Compare avec l’adjectif « ${a} » : ${pair[0]} / ${pair[1]}.`,[a,sup],'Comparatif : -er ou more + adjectif ; puis than. good → better.'));
 rows.push(row(`${cap(pair[0])} is the |${sup}| of the three.`,`Exprime le maximum parmi trois avec « ${a} » : ${pair[0]}. Commence par ${cap(pair[0])} is the.`,[a,cmp],'Superlatif : the + -est ou most ; good → best.'));
}
add('comparison','Comparatifs et superlatifs','Comparer deux éléments et exprimer un maximum.','Comparatif : tall→taller than ; beautiful→more beautiful than. Superlatif : the tallest ; the most beautiful. big→bigger/biggest ; happy→happier/happiest ; good→better/best. '+adjectives.map(x=>`${x[0]}=${x[3]}`).join(' ; ')+'. this=ce/cette ; that=cet autre ; of the three=des trois.',['Tom is taller than Anna.','Anna is the youngest of the three.'],rows,['be']);
rows=[];
const quant=[['apples','pommes','many'],['books','livres','many'],['pens','stylos','many'],['dogs','chiens','many'],['oranges','oranges','many'],['water','eau','much'],['milk','lait','much'],['rice','riz','much'],['bread','pain','much'],['juice','jus','much']];
for(const [noun,fr,how]of quant)for(const location of ['in the kitchen','in the bag','on the table','at home']){
 rows.push(row(`We have got |some| ${noun} ${location}.`,`Complète la phrase affirmative avec some ou any : We have got ___ ${noun} ${location}.`,['any','a'],'Dans cette phrase affirmative neutre, utilise some.'));
 rows.push(row(`We have not got |any| ${noun} ${location}.`,`Complète la phrase négative avec some ou any : We have not got ___ ${noun} ${location}.`,['some','a'],'Dans cette phrase négative, utilise any.'));
}
for(const [noun,,how]of quant)rows.push(row(`How |${how}| ${noun} have you got?`,`Écris la question de quantité avec much ou many : ___ ${noun} have you got?`,[how==='much'?'many':'much','some'],'many + noms dénombrables pluriels ; much + noms indénombrables.'));
add('someAny','SOME / ANY','Utiliser some/any et much/many dans des contextes simples.','some pour une phrase affirmative neutre ; any pour une négation ou une question neutre. Les offres/politesse avec some seront étudiées plus tard. many avec les noms que l’on compte ; much avec eau, lait, riz, pain, jus. '+quant.map(x=>`${x[0]}=${x[1]}`).join(' ; '),['We have got some apples.','We have not got any milk.','How much water have you got?'],rows,['have','plurals']);
rows=[];
const words=[['book','livre'],['pen','stylo'],['pencil','crayon'],['ruler','latte'],['bag','sac'],['school','école'],['teacher','professeur'],['classroom','classe'],['brother','frère'],['sister','sœur'],['mother','mère'],['father','père'],['kitchen','cuisine'],['garden','jardin'],['door','porte'],['window','fenêtre'],['chair','chaise'],['table','table'],['dog','chien'],['cat','chat'],['bike','vélo'],['ball','ballon'],['apple','pomme'],['milk','lait'],['water','eau'],['bread','pain'],['friend','ami'],['phone','téléphone'],['music','musique'],['football','football'],['house','maison'],['bedroom','chambre']];
for(const [en,fr]of words){rows.push(row(`The English word for ${fr} is |${en}|.`,`Écris la phrase : The English word for ${fr} is ___ .`,['book','dog','water','garden'].filter(x=>x!==en).slice(0,2),`${fr} se dit ${en} en anglais.`));}
add('vocabDaily','Vocabulaire courant','Reconnaître et écrire les mots du quotidien.','Mots à connaître : '+words.map(x=>x.join(' = ')).join(' ; ')+'. The English word for … is … = Le mot anglais pour … est … . Les exercices restent sur ce vocabulaire.',['The English word for livre is book.','The English word for école is school.'],rows);
rows=[];
for(const s of subjects)for(const v of verbs){const form=s[4]==='does'?v[1]:v[0];rows.push(row(`${cap(s[0])} |${form}| ${v[2]} after school.`,`Construis la phrase : ${s[0]} / ${form} / ${v[2]} / after school.`,[s[4]==='does'?v[0]:v[1],form+'ing'],'Ordre affirmatif : sujet + verbe + complément + moment. after school se place ici à la fin.'));}
add('sentenceOrder','Construction de phrases','Construire une phrase anglaise simple dans le bon ordre.','Ordre étudié : sujet + verbe + complément + moment. She reads a book after school. after school = après l’école. Dans ces exercices, conserve tous les mots et cet ordre. '+lexicon,['She reads a book after school.','We play football after school.'],rows,['present']);
rows=[];
const readers=[['Anna','she'],['Tom','he'],['Lucy','she'],['Ben','he'],['Eva','she'],['Sam','he']];
for(const [name,pronoun]of readers)for(const [pet,petfr]of objects.slice(0,10)){
 const sentence=`${name} has got ${pet}. ${cap(pronoun)} is at home.`;
 rows.push({...row(`${name} has got |${pet}|.`,`Texte : ${sentence} Question : What has ${name} got? Réponds par une phrase commençant par ${name}.`,objects.map(x=>x[0]).filter(x=>x!==pet).slice(0,2),`Le texte dit explicitement : ${name} has got ${pet}.`),context:sentence});
}
add('reading','Compréhension','Retrouver une information explicite dans un court texte.','Lis le texte et retrouve l’information demandée. What has Anna got? → Anna has got a dog. N’invente pas une information absente. Les exercices de remise en ordre et correction reformulent la réponse au texte. '+lexicon,['Anna has got a dog. She is at home.','Tom has got a bike. He is at home.'],rows,['have','pronouns']);
rows=[];
for(const s of subjects)for(const v of verbs){const form=s[4]==='does'?v[1]:v[0];rows.push(row(`${cap(s[0])} |${form}| ${v[2]}.`,frenchVerb(s,v[0],v[3]),[form===v[0]?v[1]:v[0],form+'ing'],'Traduis le sujet, puis le verbe conjugué et le complément ; attention au -s avec he/she.'));}
add('translation','Traduction','Traduire des phrases courtes avec le vocabulaire appris.','Traduction guidée français → anglais : sujet + verbe + complément. je=I ; tu=you ; il=he ; elle=she ; nous=we ; ils=they. Présent simple : -s avec he/she/it. '+lexicon,['She reads a book.','We drink water.','He likes music.'],rows,['present','vocabDaily']);
// Reserve enough genuinely distinct short questions for six daily sessions.
const extraWh=[
 ['Where','is Lucy','In the garden.','lieu'],['Where','is Ben','At school.','lieu'],['Where','is Eva','At home.','lieu'],['Where','is Sam','In the park.','lieu'],
 ['Where','is your mother','In the kitchen.','lieu'],['Where','is your father','At home.','lieu'],['Where','is your sister','At school.','lieu'],['Where','is your brother','In the garden.','lieu'],
 ['Where','is the ball','Under the chair.','lieu'],['Where','is the pen','On the table.','lieu'],['Where','is the ruler','In the bag.','lieu'],['Where','is the phone','On the table.','lieu'],
 ['Where','is the teacher','In the classroom.','lieu'],['Where','are your friends','In the park.','lieu'],['Where','are the cats','In the garden.','lieu'],['Where','are the apples','In the kitchen.','lieu'],
 ['Who','is in the garden','Tom.','personne'],['Who','is at school','Anna.','personne'],['Who','is in the park','Lucy.','personne'],['Who','is at home','Ben.','personne'],
 ['Who','is your brother','Sam.','personne'],['Who','is your sister','Eva.','personne'],['Who','is your father','Mr Green.','personne'],['Who','is your mother','Mrs Green.','personne'],
 ['When','is the party','On Friday.','moment'],['When','is the test','On Monday.','moment'],['When','is dinner','At six.','moment'],['When','is lunch','At noon.','moment'],
 ['When','is the concert','On Tuesday.','moment'],['When','is the football match','On Sunday.','moment'],['When','is the English lesson','At ten.','moment'],['When','is the maths lesson','At eleven.','moment'],
 ['What','is in the kitchen','A table.','chose'],['What','is under the chair','A ball.','chose'],['What','is in the garden','A bike.','chose'],['What','is in the classroom','A board.','chose'],
 ['What','is your favourite colour','Blue.','chose'],['What','is your favourite food','Rice.','chose'],['How','old is your sister','Thirteen.','âge'],['How','old is your brother','Nine.','âge']
];
for(const [word,rest,answer,kind]of extraWh)banks.get('questionWords').push(row(`|${word}| ${rest}?`,`Choisis le mot interrogatif à partir de la réponse « ${answer} » : ___ ${rest}?`,['Who','What','Where','When','Why','How'].filter(x=>x!==word).slice(0,2),`${word} demande ${kind}. La réponse donnée fixe le sens.`));
const extraWords=[['desk','bureau'],['board','tableau'],['lesson','leçon'],['homework','devoirs'],['test','contrôle'],['match','match'],['party','fête'],['birthday','anniversaire'],['lunch','repas de midi'],['dinner','repas du soir'],['breakfast','petit-déjeuner'],['rice','riz'],['juice','jus'],['egg','œuf'],['orange','orange'],['umbrella','parapluie'],['swimming','natation'],['hockey','hockey'],['shoes','chaussures'],['shirt','chemise']];
for(const [en,fr]of extraWords)banks.get('vocabDaily').push(row(`The English word for ${fr} is |${en}|.`,`Écris la phrase : The English word for ${fr} is ___ .`,['book','dog','water','garden'].filter(x=>x!==en).slice(0,2),`${fr} se dit ${en} en anglais.`));
catalog.find(c=>c.id==='vocabDaily').theoryHtml+=`<p>${extraWords.map(x=>x.join(' = ')).join(' ; ')}</p>`;
catalog.find(c=>c.id==='questionWords').theoryHtml+='<p>party=fête ; test=contrôle ; dinner=repas du soir ; lunch=repas de midi ; concert=concert ; food=nourriture ; colour=couleur ; board=tableau ; Friday=vendredi ; Sunday=dimanche ; eleven=onze ; thirteen=treize ; nine=neuf.</p>';
// Complete the introductory chapter scope with guided questions and reference contexts.
for(const s of subjects)for(const [en]of states){
 banks.get('be').push(row(`|${cap(s[2])}| ${s[0]} ${en}?`,`Transforme en question fermée : ${cap(s[0])} ${s[2]} ${en}.`,['Am','Is','Are'].filter(x=>x!==cap(s[2])),"Question avec BE : place am/is/are avant le sujet."));
}
for(const s of subjects)for(const [en]of objects){
 banks.get('have').push(row(`|${cap(s[3])}| ${s[0]} got ${en}?`,`Transforme en question fermée : ${cap(s[0])} ${s[3]} got ${en}.`,[s[3]==='has'?'Have':'Has','Do'],"Question de possession : Have/Has + sujet + got + objet."));
}
for(const s of subjects)for(const [en,fr]of freqs)for(const [state]of states.slice(0,5)){
 banks.get('frequency').push(row(`${cap(s[0])} ${s[2]} |${en}| ${state}.`,`Ajoute « ${en} » (= ${fr}) après BE : ${cap(s[0])} ${s[2]} ${state}.`,[en+'s',en+'ly'],"Avec BE, l’adverbe de fréquence vient après am/is/are."));
}
for(const [noun]of articleNouns.slice(0,16)){
 banks.get('articles').push(row(`|The| ${noun} is here.`,`Tu as déjà présenté un objet : I have got ${articleNouns.find(x=>x[0]===noun)[1]} ${noun}. Parle maintenant de CE même objet : ___ ${noun} is here.`,['A','An'],"L’objet est déjà identifié : on utilise the. here = ici."));
}
for(const noun of ['music','football','water','milk','bread']){
 banks.get('articles').push(row(`I like |${noun}|.`,`Exprime un goût général, sans article : I like ___ (${noun}).`,['the '+noun,'a '+noun],"Pour ce goût général, le nom indénombrable ou le sport n’a pas d’article."));
}
for(const [noun]of quant){
 banks.get('someAny').push(row(`Have you got |any| ${noun}?`,`Complète la question neutre avec some ou any : Have you got ___ ${noun}?`,['some','a'],"Cette question demande simplement s’il y en a : any."));
}
const extraTheory={be:' Pour une question : am/is/are + sujet + complément. She is ready → Is she ready?',have:' Pour une question : Have/Has + sujet + got + objet. She has got a dog → Has she got a dog?',articles:' here = ici. I like music exprime un goût général, sans article.'};
for(const c of catalog)if(extraTheory[c.id])c.theoryHtml+=`<p>${extraTheory[c.id]}</p>`;
export const englishChapters=catalog;
function hash(s){let n=2166136261;for(const c of String(s))n=Math.imul(n^c.charCodeAt(0),16777619);return n>>>0;}
function rng(seed){let n=hash(seed);return()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296;};}
function shuffle(items,random){const a=[...items];for(let i=a.length-1;i>0;i--){let j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function equivalentSentences(r){const out=[r.sentence,...r.variants];
 // Only contractions preserving this exact sentence; no token-dropping normalisation.
 for(const x of [...out]){
  let y=x.replace(/\bI am\b/g,"I'm").replace(/\b(He|She|It|Tom|Anna|Lucy|Ben|Eva|Sam) is\b/g,(_,s)=>s+"'s").replace(/\b(You|We|They) are\b/g,(_,s)=>s+"'re");
  if(y!==x)out.push(y);
  const z=x.replace(/\b(I|You|We|They) have (not )?got\b/g,(_,s,neg)=>s+"'ve "+(neg||'')+"got").replace(/\b(He|She|It|Tom|Anna|Lucy|Ben|Eva|Sam) has (not )?got\b/g,(_,s,neg)=>s+"'s "+(neg||'')+"got");
  if(z!==x)out.push(z);
 }
 return sentenceVariants(out);
}
function sentenceVariants(sentences){
 // Punctuation is not the grammar objective; preserve all meaning-bearing words.
 const out=[];
 for(const sentence of sentences){
  for(const x of [sentence,sentence.replace(/, (?=please\b)/g,' ')]){
   out.push(x,x.replace(/[.?!]$/,''));
  }
 }
 return [...new Set(out)];
}
function question(chapterId,r,family,random){
 const fp=`en:${chapterId}:${family}:${r.sentence}`;
 const base={id:'en-'+hash(fp).toString(16),fingerprint:fp,family,prompt:'',type:'text',options:[],accepted:[],correctIndex:null,explanation:r.explanation,skills:[chapterId],context:r.context||null};
 const context=r.context?`Lis : ${r.context}\n`:'';
 if(family==='recognize'){
  const options=shuffle([r.sentence,...r.wrong.map(w=>r.before+w+r.after)],random);
  return {...base,type:'choice',prompt:context+(r.context?'Choisis la réponse correcte à : What has '+r.sentence.split(' ')[0]+' got?':`Choisis la phrase correcte pour cette consigne : ${r.fr}`),options,correctIndex:options.indexOf(r.sentence),accepted:[r.sentence]};
 }
 if(family==='complete')return {...base,prompt:context+`${r.fr}\nComplète uniquement le trou : ${r.before}___${r.after}`,accepted:[r.target,...r.variants.filter(v=>v.startsWith(r.before)&&v.endsWith(r.after)).map(v=>v.slice(r.before.length,v.length-r.after.length))]};
 if(family==='order'){
  const tokens=r.sentence.replace(/[.?]$/,'').split(' ');let mixed=shuffle(tokens,random);if(mixed.join(' ')===tokens.join(' '))mixed=mixed.slice(1).concat(mixed[0]);
  return {...base,prompt:context+`${r.fr}\nRemets tous les mots dans l’ordre (phrase complète) : ${mixed.join(' / ')}`,accepted:sentenceVariants([r.sentence])};
 }
 if(family==='transform')return {...base,prompt:context+`${r.fr}\nCorrige seulement « ${r.wrong[0]} » et écris la phrase complète : ${r.before}[${r.wrong[0]}]${r.after}`,accepted:equivalentSentences(r)};
 return {...base,prompt:context+`${r.fr}\nÉcris la phrase anglaise complète.`,accepted:equivalentSentences(r)};
}
/** Deterministic and bounded; never retries random draws until exhaustion. */
export function generateEnglish(chapterId,{seed='default',avoidFingerprints=[]}={}){
 const bank=banks.get(chapterId);if(!bank)return [];
 const random=rng(chapterId+':'+seed),avoid=new Set(avoidFingerprints),usedSentences=new Set(),result=[];
 // Every block of five includes all five families; 10 training + 5 independent test questions.
 for(let i=0;i<15;i++){
  const family=FAMILIES[i%5];
  const candidates=shuffle(bank,random).filter(r=>!usedSentences.has(r.sentence));
  const fresh=candidates.filter(r=>!avoid.has(`en:${chapterId}:${family}:${r.sentence}`));
  const r=fresh[0]||candidates[0];
  if(!r)return []; // Caller suspends catalogue errors; no partial or invalid session.
  usedSentences.add(r.sentence);result.push({...question(chapterId,r,family,random),phase:i<10?'practice':'test'});
 }
 return result;
}
