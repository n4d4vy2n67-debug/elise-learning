window.ELISE_EXTRA=window.ELISE_EXTRA||{};window.ELISE_EXTRA.math=window.ELISE_EXTRA.math||{};
(function(){
 const pick=a=>a[Math.floor(Math.random()*a.length)];
 const integer=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
 const txt=(t,n,e)=>({t,type:"text",accept:[String(n)],e});
 const families=[
 ()=>{let a=integer(2,12),b=integer(2,9),c=integer(2,7);return txt(a+" × ("+b+" − "+c+") =",a*(b-c),"Calcule d'abord la parenthèse.")},
 ()=>{let a=integer(2,8),b=integer(2,6),c=integer(2,9);return txt("("+a+" + "+b+")² − "+c+" =",Math.pow(a+b,2)-c,"Parenthèse, puissance, puis soustraction.")},
 ()=>{let a=integer(2,9),b=integer(2,7),c=integer(2,8);return txt("−"+a+" + "+b+" × (−"+c+") =",-a-b*c,"Multiplication des relatifs avant l'addition.")},
 ()=>{let a=integer(2,12),b=integer(2,9),c=integer(2,7);return txt("|−"+a+"| + (−"+b+") × "+c+" =",a-b*c,"La valeur absolue est positive; effectue ensuite le produit.")},
 ()=>{let a=integer(2,9),b=integer(2,6),c=integer(2,8);return txt("(−"+a+")² − "+b+" × "+c+" =",a*a-b*c,"Le carré du nombre négatif entre parenthèses est positif.")},
 ()=>{let a=integer(2,8),b=integer(2,7),c=integer(2,9);return txt("−"+a+"² + ("+b+" − "+c+") =",-a*a+b-c,"Sans parenthèses autour du négatif, la puissance précède le signe moins.")},
 ()=>{let a=integer(2,9),b=integer(2,8),c=integer(2,6);return txt("|"+a+" − "+b+" × "+c+"| =",Math.abs(a-b*c),"Calcule d'abord l'expression à l'intérieur des barres.")},
 ()=>{let a=integer(2,7),b=integer(2,9),c=integer(2,8);return txt("("+a+" − "+b+") × (−"+c+") =", (a-b)*(-c),"Traite les parenthèses puis les signes du produit.")},
 ()=>{let a=integer(2,7),b=integer(2,8),c=integer(2,6);return txt("("+a+" + "+b+") × (−"+c+") + "+a+"² =",-(a+b)*c+a*a,"Parenthèses et puissances avant produits et somme.")},
 ()=>{let a=integer(2,8),b=integer(2,6),c=integer(2,9);return txt("|−"+a+"² + "+b+" × "+c+"| =",Math.abs(-a*a+b*c),"Puissance et produit d'abord, puis valeur absolue.")},
 ()=>{let a=integer(2,7),b=integer(2,6),c=integer(2,8);return txt("("+a+" − "+b+")³ + "+c+" =",Math.pow(a-b,3)+c,"Calcule la parenthèse avant le cube.")},
 ()=>{let a=integer(2,9),b=integer(2,7),c=integer(2,6);return txt("−("+a+" + "+b+") × (−"+c+") =", (a+b)*c,"Deux signes négatifs donnent un produit positif.")}
 ];
 let cursor=0;const order=()=>Array.from({length:families.length},(_,i)=>i).sort(()=>Math.random()-.5);let queue=order();
 window.ELISE_EXTRA.math.priorities=()=>{if(cursor>=queue.length){queue=order();cursor=0}return families[queue[cursor++]]()};
})();
