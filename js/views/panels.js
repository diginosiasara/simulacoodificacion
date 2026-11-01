/* Paneles por rol: Gestor Maestro (Super usuario), Panel del profesor y Panel de datos y tiempo (Analítica).
   Cada panel vive en un iframe que conserva su estado al cambiar de pestaña y se descarga solo para quien tiene acceso. */
const PANEL={gm:{id:'gestor',t:'Gestor Maestro · solicitudes, usuarios y banco de preguntas',roles:['root']},pp:{id:'profesor',t:'Panel del profesor · seguimiento de avances',roles:['profesor','root']},pt:{id:'tiempo',t:'Panel de datos y tiempo · monitorización',roles:['analitica','root']}};
const canPanel=(k,u)=>PANEL[k].roles.includes((u||ME).rol);
const loadPanel=id=>new Promise((ok,ko)=>{if(window.PANELES&&PANELES[id])return ok(PANELES[id]);const s=document.createElement('script');s.src='js/panels/'+id+'.js';s.onload=()=>ok(PANELES[id]);s.onerror=ko;document.head.appendChild(s)});
const pmsg=(t,k='ok')=>{if(ME&&ME.rol==='profesor'&&k==='ok')return;const m=document.getElementById('pmsg');if(m){m.className='gm '+k;m.textContent=t}};
const plain=h=>String(h||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
/* Alumnos ACTIVOS (cuentas no desactivadas con rol Alumno o Invitado, más los progresos importados) en el formato que importa el Panel del profesor
   (registros + falladas). g se convierte a puntos sobre n porque el panel calcula la nota como g/n·10. */
function alumnosFiles(){const qk=Object.fromEntries(Q.map(q=>[q.k,q])),src=new Map();
 Object.entries(AU.IX()).forEach(([id,x])=>{if(!['usuario','invitado'].includes(x.rol))return;const u=id.startsWith('inv:')?null:AU.get(id);if(u&&u.disabled)return;src.set(id,{nombre:x.nombre||id.replace('inv:',''),rec:store.get(ukey(id)+'rec',[]),fail:store.get(ukey(id)+'fail',{})})});
 Object.entries(AU.SH()).forEach(([id,x])=>{if(x.imp&&!src.has(id))src.set(id,{nombre:x.nombre||id,rec:x.rec||[],fail:{}})});
 const cnt={};src.forEach(s=>cnt[s.nombre]=(cnt[s.nombre]||0)+1);const out=[];
 src.forEach((s,id)=>{if(!s.rec.length&&!Object.keys(s.fail).length)return;
  const registros=s.rec.map(r=>({g:+((+r.g||0)/10*(+r.n||10)).toFixed(2),secs:+r.secs||0,n:+r.n||10,key:r.key||r.mode||'Simulacro',ts:+r.ts||Date.now()})),falladas={};
  Object.entries(s.fail).forEach(([k,e])=>{const q=qk[k];if(q&&(e.f|0)>0)falladas[k]={pregunta:plain(q.q).slice(0,140),tema:q.tema,f:e.f|0,a:e.a|0}});
  out.push({id,name:(cnt[s.nombre]>1?s.nombre+' '+id.replace('inv:',''):s.nombre).replace(/[\\/:*?"<>|]/g,'_'),data:{registros,falladas}})});return out}
const toFile=(name,data)=>new File([JSON.stringify(data)],name+'.json',{type:'application/json'});
/* Entrega archivos al <input type=file> del panel como si el usuario los hubiera elegido. Devuelve false si no es posible. */
function inject(doc,pick,files){try{const inp=[...doc.querySelectorAll('input[type=file]')].find(pick);if(!inp||typeof DataTransfer==='undefined')return false;const dt=new DataTransfer();files.forEach(f=>dt.items.add(f));inp.files=dt.files;inp.dispatchEvent(new Event('change',{bubbles:true}));return true}catch(e){return false}}
async function toPanel(id,pick,files,okMsg){for(let i=0;i<40;i++){const fr=document.getElementById('pf-'+id);let d=null;try{d=fr&&fr.contentDocument}catch(e){}if(d&&d.querySelector('input[type=file]'))return pmsg(inject(d,pick,files)?okMsg:'No se pudo conectar con el panel desde este navegador: usa los botones de importar del propio panel.','err');await new Promise(r=>setTimeout(r,150))}pmsg('El panel aún no está listo.','err')}
const dl=(name,data)=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,1)],{type:'application/json'}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};
const TOOLS={pp:'<button class="b s" data-m="pp-refresh" type="button">Actualizar datos</button><button class="b g s" data-m="pp-imp" type="button">Importar progreso de un alumno</button><input type="file" id="pimp" accept=".json,application/json" hidden><button class="b g s" data-m="pp-dl" type="button">Descargar archivos</button>',gm:'<button class="b s" data-m="gm-bank" type="button">Cargar el banco de CodiSalud</button><button class="b s" data-m="gm-users" type="button">Cargar las cuentas</button>',pt:''};
const NOTE={pp:'Datos reales de los alumnos activos, cargados automáticamente. Los de otros dispositivos se incorporan con «Importar progreso de un alumno» (archivo compartido desde su cuenta).',gm:'Herramienta de gestión con datos en memoria: carga aquí el banco y las cuentas de CodiSalud, edítalos y exporta el resultado.',pt:'Panel autónomo con datos simulados: no muestra datos personales de usuarios.'};
const newFrame=P=>{const old=document.getElementById('pf-'+P.id);if(old)old.remove();const fr=document.createElement('iframe');fr.id='pf-'+P.id;fr.className='pframe';fr.title=P.t;document.getElementById('panels').appendChild(fr);return fr};
async function autoPanel(k){if(k!=='pp')return;const f=alumnosFiles(),i=document.getElementById('pinfo');if(i)i.textContent=f.length?`${f.length} alumno${f.length>1?'s':''} con datos · ${new Date().toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'})}`:'Aún no hay alumnos con progreso en este dispositivo.';
 if(f.length)await toPanel('profesor',x=>x.multiple,f.map(x=>toFile(x.name,x.data)),'Datos de los alumnos cargados en el panel.')}
function startPanel(k,fr){const P=PANEL[k];loadPanel(P.id).then(h=>{fr.srcdoc=h;autoPanel(k)}).catch(()=>pmsg('No se pudo cargar el panel.','err'))}
function panelView(k){const P=PANEL[k];if(!canPanel(k)){A.innerHTML='<div class="card"><p>No tienes acceso a este panel.</p></div>';return}
 A.innerHTML=ME.rol==='profesor'?'<p class="gm" id="pmsg"></p>':`<div class="card slim"><b>${P.t}</b>${k==='pp'?' <span class="note" id="pinfo"></span>':''}<p class="note">${NOTE[k]}</p>${TOOLS[k]?`<div class="row">${TOOLS[k]}</div>`:''}<p class="gm" id="pmsg"></p></div>`;
 let fr=document.getElementById('pf-'+P.id);if(!fr){fr=newFrame(P);startPanel(k,fr)}fr.hidden=false}
A.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(!b||!PANEL[tab])return;const m=b.dataset.m;
 if(m==='pp-refresh'){startPanel('pp',newFrame(PANEL.pp))}
 else if(m==='pp-imp')document.getElementById('pimp').click();
 else if(m==='pp-dl'){const f=alumnosFiles();if(!f.length)return pmsg('No hay progreso guardado en este dispositivo.','err');f.forEach((x,i)=>setTimeout(()=>dl(x.name+'.json',x.data),i*250))}
 else if(m==='gm-bank')toPanel('gestor',i=>i.accept==='.json',[toFile('banco-codisalud',Q.map(q=>{const r={...q};delete r.nd;return r}))],Q.length+' preguntas enviadas al Gestor.');
 else if(m==='gm-users')toPanel('gestor',i=>/csv/.test(i.accept),[toFile('cuentas-codisalud',{usuarios:AU.all().map(u=>({id:u.id,nombre:u.nombre,email:u.mask||'',rol:u.rol==='root'?'super':u.rol==='profesor'?'profesor':'alumno',centro:'CodiSalud'}))})],AU.all().length+' cuentas enviadas al Gestor.')});
A.addEventListener('change',e=>{if(tab!=='pp'||e.target.id!=='pimp')return;const f=e.target.files[0];e.target.value='';if(!f)return;f.text().then(t=>{try{importShared(t);startPanel('pp',newFrame(PANEL.pp))}catch(x){pmsg('El archivo no es un progreso compartido válido.','err')}})});
