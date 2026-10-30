/* Arranque, eventos y cambio de tema */
function show(){tab==='me'?meView():tab==='cmp'?cmpView():tab==='adm'?admView():tab==='dash'?dashView():tab==='bank'?bankView():S?(S.phase==='run'?runView():resView()):cfgView()}
A.addEventListener('input',e=>{const k=e.target.dataset.k;if(k==null||!S||S.phase!=='run')return;const q=S.qs[S.i],a=q.a;k==='dp'?a.dp=e.target.value:a.ds[+k]=e.target.value;const c=A.querySelector('[data-a=check]');if(c)c.disabled=!!q.lock||!done(q)});
A.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b)return;const d=b.dataset,a=d.a,v=d.v,q=S&&S.qs[S.i];
 if(a==='pre'){cfg.fallas=v==='fail';cfg.temas=new Set(TEMAS.filter(t=>v==='all'||v==='fail'||TS[t]===v))}
 else if(a==='tipo'){cfg.fallas=cfg.fallas;cfg.tipos.has(v)?cfg.tipos.size>1&&cfg.tipos.delete(v):cfg.tipos.add(v)}
 else if(a==='nivel')cfg.nivel=v==='mix'?'mix':+v;
 else if(a==='tema'){cfg.fallas=false;const t=TEMAS.find(x=>esc(x)===v);cfg.temas.has(t)?cfg.temas.size>1&&cfg.temas.delete(t):cfg.temas.add(t)}
 else if(a==='sortr')dsort=v;else if(a==='exp')return exportJ();else if(a==='imp')return $('#fi').click();else if(a==='rst'){if(!confirm('¿Borrar todos los registros y las preguntas falladas?'))return;DB.rec=[];DB.fail={};save()}
 else if(a==='n')cfg.n=+v;else if(a==='mode')cfg.mode=v;
 else if(a==='go'||a==='again')return start();
 else if(a==='wrong')return start(sh(S.qs.filter(x=>!good(x)).map(x=>x.id)));
 else if(a==='cfg'){clearInterval(S.iv);S=null}
 else if(a==='ml'){if(q.lock)return;const i=+v;if(q.a[i]>=0){q.a[i]=-1;q.sl=i}else q.sl=q.sl===i?-1:i}
 else if(a==='mr'){if(q.lock||q.sl<0)return;q.a[q.sl]=+v;q.sl=q.a.findIndex(x=>x<0)}
 else if(a==='mopt'){if(q.lock)return;const k=+v,i=q.a.indexOf(k);i<0?q.a.push(k):q.a.splice(i,1)}
 else if(a==='opt'){if(q.t==='code')q.oa=q.oa===+v?null:+v;else q.a=q.a===+v?null:+v}
 else if(a==='check'){if(!done(q))return;q.lock=1}
 else if(a==='idk'){q.a.dp='';q.a.ds=q.a.ds.map(()=>'');q.oa=null;q.skip=1;q.lock=1}else if(a==='alt')q.alt=q.alt?0:1;else if(a==='hint')q.hu++;else if(a==='flag')q.f=!q.f;
 else if(a==='j')S.i=+v;else if(a==='prev')S.i--;
 else if(a==='next'){if(S.i<S.qs.length-1)S.i++;else{const u=S.qs.filter(x=>!done(x)).length;if(!u||confirm(`Te quedan ${u} sin responder. ¿Finalizar?`))return finish()}}
 else if(a==='end'){const u=S.qs.filter(x=>!done(x)).length;if(confirm(u?`Quedan ${u} sin responder. ¿Finalizar?`:'¿Finalizar el simulacro?'))return finish()}
 show()});
document.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>{tab=b.dataset.tab;document.querySelectorAll('.tabs button').forEach(x=>x.classList.toggle('on',x===b));show()});
$('#th').onclick=()=>{const r=document.documentElement,d=r.dataset.theme?r.dataset.theme==='dark':matchMedia('(prefers-color-scheme:dark)').matches;r.dataset.theme=d?'light':'dark'};
boot();
