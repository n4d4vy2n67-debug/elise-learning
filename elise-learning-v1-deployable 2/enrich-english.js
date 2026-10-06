window.ELISE_EXTRA=window.ELISE_EXTRA||{};window.ELISE_EXTRA.english={};
const E=window.ELISE_EXTRA.english,R=a=>a[Math.floor(Math.random()*a.length)],M=(t,c,w,e)=>{let a=[c,...w].sort(()=>Math.random()-.5);return{t,a,c:a.indexOf(c),e}};
const bank={
be:[["I ___ ready.","am",["is","are"]],["She ___ at school.","is",["am","are"]],["My friends ___ here.","are",["is","am"]],["___ they tired?","Are",["Is","Am"]]],
have:[["She ___ got a bike.","has",["have","is"]],["We ___ got homework.","have",["has","are"]],["___ Tom got a dog?","Has",["Have","Is"]],["They ___ got blue eyes.","have",["has","are"]]],
present:[["She ___ hockey.","plays",["play","playing"]],["They ___ to school.","go",["goes","going"]],["Tom ___ English.","studies",["study","studys"]],["We ___ dinner at seven.","eat",["eats","eating"]]],
doDoes:[["___ she like music?","Does",["Do","Is"]],["___ they play hockey?","Do",["Does","Are"]],["She ___ not like coffee.","does",["do","is"]],["We ___ not play today.","do",["does","are"]]],
frequency:[["« toujours » =","always",["never","sometimes"]],["« souvent » =","often",["never","always"]],["« parfois » =","sometimes",["always","never"]],["« jamais » =","never",["often","usually"]]],
pronouns:[["Replace Tom.","he",["him","they"]],["Replace Tom and Anna.","they",["we","them"]],["I see Sarah. Replace Sarah.","her",["she","hers"]]],
possessives:[["Tom has a bike. It is ___ bike.","his",["her","their"]],["We have a house. It is ___ house.","our",["your","ours"]],["This pen belongs to me. It is ___.","mine",["my","me"]]],
articles:[["She is ___ teacher.","a",["an","the"]],["He eats ___ orange.","an",["a","the"]],["___ sun is hot.","The",["A","An"]]],
plurals:[["Plural of child","children",["childs","childes"]],["Plural of mouse","mice",["mouses","mouse"]],["Plural of woman","women",["womans","womanes"]],["Plural of box","boxes",["boxs","boxies"]]],
there:[["___ a cat here.","There is",["There are","It is"]],["___ three chairs.","There are",["There is","They are"]],["___ any milk?","Is there",["Are there","There is"]]],
can:[["___ you help me?","Can",["Do","Are"]],["He ___ speak French.","can",["cans","does can"]],["She ___ drive. She is 12.","can't",["doesn't can","isn't"]]],
questionWords:[["___ do you live?","Where",["When","Who"]],["___ is your birthday?","When",["Where","Who"]],["___ is your teacher?","Who",["Why","When"]],["___ are you tired?","Why",["Where","What"]]],
prepositions:[["School starts ___ 8:30.","at",["on","in"]],["We play ___ Saturday.","on",["at","in"]],["My birthday is ___ November.","in",["on","at"]],["The keys are ___ the table.","on",["at","in"]]],
presentContinuous:[["They ___ playing now.","are",["do","have"]],["I ___ doing homework.","am",["is","do"]],["Tom is ___.","running",["run","runs"]]],
comparison:[["An elephant is ___ than a dog.","bigger",["biggest","more big"]],["This is the ___ book.","best",["better","goodest"]],["Tom is ___ than Sam.","taller",["tallest","more tall"]]],
someAny:[["I have ___ friends here.","some",["any","a"]],["We haven't got ___ milk.","any",["some","a"]],["Are there ___ apples?","any",["some","a"]]],
vocabDaily:[["« devoirs » =","homework",["housework","lesson"]],["« chambre » =","bedroom",["bathroom","kitchen"]],["« petit-déjeuner » =","breakfast",["lunch","dinner"]],["« récréation » =","break",["homework","classroom"]]],
sentenceOrder:[["Correct order","She often plays hockey.",["She plays often hockey.","Often she hockey plays."]],["Correct question","Where do you live?",["Where you do live?","Do where you live?"]],["Correct negative","She doesn't like maths.",["She doesn't maths like.","She not likes maths."]]],
reading:[["Leo gets up at seven and takes the bus at eight. When does he get up?","At seven.",["At eight.","By bus."]],["Mia has two brothers and one sister. How many siblings has Mia got?","Three.",["Two.","One."]],["Sam plays hockey on Wednesday. What does Sam play?","Hockey.",["Football.","Tennis."]]],
translation:[["Translate « Nous sommes prêts. »","We are ready.",["We is ready.","Us are ready."]],["Translate « A-t-elle un frère ? »","Has she got a brother?",["Have she got a brother?","Does she has a brother?"]],["Translate « Ils vont à l'école. »","They go to school.",["They goes to school.","Them go school."]]]
};
Object.keys(bank).forEach(k=>E[k]=()=>{let x=R(bank[k]);return M(x[0],x[1],x[2],"Relis la règle et vérifie sujet, verbe et ordre des mots.")});
E.imperative=()=>{let x=R([["Choose the instruction.","Open your book.",["You open your book?","To open your book."]],["Choose the prohibition.","Don't run.",["Not run.","Doesn't run."]]]);return M(x[0],x[1],x[2],"Impératif : base verbale ; interdiction : don't + verbe.")};