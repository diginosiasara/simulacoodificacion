/* Vista: configuración del simulacro */
function cfgView(){const h=DB.rec,cand=Q.filter(inc),av=cfg.fallas?FL().length:cand.length,n=cfg.n?Math.min(cfg.n,av):av,bs=Q.filter(q=>cfg.temas.has(q.tema)),cn=t=>bs.filter(q=>q.t===t).length;
const seg=(a,cur,items)=>`<div class="seg">${items.map(([v,t])=>`<button class="${cur===v?'on':''}" data-a="${a}" data-v="${v}">${t}</button>`).join('')}</div>`,
 TH={mc:[200,'◉'],multi:[265,'☑'],vf:[330,'V/F'],code:[140,'J45']},
 tile=(t,d,n)=>`<button class="tile${cfg.tipos.has(t)?' on':''}${n?'':' z'}" style="--h:${TH[t][0]}" data-a="tipo" data-v="${t}" aria-pressed="${cfg.tipos.has(t)}"><span class="ic">${TH[t][1]}</span><span class="tt"><b>${TIPOS[t]}</b><small>${d}</small></span><span class="cn">${n}</span></button>`;
A.innerHTML=`<div class="card cfgc"><section class="cs"><h4><b>1</b>Contenido</h4><div class="row">${chip(cfg.fallas,'pre','fail','Más falladas ('+FL().length+')')}${chip(0,'pre','all','Todo')}${Object.keys(SRC).map(k=>chip(0,'pre',k,'Solo '+SRC[k],'cc s-'+k)).join('')}</div>
${Object.keys(SRC).map(k=>`<div class="sg s-${k}"><span class="sbn">${SRC[k]}</span><div class="row">${TEMAS.filter(t=>TS[t]===k).map(t=>chip(cfg.temas.has(t),'tema',esc(t),t,'cc tm',TCS[t])).join('')}</div></div>`).join('')}</section>
<section class="cs"><h4><b>2</b>Tipo de pregunta<small>marca uno o varios</small></h4>
<div class="gh">Teóricas</div><div class="tiles">${tile('mc','Test con una sola respuesta válida',cn('mc'))}${tile('multi','Marca todas las correctas',cn('multi'))}${tile('vf','Decide si la afirmación es cierta',cn('vf'))}</div>
<div class="gh">Prácticas</div><div class="tiles">${tile('code','Escribe el código en los campos DP y DS',cn('code'))}</div></section>
<section class="cs"><h4><b>3</b>Preguntas y nivel</h4><div class="lbl">Número de preguntas</div>${seg('n',cfg.n,[10,15,20,40,60,0].map(x=>[x,x||'Todas']))}
${cfg.n&&!cfg.fallas?`<div class="lbl">Dificultad</div>${seg('nivel',cfg.nivel,[['mix','Mixto'],...NV.map((x,i)=>[i+1,x+' <small>'+cand.filter(q=>lvl(q)===i+1).length+'</small>'])])}<p class="note">Cada pregunta parte de su dificultad base y se ajusta con tu historial: los fallos la hacen más difícil y los aciertos más fácil.</p>`:''}</section>
<section class="cs"><h4><b>4</b>Modo</h4>${seg('mode',cfg.mode,[['examen','Examen con cronómetro'],['practica','Práctica sin cronómetro']])}
<details class="pt"><summary>Cómo se puntúa</summary><p class="note">Acierto +1, fallo −⅓, en blanco 0. Un código contestado con «Cambiar a tipo test» vale ½ (fallo −½). En selección múltiple cada opción correcta suma y cada incorrecta resta (si no aciertas ninguna, −⅓).</p></details></section>
<div class="go"><button class="b" data-a="go" ${av?'':'disabled'}>Comenzar simulacro</button><span>${av} disponibles · se usarán ${n}${cfg.mode==='examen'?' · unos '+Math.round(n*1.3)+' min':''}</span></div></div>
${h.length?`<h3>Últimos intentos</h3>${h.slice(-5).reverse().map(x=>`<div class="hist"><span>${fd(x.ts)}</span><div class="bar"><i style="width:${x.g*10}%"></i></div><b>${x.g.toFixed(1)}</b></div>`).join('')}`:''}`}
