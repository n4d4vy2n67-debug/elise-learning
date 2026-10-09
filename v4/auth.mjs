// Firebase Auth REST keeps the application independent of external script CDNs.
const KEY='elise-v4-auth';
let config={}, current=null;
try{current=JSON.parse(localStorage.getItem(KEY)||'null')}catch{}
export function configureAuth(value){config=value||{}}
export function user(){return current}
function save(value){current=value;if(value)localStorage.setItem(KEY,JSON.stringify(value));else localStorage.removeItem(KEY)}
export async function signIn(email,password){
 if(!config.apiKey)throw new Error('La connexion Firebase n’est pas configurée. L’équipe IT doit renseigner FIREBASE_WEB_CONFIG.');
 const response=await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${encodeURIComponent(config.apiKey)}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password,returnSecureToken:true})});
 const data=await response.json();if(!response.ok)throw new Error('Connexion refusée. Vérifie ton adresse et ton mot de passe.');
 save({uid:data.localId,email:data.email,idToken:data.idToken,refreshToken:data.refreshToken,expiresAt:Date.now()+Number(data.expiresIn)*1000});return current;
}
export async function token(){
 if(!current)return null;
 if(current.expiresAt>Date.now()+60000)return current.idToken;
 const response=await fetch(`https://securetoken.googleapis.com/v1/token?key=${encodeURIComponent(config.apiKey)}`,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'refresh_token',refresh_token:current.refreshToken})});
 const data=await response.json();if(!response.ok){save(null);throw new Error('Reconnecte-toi pour reprendre ta séance.');}
 save({...current,idToken:data.id_token,refreshToken:data.refresh_token,expiresAt:Date.now()+Number(data.expires_in)*1000});return current.idToken;
}
export async function resetPassword(email){if(!config.apiKey)throw new Error('Connexion non configurée.');const response=await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${encodeURIComponent(config.apiKey)}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({requestType:'PASSWORD_RESET',email})});if(!response.ok)throw new Error('La demande n’a pas pu être envoyée.');}
export function signOut(){save(null)}
