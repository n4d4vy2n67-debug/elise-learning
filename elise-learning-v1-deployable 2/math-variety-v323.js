window.ELISE_EXTRA=window.ELISE_EXTRA||{};window.ELISE_EXTRA.math=window.ELISE_EXTRA.math||{};
(function(){const M=window.ELISE_EXTRA.math,R=(a,b)=>a+Math.floor(Math.random()*(b-a+1)),P=a=>a[R(0,a.length-1)],T=(q,a,e)=>({t:q,type:"text",accept:[String(a),String(a).replace(".",",")],e}),C=(q,c,w,e)=>{let a=[String(c),...w.map(String)].filter((x,i,s)=>s.indexOf(x)===i);return{t:q,a,c:0,e}};
const banks={
integers:[
()=>{let a=R(-12,12),b=R(-12,12);return T(a+" − ("+b+") =",a-b,"Soustraire revient à ajouter l'opposé.")},
()=>{let a=R(-9,9)||-3,b=R(-9,9)||4;return T(a+" × ("+b+") =",a*b,"Même signe : positif ; signes différents : négatif.")},
()=>{let b=R(2,9),a=b*R(-8,8);return T(a+" ÷ ("+b+") =",a/b,"Divise les valeurs puis vérifie le signe.")},
()=>{let a=R(-20,20),b=R(-20,20);return C("Le plus grand nombre ?",Math.max(a,b),[Math.min(a,b)-1,Math.max(a,b)+1],"Compare sur une droite graduée.")}],
powers:[
()=>{let a=R(2,8);return T("(−"+a+")² =",a*a,"Une base négative au carré donne un résultat positif.")},
()=>{let a=R(2,8);return T("−"+a+"² =",-a*a,"Le signe moins est à l'extérieur de la puissance.")},
()=>{let a=R(2,5);return T("(−"+a+")³ =",-a*a*a,"Un cube conserve le signe négatif.")},
()=>{let a=R(2,7);return T(a+"² + "+a+" =",a*a+a,"Calcule d'abord la puissance.")}],
fractions:[
()=>{let a=R(1,6),b=R(2,9);return T(a+"/"+b+" + "+a+"/"+b+" = (numérateur, dénominateur)",(2*a)+","+b,"On additionne les numérateurs à dénominateur identique.")},
()=>{let a=R(2,8),b=R(2,9);return T((a*b)+"/"+(b*2)+" simplifiée = (numérateur, dénominateur)",a+","+2,"Divise les deux termes par le même facteur.")},
()=>{let a=R(1,6),b=R(a+1,10);return C("Quelle fraction est la plus grande ?",b+"/10",[a+"/10",(a-1)+"/10"],"À dénominateur égal, compare les numérateurs.")},
()=>{let a=R(1,6),b=R(2,8);return T(a+"/"+b+" × 2 = (numérateur, dénominateur)",(2*a)+","+b,"Multiplie le numérateur par deux.")}],
decimals:[
()=>{let a=R(11,95)/10,b=R(11,65)/10;return T(a+" − "+b+" =",Math.round((a-b)*10)/10,"Aligne les virgules.")},
()=>{let a=R(2,9)/10,b=R(2,9);return T(a+" × "+b+" =",Math.round(a*b*10)/10,"Multiplie puis place la virgule.")},
()=>{let a=R(2,9),b=R(2,9);return T((a*b)/10+" ÷ "+b+" =",a/10,"Divise en conservant la valeur décimale.")},
()=>{let a=R(10,99)/10,b=R(10,99)/10;return C("Quel nombre est le plus grand ?",Math.max(a,b),[Math.min(a,b),Math.min(a,b)-0.1],"Compare les dixièmes.")}],
divisibility:[
()=>{let a=R(20,200);return C(a+" est divisible par 2 ?",a%2===0?"oui":"non",[a%2===0?"non":"oui"],"Regarde le dernier chiffre.")},
()=>{let a=R(20,200);return C(a+" est divisible par 3 ?",a%3===0?"oui":"non",[a%3===0?"non":"oui"],"Additionne les chiffres.")},
()=>{let a=R(20,200);return C(a+" est divisible par 5 ?",a%5===0?"oui":"non",[a%5===0?"non":"oui"],"Terminaison 0 ou 5.")},
()=>{let a=R(2,12),b=R(2,8);return T("Combien vaut "+a+" × "+b+" ?",a*b,"Un multiple est un produit.")}],
percent:[
()=>{let a=R(2,8)*10;return T("Prix "+a+" €, remise de 10 %. Prix final =",a*0.9,"Soustrais la remise au prix initial.")},
()=>{let a=R(2,8)*10;return T("Prix "+a+" €, augmentation de 20 %. Prix final =",a*1.2,"Ajoute 20 % au prix.")},
()=>{let a=R(2,8)*10;return T("La moitié de "+a+" =",a/2,"50 % correspond à la moitié.")},
()=>{let a=R(2,8)*10;return T("25 % de "+a+" =",a/4,"25 % correspond au quart.")}],
proportion:[
()=>{let a=R(2,8),b=R(2,8);return T("4 cahiers coûtent "+(4*a)+" €. Prix de "+b+" cahiers =",a*b,"Passe par le prix unitaire.")},
()=>{let a=R(2,7),b=R(2,8);return T("Pour "+a+" personnes, il faut "+(a*b)+" g. Pour 1 personne =",b,"Divise par le nombre de personnes.")},
()=>{let a=R(2,9),b=R(2,9);return T("Distance à 3 km/h pendant "+a+" heures =",3*a,"Distance = vitesse × durée.")},
()=>{let a=R(2,8);return C("Le tableau 1→"+a+", 2→"+(2*a)+", 3→"+(3*a)+" est proportionnel ?","oui",["non"],"Même coefficient partout.")}],
literal:[
()=>{let a=R(2,8),b=R(1,7);return C("Réduis : "+a+"x − "+b+"x",(a-b)+"x",[(a+b)+"x",(a*b)+"x"],"Soustrais les coefficients.")},
()=>{let a=R(2,8),b=R(2,8);return C("Réduis : "+a+"x + "+b+" + 2x",(a+2)+"x + "+b,[(a+b+2)+"x",(a+2)+"x"],"Regroupe les termes semblables.")},
()=>{let a=R(2,8);return C("Que vaut "+a+"x pour x=3 ?",a*3,[a+3,a*2],"Remplace x par 3.")},
()=>{let a=R(2,8);return C("Réduis : "+a+"x + x",(a+1)+"x",[a+"x",a+"x²"],"x = 1x.")}],
distributivity:[
()=>{let a=R(2,7),b=R(2,8);return C("Développe "+a+"(x − "+b+")",a+"x − "+(a*b),[a+"x − "+b,a+"x + "+a*b],"Distribue le facteur avec le signe.")},
()=>{let a=R(2,7),b=R(2,8);return C("Développe −"+a+"(x + "+b+")","−"+a+"x − "+(a*b),["−"+a+"x + "+a*b,a+"x − "+a*b],"Le signe négatif s'applique aux deux termes.")},
()=>{let a=R(2,7),b=R(2,8);return C("Développe "+a+"(2x + "+b+")",(2*a)+"x + "+(a*b),[a+"x + "+a*b,(2*a)+"x + "+b],"Distribue aux deux termes.")},
()=>{let a=R(2,7),b=R(2,8);return C("Réduis "+a+"x + "+b+"x",(a+b)+"x",[(a*b)+"x",(a+b)+"x²"],"Additionne les coefficients.")}],
equations:[
()=>{let x=R(2,12),a=R(2,8);return T("x − "+a+" = "+(x-a)+". x =",x,"Ajoute a aux deux membres.")},
()=>{let x=R(2,12),a=R(2,8);return T(a+"x = "+(a*x)+". x =",x,"Divise les deux membres par a.")},
()=>{let x=R(2,12),a=R(2,8);return T("x + "+a+" = "+(x+a)+". x =",x,"Soustrais a aux deux membres.")},
()=>{let x=R(2,12),a=R(2,8);return C("x="+x+" vérifie quelle équation ?","x + "+a+" = "+(x+a),["x + "+a+" = "+(x+a+1),"x − "+a+" = "+(x+a)],"Remplace x par sa valeur.")}],
coordinates:[
()=>{let x=R(-6,6),y=R(-6,6);return T("A("+x+" ; "+y+"). Abscisse =",x,"Première coordonnée.")},
()=>{let x=R(-6,6),y=R(-6,6);return T("A("+x+" ; "+y+"). Ordonnée =",y,"Deuxième coordonnée.")},
()=>{let x=R(1,6),y=R(1,6);return C("Point ("+(-x)+" ; "+y+") : quadrant ?","II",["I","III","IV"],"Abscisse négative, ordonnée positive.")},
()=>{let x=R(1,6),y=R(1,6);return C("Point ("+x+" ; "+(-y)+") : quadrant ?","IV",["I","II","III"],"Abscisse positive, ordonnée négative.")}],
angles:[
()=>{let a=R(2,8)*10;return T("Complément de "+a+"° =",90-a,"Deux angles complémentaires font 90°.")},
()=>{let a=R(2,15)*10;return T("Supplément de "+a+"° =",180-a,"Deux angles supplémentaires font 180°.")},
()=>{let a=R(2,8)*10,b=R(2,8)*10;return T("Triangle : angles "+a+"° et "+b+"°. Troisième angle =",180-a-b,"La somme des angles d'un triangle vaut 180°.")},
()=>{let a=R(20,89);return C("Un angle de "+a+"° est...","aigu",["droit","obtus"],"Moins de 90° : aigu.")}],
triangles:[
()=>C("Un triangle avec deux côtés égaux est...","isocèle",["scalène","équilatéral uniquement"],"Deux côtés égaux définissent un isocèle."),
()=>C("Un quadrilatère à côtés opposés parallèles est...","parallélogramme",["trapèze quelconque","triangle"],"Deux paires de côtés opposés parallèles."),
()=>C("Un rectangle a-t-il quatre angles droits ?","oui",["non"],"C'est sa propriété."),
()=>C("Un triangle avec un angle droit est...","rectangle",["obtusangle","équilatéral"],"Un angle de 90°.")],
perimeterArea:[
()=>{let a=R(2,9);return T("Aire d'un carré de côté "+a+" cm =",a*a,"Côté × côté.")},
()=>{let a=R(2,9);return T("Périmètre d'un carré de côté "+a+" cm =",4*a,"Quatre côtés égaux.")},
()=>{let a=R(2,9),b=R(2,9);return T("Aire triangle base "+(2*a)+" cm, hauteur "+b+" cm =",a*b,"Base × hauteur ÷ 2.")},
()=>{let a=R(2,9),b=R(2,9);return T("Périmètre rectangle "+a+" cm × "+b+" cm =",2*(a+b),"Deux longueurs et deux largeurs.")],
solids:[
()=>{let a=R(2,8);return T("Volume d'un cube de côté "+a+" cm =",a*a*a,"Côté au cube.")},
()=>{let a=R(2,8),b=R(2,8),c=R(2,8);return T("Volume d'un pavé "+a+" × "+b+" × "+c+" cm =",a*b*c,"Longueur × largeur × hauteur.")},
()=>{let a=R(2,8);return T(a+" L = combien de cm³ ?",a*1000,"1 L = 1000 cm³.")},
()=>{let a=R(2,8);return C("Un cube possède combien de faces ?","6",["4","8"],"Six faces carrées.")],
symmetry:[
()=>C("Un point situé sur l'axe de symétrie reste-t-il fixe ?","oui",["non"],"Il est invariant."),
()=>C("La symétrie axiale conserve-t-elle les longueurs ?","oui",["non"],"Les distances sont conservées."),
()=>C("Une translation conserve-t-elle les angles ?","oui",["non"],"Les angles sont conservés."),
()=>C("Une symétrie centrale est-elle un demi-tour ?","oui",["non"],"C'est une rotation de 180°.")],
statistics:[
()=>{let a=R(2,8),b=R(2,8),c=R(2,8);return T("Moyenne de "+a+", "+b+", "+c+" =",Math.round((a+b+c)/3*100)/100,"Somme divisée par trois.")},
()=>{let a=R(2,8),b=R(2,8);return T("Médiane de "+a+", "+(a+2)+" et "+(a+5)+" =",a+2,"Valeur centrale après classement.")},
()=>{let a=R(2,8),b=R(2,8);return T("Étendue de "+a+", "+(a+b)+" et "+(a+b+4)+" =",b+4,"Maximum moins minimum.")},
()=>{let a=R(2,8);return T("Effectif total : "+a+" filles et "+(a+3)+" garçons =",2*a+3,"Additionne les effectifs.")],
wordProblems:[
()=>{let a=R(2,9),b=R(2,8);return T(a+" cahiers à "+b+" € et 5 € de frais : total =",a*b+5,"Produit puis addition.")},
()=>{let a=R(2,8),b=R(2,8);return T("Budget "+(a*b+10)+" €, achat de "+a+" objets à "+b+" €. Reste =",10,"Soustrais les achats du budget.")},
()=>{let a=R(2,8),b=R(2,8);return T(a+" paquets de "+b+" biscuits, partagés entre "+a+" enfants : chacun reçoit =",b,"Multiplie puis divise.")},
()=>{let a=R(2,8),b=R(2,8);return T("Trajet de "+a+" km le matin et "+b+" km l'après-midi, sur 2 jours =",2*(a+b),"Additionne les distances puis double.")],
logic:[
()=>{let a=R(2,8);return T("Suite : "+a+", "+(a+3)+", "+(a+6)+", ... prochain =",a+9,"Ajoute 3.")},
()=>{let a=R(2,8);return T("Suite : "+a+", "+(2*a)+", "+(4*a)+", ... prochain =",8*a,"Multiplie par deux.")},
()=>C("Tous les carrés sont-ils des rectangles ?","oui",["non"],"Ils possèdent quatre angles droits."),
()=>C("Si A > B et B > C, alors A > C ?","oui",["non"],"Transitivité de l'ordre.")]};
for(const [id,fns] of Object.entries(banks)){let queue=[],cursor=0;M[id]=()=>{if(cursor>=queue.length){queue=fns.map((_,i)=>i).sort(()=>Math.random()-.5);cursor=0}return fns[queue[cursor++]]()}}
window.ELISE_MATH_FAMILIES=Object.fromEntries(Object.entries(banks).map(([id,f])=>[id,f.length]));
})();