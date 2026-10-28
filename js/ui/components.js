/* Fragmentos de HTML reutilizables (etiquetas, chips) */
const lv=q=>{const l=lvl(q);return`<span class="lv" title="Dificultad actual: sube con tus fallos y respuestas en blanco y baja con tus aciertos"><i>${'●'.repeat(l)}${'○'.repeat(4-l)}</i>${NV[l-1]}</span>`},ty=q=>q.t==='code'?'<span class="ty" title="Práctica de desarrollo: se escriben DP y DS">Práctica</span>':'<span class="ty" title="Pregunta teórica: tipo test o selección múltiple">Teórica</span>';
const sb=s=>`<span class="sb s-${s}">${SRC[s]}</span>`,tp=t=>`<span class="tp tm" style="${TCS[t]}">${t}</span>`;
const chip=(on,a,v,t,x='',st='')=>`<button class="chip ${on?'on':''} ${x}" style="${st}" data-a="${a}" data-v="${v}">${t}</button>`;
