/* Dificultad adaptativa, corrección, puntuación y preparación de preguntas */
const eff=q=>{const e=DB.fail[q.k]||{},f=e.f|0,h=Math.max(0,(e.a|0)-f);return Math.max(1,Math.min(4,(q.d||2)+Math.max(-3,Math.min(3,f-.5*h))))},lvl=q=>Math.round(eff(q));
const done=q=>q.t==='match'?q.a.some(x=>x>=0):q.t==='multi'?q.a.length>0:q.t==='code'?(q.alt?q.oa!=null:!!q.a.dp.trim()):q.a!=null;
const mok=q=>q.a.filter((r,i)=>r>=0&&q.R[r].i===i).length,raw=q=>{if(!done(q))return 0;if(q.t==='match')return mok(q)/q.L.length;if(q.t==='multi'){const h=q.a.filter(i=>q.cs.includes(i)).length;return Math.max(0,(h-(q.a.length-h))/q.cs.length)}if(q.t==='code'){if(q.alt)return q.oa===q.c?.5:0;const u=q.a.ds.map(nz).filter(Boolean),e=q.ds.map(nz);return(((q.rng?new RegExp(q.rng).test(nz(q.a.dp)):[q.dp,...(q.al||[])].map(nz).includes(nz(q.a.dp)))?1:0)+q.ds.filter(c=>[c,...((q.als||{})[c]||[])].map(nz).some(x=>u.includes(x))).length)/(1+e.length)}return q.a===q.c?1:0};
const good=q=>raw(q)>=(q.alt?.5:1);
const stt=q=>q.skip||!done(q)?'sk':q.t==='multi'||q.t==='match'?(good(q)?'ok':raw(q)>0?'hf':'no'):q.t==='code'&&q.alt?(good(q)?'hf':'ho'):good(q)?'ok':'no';
const sc=q=>q.t==='match'&&done(q)?Math.max(-1/3,(mok(q)-(q.a.filter(x=>x>=0).length-mok(q))/3)/q.L.length):q.t==='multi'&&done(q)&&raw(q)===0?-1/3:(q.t==='mc'||q.t==='vf')&&q.a!=null&&q.a!==q.c?-1/3:q.t==='code'&&q.alt&&q.oa!=null&&q.oa!==q.c?-.5:raw(q);
const sol=q=>q.t==='match'?q.L.map((l,i)=>l+' → '+q.Rt[i]).join(' · '):q.t==='multi'?q.cs.map(i=>q.o[i]).join(' · '):q.t==='code'?fmt(q.dp,q.ds,q.nd,1):q.o[q.c];
const prep=q=>{if(q.t==='match')return{...q,R:sh([...q.Rt.map((t,i)=>({t,i})),...q.X.map((t,j)=>({t,i:-1-j}))]),a:q.L.map(()=>-1),sl:-1,f:0,hu:0,lock:0};const ord=sh(q.o.map((_,i)=>i)),o=ord.map(i=>q.o[i]),c=ord.indexOf(q.c);
 if(q.t==='multi')return{...q,o,cs:q.cs.map(i=>ord.indexOf(i)),a:[],f:0,hu:0,lock:0};
 return q.t==='code'?{...q,o,c,a:{dp:'',ds:Array(Math.max(2,q.ds.length)).fill('')},oa:null,alt:0,skip:0,f:0,hu:0,lock:0}:{...q,o,c,a:null,f:0,hu:0,lock:0}};
