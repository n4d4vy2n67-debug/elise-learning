/** Teacher-reviewed parameterised mathematics catalogue. Stable V3 chapter ids. */
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
const frac=(a,b)=>{const g=gcd(a,b);return b/g===1?String(a/g):`${a/g}/${b/g}`;};
const fmt=n=>String(Math.round(n*1e8)/1e8);
const signed=n=>n<0?`(${n})`:String(n);
const num=(prompt,value,explanation,skills=[])=>({prompt,type:'text',accepted:[fmt(value),fmt(value).replace('.',',')].filter((x,i,a)=>a.indexOf(x)===i),explanation,skills});
const text=(prompt,value,explanation,skills=[])=>({prompt,type:'text',accepted:[String(value)],explanation,skills});
const choice=(prompt,answer,distractors,explanation,skills=[])=>{const options=[String(answer),...distractors.map(String)].filter((x,i,a)=>a.indexOf(x)===i);if(options.length<3)throw Error('Insufficient distinct choices');return {prompt,type:'choice',options,accepted:[String(answer)],correctIndex:0,explanation,skills};};
const hash=s=>{let h=2166136261;for(const c of String(s)){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;};
const rng=seed=>{let v=hash(seed)||1;return {int(a,b){v^=v<<13;v^=v>>>17;v^=v<<5;return a+((v>>>0)%(b-a+1));}};};
const definitions=[];
function chapter(id,title,objective,prerequisites,theory,examples,names,builders){definitions.push({id,title,objective,prerequisites,theoryHtml:`<p>${theory}</p>`,examples,families:names.map((name,i)=>({id:`${id}-${i+1}`,name,skills:[`${id}:${i+1}`],build:builders[i]}))});}
chapter('integers','Nombres entiers relatifs','Comparer et effectuer des opérations sur des entiers relatifs.',[],
'Un nombre négatif est inférieur à zéro. Pour additionner deux nombres de même signe, additionne leurs distances à zéro et garde leur signe. Soustraire un nombre revient à ajouter son opposé. Un produit de deux nombres de même signe est positif ; de signes différents, négatif.',
['−4 + 7 = 3','5 − (−3) = 8','(−3) × (−4) = 12'],['Addition','Soustraction','Produit signé','Comparaison','Variation contextualisée'],[
r=>{let a=r.int(-45,45),b=r.int(-35,35);return num(`Calcule ${signed(a)} + ${signed(b)}.`,a+b,`Additionner ${a} et ${b} donne ${a+b}.`);},
r=>{let a=r.int(-45,45),b=r.int(-35,-1);return num(`Calcule ${signed(a)} − ${signed(b)}.`,a-b,`Soustraire ${b} revient à ajouter ${-b} : résultat ${a-b}.`);},
r=>{let a=r.int(-12,-1),b=r.int(2,15);return num(`Calcule ${signed(a)} × ${b}.`,a*b,`Les signes sont différents : le produit est négatif. ${-a} × ${b} = ${-a*b}, donc ${a*b}.`);},
r=>{let a=-r.int(2,90),b=a+r.int(1,20);return choice(`Quel est le plus grand nombre entre ${a} et ${b} ?`,b,[a,'Ils sont égaux'],`Sur la droite graduée, ${b} est plus à droite que ${a}. Les deux nombres ne sont pas égaux.`);},
r=>{let a=r.int(-20,15),b=r.int(2,25);return num(`Il fait ${a} °C. La température baisse de ${b} °C. Quelle est la nouvelle température, en °C ?`,a-b,`Une baisse se soustrait : ${a} − ${b} = ${a-b} °C.`);}
]);
chapter('priorities','Priorités opératoires','Appliquer les priorités et expliquer une étape de calcul.',['integers'],
'Calcule les parenthèses, puis les puissances, puis les multiplications et divisions, puis les additions et soustractions. Des opérations de même priorité se font de gauche à droite.',
['3 + 4 × 2 = 11','(3 + 4) × 2 = 14','18 ÷ 3 × 2 = 12'],['Produit prioritaire','Parenthèses','Division prioritaire','Puissance prioritaire','Repérer une erreur'],[
r=>{let a=r.int(2,30),b=r.int(2,12),c=r.int(2,12);return num(`Calcule ${a} + ${b} × ${c}.`,a+b*c,`Calcule d’abord ${b} × ${c} = ${b*c}, puis ajoute ${a} : ${a+b*c}.`);},
r=>{let a=r.int(2,20),b=r.int(2,20),c=r.int(2,9);return num(`Calcule (${a} + ${b}) × ${c}.`,(a+b)*c,`Parenthèses d’abord : ${a+b}, puis × ${c} = ${(a+b)*c}.`);},
r=>{let a=r.int(2,30),b=r.int(2,15),c=r.int(2,12);return num(`Calcule ${a} + ${b*c} ÷ ${c}.`,a+b,`La division vaut ${b}, puis ${a} + ${b} = ${a+b}.`);},
r=>{let a=r.int(2,25),b=r.int(2,12);return num(`Calcule ${a} + ${b}².`,a+b*b,`${b}² = ${b*b}, donc ${a} + ${b*b} = ${a+b*b}.`);},
r=>{let a=r.int(2,20),b=r.int(2,15),c=r.int(2,9);return choice(`Pour ${a} + ${b} × ${c}, un élève calcule (${a} + ${b}) × ${c}. Choisis le résultat correct.`,a+b*c,[(a+b)*c,a+b*c-1],`Sans parenthèses, la multiplication est prioritaire : ${a} + ${b*c} = ${a+b*c}.`);}
]);
chapter('powers','Puissances','Calculer et reconnaître des puissances entières simples.',['priorities'],
'a² signifie a × a, et a³ signifie a × a × a. Pour une même base, aᵐ × aⁿ = aᵐ⁺ⁿ. Pour une base non nulle, aᵐ ÷ aⁿ = aᵐ⁻ⁿ. Les parenthèses font partie de la base : (−3)² = 9.',
['4² = 16','2³ = 8','3² × 3³ = 3⁵'],['Carrés','Cubes','Produit de puissances','Quotient de puissances','Base négative'],[
r=>{let a=r.int(2,35);return num(`Calcule ${a}².`,a*a,`${a}² = ${a} × ${a} = ${a*a}.`);},
r=>{let a=r.int(2,25);return num(`Calcule ${a}³.`,a*a*a,`${a}³ = ${a} × ${a} × ${a} = ${a*a*a}.`);},
r=>{let a=r.int(2,9),m=r.int(1,8),n=r.int(1,8);return num(`Complète l’exposant : ${a}^${m} × ${a}^${n} = ${a}^?.`,m+n,`Même base : on additionne les exposants, ${m} + ${n} = ${m+n}.`);},
r=>{let a=r.int(2,9),n=r.int(1,8),m=n+r.int(1,8);return num(`Complète l’exposant : ${a}^${m} ÷ ${a}^${n} = ${a}^?.`,m-n,`Même base non nulle : ${m} − ${n} = ${m-n}.`);},
r=>{let a=r.int(2,30);return num(`Calcule (−${a})².`,a*a,`(−${a}) × (−${a}) = ${a*a}, car deux facteurs négatifs donnent un produit positif.`);}
]);
chapter('fractions','Fractions','Simplifier, comparer et calculer des fractions.',['divisibility'],
'Une fraction représente un partage. Multiplier ou diviser le numérateur et le dénominateur par le même nombre non nul conserve sa valeur. Pour additionner des fractions, utilise un dénominateur commun. Pour multiplier, multiplie les numérateurs et les dénominateurs. Une fraction irréductible n’a plus de diviseur commun supérieur à 1.',
['6/8 = 3/4','2/7 + 3/7 = 5/7','1/2 × 2/3 = 1/3'],['Simplification','Addition même dénominateur','Produit','Comparaison','Partage'],[
r=>{let a=r.int(1,15),b=a+r.int(1,15),k=r.int(2,9);return text(`Écris ${a*k}/${b*k} sous forme irréductible (a/b, ou entier).`,frac(a,b),`Divise par les diviseurs communs : la forme irréductible est ${frac(a,b)}.`);},
r=>{let a=r.int(1,15),b=r.int(1,15),d=r.int(3,25);return text(`Calcule ${a}/${d} + ${b}/${d}. Donne la forme irréductible.`,frac(a+b,d),`Même dénominateur : (${a} + ${b})/${d} = ${a+b}/${d}, soit ${frac(a+b,d)}.`);},
r=>{let a=r.int(1,9),b=r.int(2,12),c=r.int(1,9),d=r.int(2,12);return text(`Calcule ${a}/${b} × ${c}/${d}. Donne la forme irréductible.`,frac(a*c,b*d),`Multiplie en haut et en bas : ${a*c}/${b*d}, puis simplifie en ${frac(a*c,b*d)}.`);},
r=>{let d=r.int(3,35),a=r.int(1,d-2),b=r.int(a+1,d-1);return choice(`Quelle fraction est la plus grande : ${a}/${d} ou ${b}/${d} ?`,`${b}/${d}`,[`${a}/${d}`,`Elles sont égales`],`À dénominateur positif identique, le plus grand numérateur donne la plus grande fraction.`);},
r=>{let d=r.int(2,12),a=r.int(1,d-1),k=r.int(2,30);return num(`On prend ${a}/${d} de ${d*k} billes. Combien de billes prend-on ?`,a*k,`Un ${d}e vaut ${k} billes. ${a} parts valent ${a} × ${k} = ${a*k} billes.`);}
]);
chapter('decimals','Nombres décimaux','Calculer, comparer et convertir des nombres décimaux.',['integers'],
'Pour additionner ou soustraire des décimaux, aligne les virgules. Multiplier par 10 ou 100 décale les chiffres vers les rangs supérieurs. Une division par 10 ou 100 fait l’inverse. Compare d’abord la partie entière, puis les dixièmes, centièmes… Un centième vaut 0,01.',
['2,5 + 0,75 = 3,25','4,23 × 10 = 42,3','36 centièmes = 0,36'],['Addition','Soustraction','Multiplication par dix','Comparaison','Centièmes'],[
r=>{let a=r.int(10,950),b=r.int(10,950);return num(`Calcule ${fmt(a/100)} + ${fmt(b/100)}.`,(a+b)/100,`En centièmes : ${a} + ${b} = ${a+b}, donc ${fmt((a+b)/100)}.`);},
r=>{let b=r.int(10,400),a=b+r.int(1,500);return num(`Calcule ${fmt(a/100)} − ${fmt(b/100)}.`,(a-b)/100,`Soustrais les centièmes : ${a} − ${b} = ${a-b}, soit ${fmt((a-b)/100)}.`);},
r=>{let a=r.int(11,999);return num(`Calcule ${fmt(a/100)} × 10.`,a/10,`Multiplier par 10 donne ${fmt(a/10)}.`);},
r=>{let a=r.int(11,950),b=a+r.int(1,40);return choice(`Quel est le plus grand nombre entre ${fmt(a/100)} et ${fmt(b/100)} ?`,fmt(b/100),[fmt(a/100),'Ils sont égaux'],`Compare les nombres de centièmes : ${b} > ${a}, donc ${fmt(b/100)} est plus grand.`);},
r=>{let a=r.int(1,999);return num(`Écris ${a} centièmes sous forme décimale.`,a/100,`Un centième vaut 1/100, donc ${a}/100 = ${fmt(a/100)}.`);}
]);
chapter('divisibility','Divisibilité','Reconnaître des multiples, diviseurs et critères de divisibilité.',['integers'],
'Un entier a est divisible par un entier b non nul si a ÷ b est entier. Un multiple de b est obtenu en multipliant b par un entier. Un diviseur partage sans reste. Un nombre divisible par 5 se termine par 0 ou 5. Pour 3 ou 9, utilise la somme des chiffres.',
['42 est divisible par 6 : 42 ÷ 6 = 7','135 est divisible par 5','123 est divisible par 3 : 1 + 2 + 3 = 6'],['Multiple identifié','Diviseur identifié','Critère de cinq','Multiple suivant','Quotient entier'],[
r=>{let d=r.int(3,17),k=r.int(2,25),a=d*k;return choice(`Parmi ${a}, ${a+1} et ${a+2}, quel nombre est un multiple de ${d} ?`,a,[a+1,a+2],`${a} = ${d} × ${k}. Les autres nombres ont un reste non nul.`);},
r=>{let d=r.int(3,14),k=r.int(2,25),a=d*k;return choice(`Quel nombre divise ${a} sans reste ?`,d,[a+1,a+2],`${a} ÷ ${d} = ${k}, entier. Les deux autres choix sont supérieurs à ${a}.`);},
r=>{let a=r.int(2,100)*10+5;return choice(`Parmi ${a}, ${a+1} et ${a+2}, quel nombre est divisible par 5 ?`,a,[a+1,a+2],`${a} se termine par 5. Les autres ne se terminent ni par 0 ni par 5.`);},
r=>{let d=r.int(2,18),k=r.int(2,40);return num(`Quel est le premier multiple de ${d} strictement supérieur à ${d*k} ?`,d*(k+1),`Ajoute ${d} au multiple ${d*k} : ${d*(k+1)}.`);},
r=>{let d=r.int(2,18),k=r.int(2,35);return num(`Complète : ${d*k} = ${d} × ?.`,k,`Divise ${d*k} par ${d} : ${k}.`);}
]);
chapter('percent','Pourcentages','Calculer un pourcentage, une remise et une augmentation.',['fractions','decimals'],
'p % signifie p/100. Pour calculer p % d’une quantité, multiplie cette quantité par p/100. Une remise se soustrait au prix initial ; une augmentation s’y ajoute. Le taux d’une partie est partie ÷ total × 100.',
['20 % de 150 = 30','80 € avec 25 % de remise : 60 €','15 réussites sur 20 : 75 %'],['Part en pourcentage','Remise','Augmentation','Taux','Prix initial'],[
r=>{let p=r.int(1,19)*5,n=r.int(2,35)*20;return num(`Calcule ${p} % de ${n}.`,p*n/100,`${n} × ${p}/100 = ${p*n/100}.`);},
r=>{let p=r.int(1,9)*5,n=r.int(2,30)*20;return num(`Un article coûte ${n} €. Remise de ${p} %. Quel prix paie-t-on, en euros ?`,n*(100-p)/100,`Remise : ${n*p/100} €. Prix : ${n} − ${n*p/100} = ${n*(100-p)/100} €.`);},
r=>{let p=r.int(1,8)*5,n=r.int(2,30)*20;return num(`Un prix de ${n} € augmente de ${p} %. Quel est le nouveau prix, en euros ?`,n*(100+p)/100,`Augmentation : ${n*p/100} €. Ajoute-la : ${n*(100+p)/100} €.`);},
r=>{let n=r.int(2,20)*10,p=r.int(1,9)*10;return num(`Sur ${n} élèves, ${n*p/100} participent. Quel pourcentage participe ?`,p,`${n*p/100} ÷ ${n} × 100 = ${p} %.`);},
r=>{let p=r.int(1,9)*10,n=r.int(2,30)*10;return num(`${p} % d’une somme valent ${n*p/100} €. Quelle est la somme initiale, en euros ?`,n,`Divise la partie par ${p}/100 : ${n*p/100} ÷ ${p/100} = ${n}.`);}
]);
chapter('proportion','Proportionnalité','Utiliser un coefficient et la règle de trois.',['fractions'],
'Deux grandeurs sont proportionnelles si on passe de l’une à l’autre en multipliant toujours par le même coefficient. Pour trouver une quantité, ramène à une unité puis multiplie. Dans un tableau proportionnel, les rapports correspondants sont constants.',
['3 cahiers coûtent 12 € : 1 coûte 4 €, 5 coûtent 20 €','À 60 km/h constants, 2 h correspondent à 120 km'],['Prix proportionnel','Recette','Distance à vitesse constante','Coefficient','Tableau proportionnel'],[
r=>{let n=r.int(2,12),k=r.int(2,9),m=r.int(13,25);return num(`${n} cahiers coûtent ${n*k} €. À prix unitaire identique, combien coûtent ${m} cahiers, en euros ?`,m*k,`Un cahier coûte ${n*k} ÷ ${n} = ${k} €. ${m} cahiers coûtent ${m*k} €.`);},
r=>{let n=r.int(2,8),k=r.int(20,90),m=r.int(9,18);return num(`Pour ${n} personnes, il faut ${n*k} g de farine. Avec la même recette, combien de grammes pour ${m} personnes ?`,m*k,`Par personne : ${k} g. Pour ${m} : ${m} × ${k} = ${m*k} g.`);},
r=>{let v=r.int(4,20)*5,t=r.int(2,9);return num(`À ${v} km/h constants pendant ${t} heures, quelle distance parcourt-on, en km ?`,v*t,`Distance = vitesse × durée : ${v} × ${t} = ${v*t} km.`);},
r=>{let x=r.int(2,25),k=r.int(2,12);return num(`Dans un tableau proportionnel, ${x} correspond à ${x*k}. Quel est le coefficient de la première ligne vers la seconde ?`,k,`Coefficient = ${x*k} ÷ ${x} = ${k}.`);},
r=>{let x=r.int(2,15),k=r.int(2,12),y=r.int(16,30);return num(`Tableau proportionnel : ${x} → ${x*k} ; ${y} → ?.`,y*k,`Le coefficient est ${k}, donc ${y} × ${k} = ${y*k}.`);}
]);
chapter('literal','Calcul littéral','Évaluer et réduire des expressions littérales simples.',['priorities'],
'Une lettre représente un nombre. 3x signifie 3 × x. Pour évaluer une expression, remplace la lettre par sa valeur. On additionne les coefficients de termes semblables : 2x + 3x = 5x. Les termes en x et les nombres constants se réduisent séparément.',
['Pour x = 4, 3x + 2 = 14','7x − 2x = 5x','2x + 3 + x + 4 = 3x + 7'],['Évaluation','Somme de termes semblables','Différence de termes semblables','Réduction avec constantes','Expression contextualisée'],[
r=>{let a=r.int(2,12),x=r.int(2,20),b=r.int(1,20);return num(`Pour x = ${x}, calcule ${a}x + ${b}.`,a*x+b,`Remplace x par ${x} : ${a} × ${x} + ${b} = ${a*x+b}.`);},
r=>{let a=r.int(2,25),b=r.int(2,25);return choice(`Réduis ${a}x + ${b}x.`,`${a+b}x`,[`${a+b+1}x`,`${a+b}x²`],`Les termes sont semblables : (${a} + ${b})x = ${a+b}x.`);},
r=>{let b=r.int(2,20),a=b+r.int(1,25);return choice(`Réduis ${a}x − ${b}x.`,`${a-b}x`,[`${a+b}x`,`${a-b}x²`],`Soustrais les coefficients : (${a} − ${b})x = ${a-b}x.`);},
r=>{let a=r.int(2,20),b=r.int(2,20),c=r.int(2,20),d=r.int(2,20);return choice(`Réduis ${a}x + ${b} + ${c}x + ${d}.`,`${a+c}x + ${b+d}`,[`${a+c}x + ${b+d+1}`,`${a+c}x² + ${b+d}`],`Regroupe les termes en x et les constantes : ${a+c}x + ${b+d}.`);},
r=>{let a=r.int(2,15),b=a+r.int(1,20);return choice(`Une entrée coûte ${a} € et le transport ${b} € au total. Quelle expression donne le coût de x entrées avec ce transport ?`,`${a}x + ${b}`,[`${a+b}x`,`${a} + ${b}x`],`Les entrées coûtent ${a} × x ; on ajoute une seule fois le transport ${b}.`);}
]);
chapter('distributivity','Distributivité','Développer, réduire et factoriser des expressions simples.',['literal'],
'a(b + c) = ab + ac : le facteur devant la parenthèse multiplie chaque terme. a(b − c) = ab − ac. Développer enlève les parenthèses ; réduire regroupe les termes semblables. Factoriser fait l’inverse en mettant un facteur commun devant une parenthèse.',
['3(x + 2) = 3x + 6','4(x − 3) = 4x − 12','6x + 12 = 6(x + 2)'],['Développer somme','Développer différence','Réduire après développement','Facteur commun','Coefficient manquant'],[
r=>{let a=r.int(2,20),b=r.int(2,20);return choice(`Développe ${a}(x + ${b}).`,`${a}x + ${a*b}`,[`${a}x + ${b}`,`${a+b}x`],`Multiplie chaque terme par ${a} : ${a}x + ${a*b}.`);},
r=>{let a=r.int(2,20),b=r.int(2,20);return choice(`Développe ${a}(x − ${b}).`,`${a}x − ${a*b}`,[`${a}x − ${b}`,`${a}x + ${a*b}`],`Le signe moins reste : ${a} × x − ${a} × ${b} = ${a}x − ${a*b}.`);},
r=>{let a=r.int(2,15),b=r.int(2,15),c=r.int(2,15);return choice(`Développe et réduis ${a}(x + ${b}) + ${c}x.`,`${a+c}x + ${a*b}`,[`${a+c}x + ${b}`,`${a}x + ${a*b+c}`],`Développe : ${a}x + ${a*b} + ${c}x. Réduis : ${a+c}x + ${a*b}.`);},
r=>{let a=r.int(2,20),b=r.int(2,20);return choice(`Mets ${a} en facteur dans ${a}x + ${a*b}.`,`${a}(x + ${b})`,[`${a}(x + ${a*b})`,`${a}(x − ${b})`],`Divise les deux termes par ${a} dans la parenthèse : x et ${b}.`);},
r=>{let a=r.int(2,20),b=r.int(2,20);return num(`Complète le nombre manquant : ${a}(x + ${b}) = ${a}x + ?.`,a*b,`Le terme constant est ${a} × ${b} = ${a*b}.`);}
]);
chapter('equations','Équations simples','Résoudre des équations linéaires simples et vérifier une solution.',['literal','distributivity'],
'Une équation est une égalité contenant une inconnue. Effectue la même opération des deux côtés pour conserver l’égalité. Annule les additions ou soustractions, puis les multiplications. Vérifie en remplaçant x dans l’équation de départ.',
['x + 5 = 12 → x = 7','3x = 18 → x = 6','2x + 3 = 11 → x = 4'],['Addition inverse','Soustraction inverse','Multiplication inverse','Deux étapes','Parenthèses'],[
r=>{let x=r.int(-20,30),b=r.int(2,35);return num(`Résous x + ${b} = ${x+b}. Donne x.`,x,`Soustrais ${b} des deux côtés : x = ${x+b} − ${b} = ${x}.`);},
r=>{let x=r.int(-20,30),b=r.int(2,35);return num(`Résous x − ${b} = ${x-b}. Donne x.`,x,`Ajoute ${b} des deux côtés : x = ${x}.`);},
r=>{let a=r.int(2,15),x=r.int(-20,30);return num(`Résous ${a}x = ${a*x}. Donne x.`,x,`Divise les deux côtés par ${a} : x = ${a*x} ÷ ${a} = ${x}.`);},
r=>{let a=r.int(2,12),x=r.int(-20,30),b=r.int(2,30);return num(`Résous ${a}x + ${b} = ${a*x+b}. Donne x.`,x,`Soustrais ${b}, puis divise par ${a} : x = ${x}. Vérification : ${a} × (${x}) + ${b} = ${a*x+b}.`);},
r=>{let a=r.int(2,12),x=r.int(-15,25),b=r.int(2,20);return num(`Résous ${a}(x + ${b}) = ${a*(x+b)}. Donne x.`,x,`Divise par ${a}, puis soustrais ${b} : x = ${x+b} − ${b} = ${x}.`);}
]);
chapter('coordinates','Repérage','Lire et calculer des coordonnées dans un repère.',['integers'],
'Dans (x ; y), x est l’abscisse, horizontale, et y l’ordonnée, verticale. Aller à droite augmente x ; monter augmente y. Le symétrique par rapport à l’axe vertical est (−x ; y), et par rapport à l’axe horizontal (x ; −y).',
['Dans A(3 ; −2), l’abscisse est 3','A(3 ; −2), puis 4 unités à droite : (7 ; −2)'],['Abscisse','Ordonnée','Déplacement horizontal','Déplacement vertical','Symétrie sur axe vertical'],[
r=>{let x=r.int(-40,40),y=r.int(-40,40);return num(`A(${x} ; ${y}). Quelle est l’abscisse de A ?`,x,`L’abscisse est la première coordonnée : ${x}.`);},
r=>{let x=r.int(-40,40),y=r.int(-40,40);return num(`B(${x} ; ${y}). Quelle est l’ordonnée de B ?`,y,`L’ordonnée est la seconde coordonnée : ${y}.`);},
r=>{let x=r.int(-30,30),y=r.int(-30,30),d=r.int(1,20);return num(`Depuis A(${x} ; ${y}), on avance de ${d} unités à droite. Quelle est la nouvelle abscisse ?`,x+d,`À droite, ajoute ${d} à x : ${x+d}. L’ordonnée reste ${y}.`);},
r=>{let x=r.int(-30,30),y=r.int(-30,30),d=r.int(1,20);return num(`Depuis B(${x} ; ${y}), on descend de ${d} unités. Quelle est la nouvelle ordonnée ?`,y-d,`Descendre diminue y : ${y} − ${d} = ${y-d}.`);},
r=>{let x=r.int(1,35),y=r.int(1,35);return choice(`Quel est le symétrique de A(${x} ; ${y}) par rapport à l’axe vertical ?`,`(${-x} ; ${y})`,[`(${x} ; ${-y})`,`(${x} ; ${y})`],`Change uniquement le signe de l’abscisse : (${-x} ; ${y}).`);}
]);
chapter('angles','Angles','Identifier et calculer des angles complémentaires et supplémentaires.',['integers'],
'Un angle aigu mesure moins de 90°, un angle droit 90°, un angle obtus entre 90° et 180°. Deux angles complémentaires totalisent 90° ; deux angles supplémentaires totalisent 180°. Autour d’un point, les angles totalisent 360°. Les angles opposés par le sommet sont égaux.',
['Complément de 35° : 55°','Supplément de 120° : 60°'],['Complément','Supplément','Tour complet','Nature angle','Opposés par sommet'],[
r=>{let a=r.int(1,89);return num(`Quel est le complément d’un angle de ${a}°, en degrés ?`,90-a,`Les deux angles totalisent 90° : 90 − ${a} = ${90-a}°.`);},
r=>{let a=r.int(1,179);return num(`Quel est le supplément d’un angle de ${a}°, en degrés ?`,180-a,`Les deux angles totalisent 180° : 180 − ${a} = ${180-a}°.`);},
r=>{let a=r.int(10,120),b=r.int(10,120);return num(`Trois angles autour d’un point mesurent ${a}°, ${b}° et x°. Calcule x.`,360-a-b,`Le tour complet fait 360° : x = 360 − ${a} − ${b} = ${360-a-b}°.`);},
r=>{let a=r.int(1,179);if(a===90)a=91;return choice(`Un angle mesure ${a}°. Quelle est sa nature ?`,a<90?'aigu':'obtus',[a<90?'obtus':'aigu','droit'],`${a}° est ${a<90?'inférieur à 90°':'entre 90° et 180°'}.`);},
r=>{let a=r.int(1,179);return num(`Deux droites se coupent. Un angle vaut ${a}°. Combien vaut l’angle opposé par le sommet ?`,a,`Les angles opposés par le sommet sont égaux : ${a}°.`);}
]);
chapter('triangles','Triangles et quadrilatères','Utiliser les propriétés d’angles et de côtés des figures usuelles.',['angles'],
'Les angles d’un triangle totalisent 180°. Dans un triangle isocèle, les angles opposés aux deux côtés égaux sont égaux. Un triangle équilatéral a trois côtés égaux et trois angles de 60°. Les angles d’un quadrilatère totalisent 360°. Dans un parallélogramme, les angles opposés sont égaux et deux angles voisins sont supplémentaires.',
['Triangle : 50° + 60° + 70° = 180°','Triangle isocèle, sommet 40° : chaque angle à la base vaut 70°'],['Troisième angle triangle','Base triangle isocèle','Triangle rectangle','Angle quadrilatère','Parallélogramme'],[
r=>{let a=r.int(15,70),b=r.int(15,70);return num(`Deux angles d’un triangle valent ${a}° et ${b}°. Combien vaut le troisième ?`,180-a-b,`Dans un triangle : 180 − ${a} − ${b} = ${180-a-b}°.`);},
r=>{let a=r.int(10,70)*2;return num(`Dans un triangle isocèle, l’angle entre les deux côtés égaux vaut ${a}°. Combien vaut chaque angle à la base ?`,(180-a)/2,`Les deux angles à la base sont égaux : (180 − ${a}) ÷ 2 = ${(180-a)/2}°.`);},
r=>{let a=r.int(1,89);return num(`Un triangle rectangle a un angle aigu de ${a}°. Combien vaut l’autre angle aigu ?`,90-a,`L’angle droit prend 90° ; les deux angles aigus totalisent 90°. L’autre vaut ${90-a}°.`);},
r=>{let a=r.int(60,100),b=r.int(60,100),c=r.int(60,100);return num(`Trois angles d’un quadrilatère valent ${a}°, ${b}° et ${c}°. Calcule le quatrième.`,360-a-b-c,`La somme est 360° : le quatrième vaut ${360-a-b-c}°.`);},
r=>{let a=r.int(20,160);return num(`Un angle d’un parallélogramme vaut ${a}°. Combien vaut l’angle voisin ?`,180-a,`Deux angles voisins d’un parallélogramme sont supplémentaires : ${180-a}°.`);}
]);
chapter('perimeterArea','Périmètres et aires','Choisir la bonne formule et calculer périmètres et aires.',['proportion'],
'Le périmètre mesure le contour ; l’aire mesure la surface. Rectangle : P = 2(L + l), A = L × l. Carré : P = 4c, A = c². Triangle : A = base × hauteur ÷ 2 ; la hauteur est perpendiculaire à la base. Aire du parallélogramme : base × hauteur.',
['Rectangle 5 cm sur 3 cm : P = 16 cm, A = 15 cm²','Triangle base 8 cm, hauteur 3 cm : A = 12 cm²'],['Périmètre rectangle','Aire rectangle','Aire triangle','Aire parallélogramme','Côté carré depuis périmètre'],[
r=>{let a=r.int(3,50),b=r.int(2,30);return num(`Un rectangle mesure ${a} cm sur ${b} cm. Quel est son périmètre, en cm ?`,2*(a+b),`P = 2 × (${a} + ${b}) = ${2*(a+b)} cm.`);},
r=>{let a=r.int(3,40),b=r.int(2,30);return num(`Un rectangle mesure ${a} cm sur ${b} cm. Quelle est son aire, en cm² ?`,a*b,`A = ${a} × ${b} = ${a*b} cm².`);},
r=>{let a=r.int(2,25)*2,b=r.int(2,30);return num(`Un triangle a une base de ${a} cm et une hauteur correspondante de ${b} cm. Aire en cm² ?`,a*b/2,`A = base × hauteur ÷ 2 = ${a} × ${b} ÷ 2 = ${a*b/2} cm².`);},
r=>{let a=r.int(3,40),b=r.int(2,30);return num(`Un parallélogramme a une base de ${a} cm et une hauteur correspondante de ${b} cm. Aire en cm² ?`,a*b,`A = base × hauteur = ${a*b} cm².`);},
r=>{let a=r.int(2,70);return num(`Un carré a un périmètre de ${4*a} cm. Quelle est la longueur d’un côté, en cm ?`,a,`Les quatre côtés sont égaux : ${4*a} ÷ 4 = ${a} cm.`);}
]);
chapter('solids','Solides et volumes','Calculer des volumes et convertir longueurs, aires et capacités.',['perimeterArea','decimals'],
'Un pavé droit a pour volume longueur × largeur × hauteur. Un cube a pour volume côté³. 1 m = 100 cm ; 1 m² = 10 000 cm² ; 1 litre = 1 dm³ = 1 000 cm³ ; 1 litre = 1 000 mL. Une conversion d’aire porte sur deux dimensions.',
['Pavé 4 × 3 × 2 cm : 24 cm³','2 L = 2 000 mL','3 m² = 30 000 cm²'],['Volume pavé','Volume cube','Litres en millilitres','Longueurs','Aires'],[
r=>{let a=r.int(2,25),b=r.int(2,15),c=r.int(2,15);return num(`Un pavé droit mesure ${a} cm × ${b} cm × ${c} cm. Volume en cm³ ?`,a*b*c,`V = ${a} × ${b} × ${c} = ${a*b*c} cm³.`);},
r=>{let a=r.int(2,35);return num(`Un cube a une arête de ${a} cm. Quel est son volume, en cm³ ?`,a*a*a,`V = ${a}³ = ${a*a*a} cm³.`);},
r=>{let a=r.int(1,300);return num(`Convertis ${fmt(a/10)} L en mL.`,a*100,`Multiplie les litres par 1 000 : ${a*100} mL.`);},
r=>{let a=r.int(1,500);return num(`Convertis ${fmt(a/10)} m en cm.`,a*10,`1 m = 100 cm, donc ${fmt(a/10)} × 100 = ${a*10} cm.`);},
r=>{let a=r.int(1,300);return num(`Convertis ${fmt(a/10)} m² en cm².`,a*1000,`1 m² = 100 × 100 = 10 000 cm². Résultat : ${a*1000} cm².`);}
]);
chapter('symmetry','Transformations','Reconnaître les effets des symétries, translations et rotations.',['coordinates','angles'],
'Une symétrie axiale conserve les distances et place le point image à la même distance de l’autre côté de l’axe. Dans un repère, symétrie horizontale : (x ; −y), symétrie centrale de centre O : (−x ; −y). Une translation ajoute le même déplacement aux coordonnées. Un quart de tour vaut 90°, un demi-tour 180°.',
['Symétrique horizontal de (2 ; 3) : (2 ; −3)','Translation de (2 ; 3) de (+4 ; −1) : (6 ; 2)'],['Symétrie horizontale','Symétrie centrale','Translation horizontale','Translation verticale','Rotation cumulée'],[
r=>{let x=r.int(1,35),y=r.int(1,35);return choice(`Quel est le symétrique de (${x} ; ${y}) par rapport à l’axe horizontal ?`,`(${x} ; ${-y})`,[`(${-x} ; ${y})`,`(${x} ; ${y})`],`Garde x et change le signe de y : (${x} ; ${-y}).`);},
r=>{let x=r.int(1,35),y=r.int(1,35);return choice(`Quel est le symétrique de (${x} ; ${y}) par rapport à l’origine O ?`,`(${-x} ; ${-y})`,[`(${-x} ; ${y})`,`(${x} ; ${-y})`],`Une symétrie centrale de centre O change les deux signes.`);},
r=>{let x=r.int(-30,30),y=r.int(-30,30),d=r.int(1,25);return num(`Une translation déplace chaque point de ${d} unités à gauche. L’image de A(${x} ; ${y}) a quelle abscisse ?`,x-d,`Gauche signifie soustraire ${d} à x : ${x-d}.`);},
r=>{let x=r.int(-30,30),y=r.int(-30,30),d=r.int(1,25);return num(`Une translation déplace chaque point de ${d} unités vers le haut. L’image de B(${x} ; ${y}) a quelle ordonnée ?`,y+d,`Monte de ${d} : y devient ${y+d}.`);},
r=>{let a=r.int(1,30),b=r.int(1,30);return num(`On effectue deux rotations de même centre et de même sens, de ${a*5}° puis ${b*5}°. Quel est l’angle total (avant réduction à un tour) ?`,(a+b)*5,`De même sens, les angles s’ajoutent : ${a*5} + ${b*5} = ${(a+b)*5}°.`);}
]);
chapter('statistics','Statistiques','Calculer et interpréter moyenne, médiane, étendue et effectifs.',['decimals','percent'],
'La moyenne est la somme des valeurs divisée par leur nombre. Pour la médiane, range les valeurs : avec un nombre impair, prends celle du milieu. L’étendue est maximum − minimum. L’effectif total est la somme des effectifs. Une fréquence en pourcentage vaut effectif ÷ total × 100.',
['Moyenne de 4, 6, 8 : 6','Médiane de 2, 5, 7 : 5','Étendue de 2, 5, 7 : 5'],['Moyenne','Médiane','Étendue','Effectif total','Fréquence'],[
r=>{let a=r.int(2,70),d=r.int(1,20);return num(`Calcule la moyenne de ${a}, ${a+d}, ${a+2*d}.`,a+d,`La somme ${3*(a+d)} divisée par 3 donne ${a+d}.`);},
r=>{let a=r.int(1,60),d=r.int(1,20);return num(`Quelle est la médiane des valeurs ${a+2*d}, ${a}, ${a+4*d}, ${a+d}, ${a+3*d} ?`,a+2*d,`Rangées : ${a}, ${a+d}, ${a+2*d}, ${a+3*d}, ${a+4*d}. La troisième est ${a+2*d}.`);},
r=>{let a=r.int(1,60),d=r.int(2,40);return num(`Une série contient ${a}, ${a+d}, ${a+2*d}. Quelle est son étendue ?`,2*d,`Maximum − minimum : ${a+2*d} − ${a} = ${2*d}.`);},
r=>{let a=r.int(2,40),b=r.int(2,40),c=r.int(2,40);return num(`Un tableau donne trois effectifs : ${a}, ${b} et ${c}. Quel est l’effectif total ?`,a+b+c,`Additionne les effectifs : ${a} + ${b} + ${c} = ${a+b+c}.`);},
r=>{let n=r.int(2,20)*10,p=r.int(1,9)*10;return num(`Dans un groupe de ${n} personnes, ${n*p/100} choisissent le vélo. Quelle est leur fréquence, en pourcentage ?`,p,`Fréquence = ${n*p/100} ÷ ${n} × 100 = ${p} %.`);}
]);
chapter('wordProblems','Problèmes en plusieurs étapes','Organiser deux ou trois opérations et vérifier les unités.',['priorities','percent','perimeterArea'],
'Lis la question finale et repère les données utiles. Écris une opération par étape, avec les unités. Pour un coût total, multiplie la quantité par le prix unitaire, puis applique les frais ou remises indiqués. Pour un reste, soustrais ce qui a été utilisé. Vérifie que le résultat est plausible.',
['3 tickets à 8 € et 2 € de frais : 3 × 8 + 2 = 26 €','2 boîtes de 12 biscuits, 5 mangés : 19 restent'],['Achat et frais','Quantité restante','Remise sur achat','Clôture avec ouverture','Durée et pauses'],[
r=>{let n=r.int(2,20),p=r.int(2,18),f=r.int(1,15);return num(`${n} tickets coûtent ${p} € chacun. On ajoute ${f} € de frais pour la commande entière. Total en euros ?`,n*p+f,`Tickets : ${n*p} €. Frais une seule fois : ${n*p} + ${f} = ${n*p+f} €.`);},
r=>{let n=r.int(2,12),q=r.int(5,25),used=r.int(1,n*q-1);return num(`On a ${n} boîtes de ${q} biscuits. On mange ${used} biscuits. Combien restent-ils ?`,n*q-used,`Au départ : ${n*q}. Restants : ${n*q} − ${used} = ${n*q-used}.`);},
r=>{let n=r.int(2,12),p=r.int(2,18)*10,t=r.int(1,5)*10;return num(`On achète ${n} articles à ${p} € chacun. Une remise de ${t} % s’applique au total. Prix final en euros ?`,n*p*(100-t)/100,`Avant remise : ${n*p} €. Remise : ${n*p*t/100} €. Final : ${n*p*(100-t)/100} €.`);},
r=>{let a=r.int(5,40),b=r.int(5,30),g=r.int(1,4);return num(`Un terrain rectangulaire mesure ${a} m sur ${b} m. On laisse une ouverture de ${g} m dans la clôture. Longueur de clôture, en m ?`,2*(a+b)-g,`Périmètre : ${2*(a+b)} m. Retire l’ouverture : ${2*(a+b)-g} m.`);},
r=>{let n=r.int(2,8),t=r.int(10,40),p=r.int(2,15);return num(`On joue ${n} périodes de ${t} minutes avec ${p} minutes de pause ENTRE deux périodes, sans pause après la dernière. Durée totale, en minutes ?`,n*t+(n-1)*p,`${n} périodes et ${n-1} pauses : ${n*t} + ${(n-1)*p} = ${n*t+(n-1)*p} minutes.`);}
]);
chapter('logic','Raisonnement et logique','Justifier une règle, une possibilité et un contre-exemple.',['integers','divisibility'],
'Une règle doit être explicitée : des premiers termes seuls ne déterminent pas une suite unique. Pour une règle « ajouter d », ajoute d à chaque étape. Une affirmation « tous » est réfutée par un seul contre-exemple. Un entier pair est divisible par 2. Pour compter des choix indépendants, multiplie leurs nombres.',
['Règle ajouter 3 : 2, 5, 8, 11','Pour 3 hauts et 2 pantalons, 6 tenues possibles'],['Suite avec règle','Terme manquant','Choix indépendants','Contre-exemple','Recherche inverse'],[
r=>{let a=r.int(1,50),d=r.int(2,20);return num(`Règle : ajouter ${d} à chaque étape. Suite ${a}, ${a+d}, ${a+2*d}, ?. Quel nombre suit ?`,a+3*d,`Ajoute ${d} au dernier terme : ${a+2*d} + ${d} = ${a+3*d}.`);},
r=>{let a=r.int(1,50),d=r.int(2,20);return num(`Règle : ajouter ${d}. Complète ${a}, ?, ${a+2*d}.`,a+d,`Le terme manquant est ${a} + ${d} = ${a+d}.`);},
r=>{let a=r.int(2,20),b=r.int(2,20);return num(`On choisit un haut parmi ${a}, puis un pantalon parmi ${b}. Toutes les combinaisons sont possibles. Combien de tenues ?`,a*b,`Pour chaque haut, ${b} pantalons : ${a} × ${b} = ${a*b}.`);},
r=>{let a=r.int(2,80)*2;return choice(`Liste : ${a}, ${a+1}, ${a+2}. Quel nombre réfute l’affirmation « tous les nombres de cette liste sont pairs » ?`,a+1,[a,a+2],`${a+1} est impair : il ne se divise pas par 2 sans reste. Un contre-exemple suffit.`);},
r=>{let x=r.int(1,60),a=r.int(2,12),b=r.int(1,30);return num(`Je multiplie un entier par ${a}, puis j’ajoute ${b}. J’obtiens ${a*x+b}. Quel était l’entier ?`,x,`Effectue les opérations inverses : (${a*x+b} − ${b}) ÷ ${a} = ${x}.`);}
]);
const learningOrder=['integers','priorities','powers','divisibility','fractions','decimals','percent','proportion','literal','distributivity','equations','coordinates','angles','triangles','perimeterArea','solids','symmetry','statistics','wordProblems','logic'];
export const mathChapters=learningOrder.map(id=>definitions.find(c=>c.id===id)).map((c,i)=>({...c,order:i+1,families:c.families.map(({build,...f})=>f)}));
/** Two practice questions per family, one assessment question per family. */
export function generateMath(chapterId,{seed='default',avoidFingerprints=[]}={}){
 const chapter=definitions.find(c=>c.id===chapterId);if(!chapter)throw Error(`Unknown maths chapter: ${chapterId}`);
 const random=rng(`${chapterId}:${seed}`),seen=new Set(avoidFingerprints),out=[];
 for(let i=0;i<15;i++){
  const family=chapter.families[i%5];let question;
  for(let tries=0;tries<2000;tries++){
   const q=family.build(random);const fingerprint=`${chapterId}:${hash(q.prompt).toString(16)}`;
   if(seen.has(fingerprint))continue;
   if(q.type==='choice'){
    const answer=q.accepted[0];
    for(let j=q.options.length-1;j>0;j--){const k=random.int(0,j);[q.options[j],q.options[k]]=[q.options[k],q.options[j]];}
    q.correctIndex=q.options.indexOf(answer);
   }
   question={...q,id:`${chapterId}-${hash(String(seed)).toString(16)}-${i+1}`,fingerprint,family:family.id,skills:family.skills,stage:i<10?'practice':'test'};seen.add(fingerprint);break;
  }
  if(!question)throw Error(`Validated question capacity exhausted for ${family.id}; start a supported fresh revision later.`);
  out.push(question);
 }
 return out;
}
