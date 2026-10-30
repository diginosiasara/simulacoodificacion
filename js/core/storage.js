/* Persistencia local (localStorage): intentos y preguntas falladas */
const store={get(k,d){try{return JSON.parse(localStorage.getItem(k))||d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
let CUR=null,DB={rec:[],fail:{}};const ukey=id=>'cs:'+id+':';
/* Progreso por usuario. El progreso anterior a las cuentas (sim_rec/sim_fail) no se asigna solo a nadie: cada persona lo reclama desde Mi cuenta. */
function loadDB(id){CUR=id;DB={rec:store.get(ukey(id)+'rec',[]),fail:store.get(ukey(id)+'fail',{})}}
const legacyDB=()=>{try{return localStorage.getItem('cs:migrated')!=='1'&&(localStorage.getItem('sim_rec')||localStorage.getItem('sim_fail'))?{rec:store.get('sim_rec',[]),fail:store.get('sim_fail',{})}:null}catch(e){return null}};
const save=()=>{if(!CUR)return;store.set(ukey(CUR)+'rec',DB.rec.slice(-500));store.set(ukey(CUR)+'fail',DB.fail);if(typeof shareSync==='function')shareSync()};
