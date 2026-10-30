#!/usr/bin/env node
/* Genera la entrada de data/usuarios.js para un usuario sin escribir su clave en ningún archivo.
   Uso:  node tools/hash-user.js <usuario> <rol: root|profesor|usuario|invitado> <correo> [--temporal]
   La contraseña se pide por entrada estándar (no queda en el historial). */
const wc=require('crypto').webcrypto,rl=require('readline'),subtle=wc.subtle,enc=new TextEncoder(),b64=u=>Buffer.from(u).toString('base64');
const kdf=async(s,salt,it)=>{const k=await subtle.importKey('raw',enc.encode(s),'PBKDF2',false,['deriveBits']);return b64(new Uint8Array(await subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:Buffer.from(salt,'base64'),iterations:it},k,256)))};
const ns=()=>b64(wc.getRandomValues(new Uint8Array(16)));
const [,,nombre,rol,email,flag]=process.argv;if(!nombre||!rol||!email){console.error('Uso: node tools/hash-user.js <usuario> <rol> <correo> [--temporal]');process.exit(1)}
const r=rl.createInterface({input:process.stdin,output:process.stderr});
r.question('Contraseña: ',async pw=>{r.close();const salt=ns(),es=ns();
 console.log(JSON.stringify({id:nombre.toLowerCase(),nombre,rol,salt,h:await kdf(pw,salt,150000),es,eh:await kdf(email.trim().toLowerCase(),es,50000),mask:email[0]+'***@'+email.split('@')[1],mustChange:flag==='--temporal'},null,1)+',')});
