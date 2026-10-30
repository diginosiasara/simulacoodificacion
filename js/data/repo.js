/* Repositorio: convierte el modelo relacional de data/banco.js (BANCO) en el formato
   plano que consume el motor. Es la ÚNICA pieza que conoce la forma de los datos:
   si mañana el banco viene de una API o de SQL, solo se cambia este archivo. */
const Q=(()=>{
  const B=window.BANCO,tema=Object.fromEntries(B.temas.map(t=>[t.id,t])),ops={},par={},refs={},
    sol=Object.fromEntries(B.soluciones_codigo.map(s=>[s.pregunta_id,s])),
    grp=(m,k,r)=>(m[k]=m[k]||[]).push(r);
  B.opciones.forEach(o=>grp(ops,o.pregunta_id,o));(B.pares_relacion||[]).forEach(r=>grp(par,r.pregunta_id,r));(B.referencias||[]).forEach(r=>grp(refs,r.pregunta_id,r));
  const rf=p=>[(refs[p.id]||[]).sort((a,b)=>a.orden-b.orden).map(r=>`📖 Manual ${r.manual_id} · ${r.seccion} · ${r.pagina_fin?'págs. '+r.pagina+'-'+r.pagina_fin:'pág. '+r.pagina}`).join(' | '),p.referencia].filter(Boolean).join(' — ');
  return B.preguntas.filter(p=>p.estado==='publicada').map(p=>{
    const t=tema[p.tema_id],base={src:t.fuente_id,tema:t.nombre,t:p.tipo,d:p.dificultad,exp:p.explicacion,ref:rf(p),id:p.id};
    if(p.pistas&&p.pistas.length)base.h=p.pistas;
    if(p.tipo==='match'){const ps=(par[p.id]||[]).sort((a,b)=>a.orden-b.orden),L=ps.filter(x=>x.izquierda!=null);
      return{...base,q:p.enunciado,o:[],L:L.map(x=>x.izquierda),Rt:L.map(x=>x.derecha),X:ps.filter(x=>x.izquierda==null).map(x=>x.derecha)}}
    const o=(ops[p.id]||[]).sort((a,b)=>a.orden-b.orden),img=(p.media||[]).filter(m=>m.tipo==='imagen').map(m=>`<img class="qimg" alt="${m.alt}" src="${m.src}">`).join('');
    const q={...base,q:p.enunciado+img,o:o.map(x=>x.texto)},ok=o.map((x,i)=>x.es_correcta?i:-1).filter(i=>i>=0);
    p.tipo==='multi'?q.cs=ok:q.c=ok[0];
    const s=sol[p.id];if(s){q.dp=s.dp;q.ds=[...s.ds];if(s.alt_dp)q.al=s.alt_dp;if(s.alt_ds)q.als=s.alt_ds;if(s.patron_dp)q.rng=s.patron_dp}
    return q});
})();
