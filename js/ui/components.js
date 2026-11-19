/* Fragmentos de HTML reutilizables (etiquetas, chips) */
const lv=q=>{const l=lvl(q);return`<span class="lv" title="Dificultad actual: sube con tus fallos y respuestas en blanco y baja con tus aciertos"><i>${'●'.repeat(l)}${'○'.repeat(4-l)}</i>${NV[l-1]}</span>`},ty=q=>q.t==='code'?'<span class="ty" title="Práctica de desarrollo: se escriben DP y DS">Práctica</span>':'<span class="ty" title="Pregunta teórica: tipo test o selección múltiple">Teórica</span>';
const sb=s=>`<span class="sb s-${s}">${stz(s)}${SRC[s]}</span>`,tp=t=>`<span class="tp tm" style="${TCS[t]}">${t}</span>`;
const chip=(on,a,v,t,x='',st='')=>`<button class="chip ${on?'on':''} ${x}" style="${st}" data-a="${a}" data-v="${v}">${t}</button>`;
/* Datos de las preguntas especiales facilitadas por el docente (solo se muestran tras responder, en el banco y en la corrección) */
const CON={coincide:'Coincide',matiz:'Coincide, con matiz',no:'No coincide'},
esp=(q,open)=>{const e=q.esp;if(!e)return'';const r=(k,v)=>v?`<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`:'';
 return`<details class="esp ${e.co} s-${q.src}"${open?' open':''}><summary><span class="star" aria-hidden="true">★</span> Pregunta especial del docente · ${esc(e.n)} <b class="eb">${CON[e.co]}</b></summary><dl>${r('Respuesta Grupo_1',(e.g||'').replace(/^[A-D]\)\s*/,''))}${r('Examen original',e.x)}${r('Comprobación',e.c)}${r('¿Coincide?',e.ct)}${r('Dónde se consulta',(e.d||'')+(e.rf?' — '+e.rf:''))}${r('Nota de sesión',e.ns)}${r('Nivel (docente)',e.niv)}${r('Origen',e.o)}</dl></details>`};
