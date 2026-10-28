/* Persistencia local (localStorage): intentos y preguntas falladas */
const store={get(k,d){try{return JSON.parse(localStorage.getItem(k))||d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const DB={rec:store.get('sim_rec',[]),fail:store.get('sim_fail',{})},save=()=>{store.set('sim_rec',DB.rec.slice(-500));store.set('sim_fail',DB.fail)};
