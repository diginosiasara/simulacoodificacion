/* Repositorio: convierte el modelo relacional de data/banco.js (BANCO) en el formato
   plano que consume el motor. Es la ÚNICA pieza que conoce la forma de los datos:
   si mañana el banco viene de una API o de SQL, solo se cambia este archivo. */
const Q=(()=>{
  const B=window.BANCO,tema=Object.fromEntries(B.temas.map(t=>[t.id,t])),
    ops={},sol=Object.fromEntries(B.soluciones_codigo.map(s=>[s.pregunta_id,s]));
  B.opciones.forEach(o=>(ops[o.pregunta_id]=ops[o.pregunta_id]||[]).push(o));
  return B.preguntas.filter(p=>p.estado==='publicada').map(p=>{
    const o=ops[p.id].sort((a,b)=>a.orden-b.orden),t=tema[p.tema_id],img=(p.media||[]).filter(m=>m.tipo==='imagen').map(m=>`<img class="qimg" alt="${m.alt}" src="${m.src}">`).join('');
    const q={src:t.fuente_id,tema:t.nombre,t:p.tipo,d:p.dificultad,q:p.enunciado+img,o:o.map(x=>x.texto),exp:p.explicacion,ref:p.referencia,id:p.id};
    const ok=o.map((x,i)=>x.es_correcta?i:-1).filter(i=>i>=0);
    p.tipo==='multi'?q.cs=ok:q.c=ok[0];
    if(p.pistas)q.h=p.pistas;
    const s=sol[p.id];if(s){q.dp=s.dp;q.ds=[...s.ds];if(s.alt_dp)q.al=s.alt_dp;if(s.alt_ds)q.als=s.alt_ds;if(s.patron_dp)q.rng=s.patron_dp}
    return q});
})();
