/* Estado de la configuración/sesión y selección de preguntas */
let cfg={n:15,mode:'examen',tipos:new Set(['mc','multi','vf','code']),nivel:'mix',fallas:false,temas:new Set(TEMAS)},S=null,tab='sim';
const TIPOS={mc:'Selección una correcta',multi:'Selección múltiple',vf:'Verdadero / Falso',code:'Codificación'},tipoOk=q=>cfg.tipos.has(q.t);
const FL=()=>Q.filter(q=>(DB.fail[q.k]||{}).f>0&&tipoOk(q)),pick=()=>{if(cfg.fallas)return sh(FL()).sort((a,b)=>DB.fail[b.k].f-DB.fail[a.k].f);const c=sh(Q.filter(inc));return cfg.n&&cfg.nivel!=='mix'?c.sort((a,b)=>Math.abs(eff(a)-cfg.nivel)-Math.abs(eff(b)-cfg.nivel)):c};
const cdesc=()=>{let d;if(cfg.fallas)d='Más falladas';else{const t=[...cfg.temas];if(t.length===TEMAS.length)d='Todos los temas';else{const o=[...new Set(t.map(x=>TS[x]))];d=o.length===1&&t.length===TEMAS.filter(x=>TS[x]===o[0]).length?'Solo '+SRC[o[0]]:t.length+' temas'}}return d+(cfg.tipos.size<4?' · '+[...cfg.tipos].map(x=>TIPOS[x].toLowerCase()).join(' + '):'')+(cfg.n&&!cfg.fallas&&cfg.nivel!=='mix'?' · nivel '+NV[cfg.nivel-1]:'')};
const inc=q=>cfg.temas.has(q.tema)&&tipoOk(q);
