/* Panel de conocimiento: consulta y búsqueda de glosarios, claves, guía básica, apuntes de clase, enlaces e índices de los manuales.
   Los datos (data/conocimiento.js) se cargan solo al abrir la pestaña. */
const KB={d:null,q:'',src:'',tipo:'',n:20,rows:[]};
const KLAB={examen:'Examen',guia:'Guía básica',apunte:'Apuntes',glosario:'Glosario',vocabulario:'Glosario',clave:'Clave',importante:'Importante',curiosidad:'Curiosidad',enlace:'Enlace',indice:'Índice'};
const KSHORT={UF1:'UF1 · Introducción',UF2:'UF2 · Infecciosas',UF3:'UF3 · Neoplasias',UF4:'UF4 · Otras patologías',UF5:'UF5 · Circulatorio',UF6:'UF6 · Respiratorio',UF7:'UF7 · Digestivo',UF8:'UF8 · Embarazo y parto',S12:'Apuntes de sesiones 1-2',S34:'Apuntes de sesiones 3-4',GUIA:'Guía básica'};
const KGROUP={examen:['examen'],guia:['guia'],glosario:['glosario','vocabulario'],clave:['clave','importante','curiosidad'],apunte:['apunte'],enlace:['enlace'],indice:['indice']};
const KTIPOS=[['','Todo (sin índices)'],['examen','Qué se pide en el examen'],['guia','Guía básica'],['glosario','Glosario'],['clave','Claves, avisos y curiosidades'],['apunte','Apuntes de clase'],['enlace','Enlaces y vídeos'],['indice','Índices de los manuales']];
const KPRAC={UF1:['U1'],UF2:['U2'],UF3:['U3','S3'],UF4:['S4']};
const kn=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const loadKB=()=>new Promise((ok,ko)=>{if(window.CONOCIMIENTO)return ok(window.CONOCIMIENTO);const s=document.createElement('script');s.src='data/conocimiento.js';s.onload=()=>ok(window.CONOCIMIENTO);s.onerror=ko;document.head.appendChild(s)});
const kterms=()=>kn(KB.q).split(/\s+/).filter(Boolean);
function kfilter(){const T=kterms(),g=KGROUP[KB.tipo];
 let r=KB.d.items.filter(i=>(!KB.src||i.manual_id===KB.src)&&(g?g.includes(i.tipo):i.tipo!=='indice')&&T.every(t=>i._n.includes(t)));
 if(T.length)r=r.map(i=>({i,s:(T.every(t=>i._t.includes(t))?2:0)+(i._t.startsWith(T[0])?1:0)})).sort((a,b)=>b.s-a.s||a.i.id-b.i.id).map(x=>x.i);
 return r}
/* Resalta los términos buscados (la versión sin tildes tiene la misma longitud que el texto original) */
function hl(s){s=String(s||'');const T=kterms();if(!T.length)return esc(s);const n=kn(s),R=[];T.forEach(t=>{for(let p=n.indexOf(t);p>=0;p=n.indexOf(t,p+t.length))R.push([p,p+t.length])});if(!R.length)return esc(s);
 R.sort((a,b)=>a[0]-b[0]);const M=[];R.forEach(r=>{const l=M[M.length-1];l&&r[0]<=l[1]?l[1]=Math.max(l[1],r[1]):M.push([...r])});let o='',c=0;M.forEach(([a,b])=>{o+=esc(s.slice(c,a))+'<mark>'+esc(s.slice(a,b))+'</mark>';c=b});return o+esc(s.slice(c))}
const kref=i=>{const p=i.pagina?' · pág. '+i.pagina:'',s0=(i.seccion||'').split(' › ').pop(),sc=s0?' · '+(s0.length>64?s0.slice(0,64).replace(/\s+\S*$/,'')+'…':s0):'';
 return i.manual_id==='GUIA'?'Guía básica'+sc+p:/^UF/.test(i.manual_id)?'Manual '+i.manual_id+sc+p:'Apuntes de clase'+(i.uf?' · '+i.uf:'')};
function kcard(i){const long=i.texto.length>380,id='kt'+i.id,pr=KPRAC[i.uf]&&!['indice','enlace','guia'].includes(i.tipo)?`<button class="b g s" type="button" data-kb="prac" data-uf="${i.uf}">Practicar ${i.uf}</button>`:'';
 return`<li class="kc"><article aria-labelledby="kh${i.id}"><div class="kh"><span class="kb k-${i.tipo}">${KLAB[i.tipo]}</span><span class="kr">${esc(kref(i))}</span></div><h3 id="kh${i.id}" tabindex="-1">${hl(i.titulo)}</h3>${i.texto?`<div class="kt${long?' clamp':''}" id="${id}">${hl(i.texto)}</div>`:''}${long||i.url||pr?`<div class="row">${long?`<button class="b g s" type="button" data-kb="more" data-id="${i.id}" aria-expanded="false" aria-controls="${id}">Leer más</button>`:''}${i.url?`<a class="b g s" href="${esc(i.url)}" target="_blank" rel="noopener noreferrer">Abrir enlace<span class="sr-only"> (se abre en otra pestaña)</span></a>`:''}${pr}</div>`:''}</article></li>`}
function krender(focusFrom){KB.rows=kfilter();const r=KB.rows,box=document.getElementById('kres');if(!box)return;box.innerHTML=r.slice(0,KB.n).map(kcard).join('');
 document.getElementById('kcount').textContent=r.length?`${r.length} resultado${r.length>1?'s':''}${KB.q.trim()?' para «'+KB.q.trim()+'»':''}`:'Sin resultados. Prueba con otra palabra (por ejemplo «neoplasia», «Excluye1» o «diagnóstico principal») o cambia los filtros.';
 document.getElementById('kmore').innerHTML=r.length>KB.n?`<button class="b g" type="button" data-kb="moreres">Mostrar más (${r.length-KB.n} restantes)</button>`:'';
 if(focusFrom!=null){const h=box.children[focusFrom]&&box.children[focusFrom].querySelector('h3');if(h)h.focus()}}
function knowView(){const opt=(v,l,s)=>`<option value="${esc(v)}"${s===v?' selected':''}>${esc(l)}</option>`;
 A.innerHTML=`<div class="card"><h2>Conocimiento</h2><p class="note" id="kintro">Cargando…</p><form role="search" id="kform" novalidate><label class="fl" for="kq">Buscar en el conocimiento<input id="kq" type="search" value="${esc(KB.q)}" autocomplete="off" enterkeyhint="search" placeholder="Ej.: excluye1, neoplasia, diagnóstico principal"></label>
 <div class="kfil"><label class="fl" for="ksrc">Fuente<select id="ksrc"><option value="">Todas las fuentes</option>${Object.entries(KSHORT).map(([k,v])=>opt(k,v,KB.src)).join('')}</select></label><label class="fl" for="ktipo">Tipo de ficha<select id="ktipo">${KTIPOS.map(([k,v])=>opt(k,v,KB.tipo)).join('')}</select></label></div>${KB.q?'<button class="b g s" type="button" data-kb="clear">Borrar búsqueda</button>':''}</form><p class="note" id="kcount" role="status" aria-live="polite"></p></div><ul class="kl" id="kres"></ul><div id="kmore"></div>`;
 loadKB().then(d=>{if(!d._ok){d.items.forEach(i=>{i._t=kn(i.titulo);i._n=i._t+' '+kn(i.texto)+' '+kn(i.seccion);});d._ok=1}KB.d=d;if(tab!=='kb')return;const ni=d.items.filter(i=>i.tipo!=='indice').length;document.getElementById('kintro').textContent=`${ni} fichas de glosario, claves, guía, apuntes y enlaces de ${d.manuales.filter(m=>m.tipo==='manual').length} manuales, con su página de origen.`;krender()}).catch(()=>{const p=document.getElementById('kintro');if(p)p.textContent='No se pudo cargar el panel de conocimiento. Comprueba la conexión e inténtalo de nuevo.'})}
let ktimer;
A.addEventListener('input',e=>{if(tab!=='kb'||e.target.id!=='kq')return;clearTimeout(ktimer);ktimer=setTimeout(()=>{KB.q=e.target.value;KB.n=20;if(KB.d)krender();const f=document.getElementById('kform'),b=f.querySelector('[data-kb=clear]');if(KB.q&&!b){const x=document.createElement('button');x.className='b g s';x.type='button';x.dataset.kb='clear';x.textContent='Borrar búsqueda';f.appendChild(x)}else if(!KB.q&&b)b.remove()},140)});
A.addEventListener('change',e=>{if(tab!=='kb'||!KB.d)return;if(e.target.id==='ksrc'){KB.src=e.target.value;KB.n=20;krender()}else if(e.target.id==='ktipo'){KB.tipo=e.target.value;KB.n=20;krender()}});
A.addEventListener('submit',e=>{if(tab==='kb')e.preventDefault()});
A.addEventListener('click',e=>{const b=e.target.closest('[data-kb]');if(!b||tab!=='kb')return;const m=b.dataset.kb;
 if(m==='more'){const t=document.getElementById('kt'+b.dataset.id),open=b.getAttribute('aria-expanded')!=='true';t.classList.toggle('open',open);b.setAttribute('aria-expanded',String(open));b.textContent=open?'Leer menos':'Leer más'}
 else if(m==='moreres'){const from=KB.n;KB.n+=20;krender(from)}
 else if(m==='clear'){KB.q='';KB.n=20;const q=document.getElementById('kq');q.value='';b.remove();krender();q.focus()}
 else if(m==='prac'){const s=KPRAC[b.dataset.uf];cfg.fallas=false;cfg.temas=new Set(TEMAS.filter(t=>s.includes(TS[t])));if(!cfg.temas.size)cfg.temas=new Set(TEMAS);tab='sim';show();window.scrollTo(0,0)}});
