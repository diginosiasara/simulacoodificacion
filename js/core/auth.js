/* Cuentas locales: usuarios, sesión, contraseñas (PBKDF2-SHA256), recuperación y progreso compartido.
   Sin servidor: los datos viven en este navegador (ver README). Las contraseñas nunca se guardan en claro. */
let ME=null;
const ROL={root:'Super usuario',profesor:'Profesor',usuario:'Alumno',invitado:'Invitado'};
const AU=(()=>{
 const enc=new TextEncoder(),b64=u=>btoa(String.fromCharCode(...u)),unb=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0)),rnd=n=>crypto.getRandomValues(new Uint8Array(n)),hex=u=>[...u].map(x=>x.toString(16).padStart(2,'0')).join('');
 const kdf=async(s,salt,it)=>{const k=await crypto.subtle.importKey('raw',enc.encode(s),'PBKDF2',false,['deriveBits']);return b64(new Uint8Array(await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:unb(salt),iterations:it},k,256)))};
 const sha=async s=>hex(new Uint8Array(await crypto.subtle.digest('SHA-256',enc.encode(s)))),mkPw=(p,s)=>kdf(p,s,150000),mkEm=(e,s)=>kdf(String(e).trim().toLowerCase(),s,50000),newSalt=()=>b64(rnd(16));
 const loc=()=>store.get('cs_users',[]),all=()=>{const l=loc(),ids=new Set(l.map(u=>u.id));return[...(window.USUARIOS_SEED||[]).filter(u=>!ids.has(u.id)),...l]},get=id=>all().find(u=>u.id===String(id).trim().toLowerCase());
 const put=u=>store.set('cs_users',[...loc().filter(x=>x.id!==u.id),u]),patch=(id,p)=>put({...get(id),...p});
 const seq=p=>{const l=p.toLowerCase();for(let i=0;i<l.length-2;i++){if(!/^[a-z0-9]{3}$/.test(l.slice(i,i+3)))continue;const a=l.charCodeAt(i),b=l.charCodeAt(i+1),c=l.charCodeAt(i+2);if((b-a===1&&c-b===1)||(a-b===1&&b-c===1)||(a===b&&b===c))return true}return false};
 const pwErr=p=>p.length<8?'Mínimo 8 caracteres.':!/[a-z]/.test(p)||!/[A-Z]/.test(p)||!/\d/.test(p)?'Debe mezclar mayúsculas, minúsculas y números.':seq(p)?'No uses caracteres seguidos (abc, 123, aaa).':'';
 const tmpPw=()=>{const C='ABCDEFGHJKMNPQRSTUVWXYZ',c='abcdefghjkmnpqrstuvwxyz',d='23456789';for(;;){const p=[...rnd(10)].map((x,i)=>(i%3===0?C:i%3===1?c:d)[x%(i%3===0?C.length:i%3===1?c.length:d.length)]).join('');if(!pwErr(p))return p}};
 const sess=()=>{try{return JSON.parse(sessionStorage.getItem('cs_sess'))}catch(e){return null}},setSess=o=>sessionStorage.setItem('cs_sess',JSON.stringify(o)),endSess=()=>sessionStorage.removeItem('cs_sess');
 const mask=e=>{const[a,b]=String(e).split('@');return(a[0]||'')+'***@'+(b||'')};
 async function verify(u,pw){return !!u&&await mkPw(pw,u.salt)===u.h}
 async function login(id,pw){const k=store.get('cs_lock',{n:0,t:0});if(k.t>Date.now())return{err:`Demasiados intentos. Espera ${Math.ceil((k.t-Date.now())/1000)} s.`};const u=get(id);if(!(u&&!u.disabled&&await verify(u,pw))){k.n++;if(k.n>=5){k.t=Date.now()+60000;k.n=0}store.set('cs_lock',k);return{err:'Usuario o contraseña incorrectos.'}}store.set('cs_lock',{n:0,t:0});return{u}}
 async function setPw(id,pw){const salt=newSalt();patch(id,{salt,h:await mkPw(pw,salt),mustChange:false})}
 async function mail(to,subject,body){const ep=LEGAL.mailEndpoint;if(ep){try{const r=await fetch(ep,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({to,subject,message:body})});return r.ok?'sent':'fail'}catch(e){return'fail'}}try{location.href='mailto:'+to+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body)}catch(e){}return'mailto'}
 const base=()=>location.href.split('#')[0],RS=()=>store.get('cs_resets',[]).filter(x=>x.exp>Date.now());
 async function startReset(id,email){const u=get(id);if(!u||u.disabled||u.rol==='invitado'||!u.eh||await mkEm(email,u.es)!==u.eh)return'noop';const t=hex(rnd(16));store.set('cs_resets',[...RS(),{id:u.id,th:await sha(t),exp:Date.now()+30*60000,stage:'A',em:String(email).trim()}]);
  return mail(String(email).trim(),'CodiSalud: intento de cambio de contraseña',`Hola ${u.nombre}:\n\nSe ha intentado cambiar la contraseña de tu cuenta «${u.id}» (${new Date().toLocaleString('es-ES')}).\n\nSi has sido tú, confirma abriendo este enlace (caduca en 30 minutos y solo sirve una vez):\n${base()}#confirm=${t}\n\nSi no has sido tú, ignora este mensaje: tu contraseña no cambiará.\n\nCodiSalud · APRENDE · PRACTICA · DOMINA`)}
 async function take(t,stage){const th=await sha(t),R=RS(),i=R.findIndex(x=>x.th===th&&x.stage===stage);if(i<0)return null;const[x]=R.splice(i,1);store.set('cs_resets',R);return x}
 async function confirmReset(t){const x=await take(t,'A');if(!x)return null;const t2=hex(rnd(16));store.set('cs_resets',[...RS(),{id:x.id,th:await sha(t2),exp:Date.now()+15*60000,stage:'B'}]);let sent=false;
  if(LEGAL.mailEndpoint)sent=(await mail(x.em,'CodiSalud: enlace protegido para cambiar tu contraseña',`Has confirmado que eres tú. Elige tu nueva contraseña con este enlace (caduca en 15 minutos, un solo uso):\n${base()}#reset=${t2}`))==='sent';return{t2,sent}}
 async function finishReset(t,pw){const x=await take(t,'B');if(!x)return null;await setPw(x.id,pw);return x.id}
 async function requestAccess(f){return mail(LEGAL.mailAdmin,'CodiSalud: solicitud de usuario de acceso',`Solicitud de usuario (${new Date().toLocaleString('es-ES')})\n\nUsuario deseado: ${f.user}\nCorreo: ${f.email}\n¿Por dónde conoció la app?: ${f.origen}\n¿Para qué la va a usar?: ${f.uso}\n\nConsentimiento para tratar estos datos con el fin de gestionar la solicitud: sí`)}
 async function createUser({id,nombre,email,rol}){id=id.trim().toLowerCase();if(get(id))return{err:'Ese usuario ya existe.'};const salt=newSalt(),es=newSalt(),pw=tmpPw();put({id,nombre:nombre||id,rol,salt,h:await mkPw(pw,salt),es,eh:await mkEm(email,es),mask:mask(email),mustChange:true,created:Date.now()});return{pw}}
 async function resetUser(id){const pw=tmpPw(),salt=newSalt();patch(id,{salt,h:await mkPw(pw,salt),mustChange:true,disabled:false});return pw}
 const IX=()=>store.get('cs_idx',{}),ixSave=(id,x)=>store.set('cs_idx',{...IX(),[id]:x}),SH=()=>store.get('cs_shared',{}),shSave=o=>store.set('cs_shared',o);
 const idxSet=u=>ixSave(u.id,{...(IX()[u.id]||{}),nombre:u.nick||u.nombre,rol:u.rol,avatar:u.avatar||'',share:!!u.share,last:Date.now()});
 const snap=(u,rec)=>({id:u.id,nombre:u.nick||u.nombre,avatar:u.avatar||'',rol:u.rol,act:Date.now(),rec:rec.slice(-200).map(r=>({ts:r.ts,g:r.g,n:r.n,ok:r.ok,secs:r.secs,mode:r.mode}))});
 const stats=rec=>{const n=rec.length;if(!n)return{n:0};const g=rec.map(r=>+r.g||0),tot=rec.reduce((a,r)=>a+(+r.n||0),0),sm=a=>a.reduce((x,y)=>x+y,0);return{n,avg:sm(g)/n,acc:tot?sm(rec.map(r=>+r.ok||0))/tot:0,best:Math.max(...g),last:rec[n-1].ts,trend:n>=4?sm(g.slice(-3))/3-sm(g.slice(0,-3))/(n-3):0}};
 return{get,all,put,patch,login,verify,setPw,pwErr,tmpPw,sess,setSess,endSess,mask,mkEm,newSalt,startReset,confirmReset,finishReset,requestAccess,createUser,resetUser,IX,ixSave,SH,shSave,idxSet,snap,stats,loc,mail}
})();
function shareSync(){if(!ME)return;const x=AU.IX()[ME.id]||{};AU.ixSave(ME.id,{...x,share:!!ME.share,nombre:ME.nick||ME.nombre,avatar:ME.avatar||'',rol:ME.rol,last:Date.now()});const o=AU.SH();if(ME.share)o[ME.id]=AU.snap(ME,DB.rec);else delete o[ME.id];AU.shSave(o)}
