/* Utilidades puras: DOM, azar, normalización, formatos */
const $=s=>document.querySelector(s),A=$('#app');
const sh=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
const nz=s=>(s||'').toUpperCase().replace(/[\s.]/g,'');
const esc=s=>String(s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
const fmtT=t=>Math.floor(t/60)+':'+String(t%60).padStart(2,'0'),fd=t=>new Date(t).toLocaleString('es-ES',{day:'2-digit',month:'2-digit',year:'2-digit',hour:'2-digit',minute:'2-digit'}),avg=a=>a.reduce((x,y)=>x+y,0)/(a.length||1);
const txt=h=>{const t=String(h).replace(/<[^>]*>/g,'').trim();return t.length>95?t.slice(0,92)+'…':t};
