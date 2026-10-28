/* Catálogo derivado: orden de DS, claves, fuentes, temas y colores */
const isM=c=>/^M?\d{4}\/\d/.test(String(c).replace(/\s/g,''));
Q.forEach(q=>{if(q.t==='code'){const d=q.ds.filter(c=>!isM(c)),m=q.ds.filter(isM);q.ds=[...d,...m];q.nd=d.length}});
const fmt=(dp,ds,nd,full)=>{const d=ds.slice(0,nd).filter(Boolean),m=ds.slice(nd).filter(Boolean);return(full||dp?'DP '+dp:'')+(d.length?' · DS '+d.join(' · '):'')+(m.length?' · Morfología '+m.join(' · '):'')};
const hs=t=>{let h=5381;t=String(t).replace(/<[^>]*>/g,'');for(let i=0;i<t.length;i++)h=(h*33^t.charCodeAt(i))>>>0;return h.toString(36)};Q.forEach(q=>q.k=hs(q.q));
Q.forEach(q=>{const n=x=>String(x).trim().toLowerCase().replace(/[.\s]+$/,'');if(q.t==='mc'&&q.o.length===2&&n(q.o[0])==='verdadero'&&n(q.o[1])==='falso')q.t='vf'});
const SRC=Object.fromEntries(BANCO.fuentes.map(f=>[f.id,f.titulo])),TEMAS=[...new Set(Q.map(q=>q.tema))],TS={};Q.forEach(q=>TS[q.tema]=q.src);
const SH=Object.fromEntries(BANCO.fuentes.map(f=>[f.id,f.hue])),TCS={};Object.keys(SRC).forEach(k=>{const ts=TEMAS.filter(t=>TS[t]===k),n=ts.length;ts.forEach((t,i)=>{const h=Math.round(SH[k]+(n>1?(i/(n-1)-.5)*36:0)+360)%360;TCS[t]=`--h:${h};--l:${[28,34,40][i%3]}%;--ld:${[80,74,68][i%3]}%`})});const NV=['Fácil','Medio','Difícil','Supremo'];
