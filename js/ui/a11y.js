/* Accesibilidad y navegación móvil: pestañas ARIA con teclado, indicador de desplazamiento y avisos para lectores de pantalla */
(()=>{const tabs=document.querySelector('.tabs'),app=document.getElementById('app'),sr=document.getElementById('sr'),B=()=>[...tabs.querySelectorAll('button')],vis=()=>B().filter(b=>!b.hidden);
 tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label','Secciones de CodiSalud');app.setAttribute('role','tabpanel');app.tabIndex=-1;
 B().forEach(b=>{b.setAttribute('role','tab');b.id='tab-'+b.dataset.tab;b.setAttribute('aria-controls','app')});
 const edges=()=>{tabs.classList.toggle('has-l',tabs.scrollLeft>4);tabs.classList.toggle('has-r',tabs.scrollLeft+tabs.clientWidth<tabs.scrollWidth-4)};
 const center=b=>{const l=b.offsetLeft,r=l+b.offsetWidth,v0=tabs.scrollLeft,v1=v0+tabs.clientWidth;if(l>=v0+40&&r<=v1-40)return;let rm=false;try{rm=matchMedia('(prefers-reduced-motion:reduce)').matches}catch(_){}const x=Math.max(0,l-(tabs.clientWidth-b.offsetWidth)/2);if(tabs.scrollTo)tabs.scrollTo({left:x,behavior:rm?'auto':'smooth'});else tabs.scrollLeft=x};
 let last;
 window.a11ySync=()=>{B().forEach(b=>{const on=b.dataset.tab===tab;b.setAttribute('aria-selected',String(on));b.tabIndex=on?0:-1;if(on){app.setAttribute('aria-labelledby',b.id);if(!b.hidden)center(b);if(last!==undefined&&last!==tab&&sr)sr.textContent='Sección: '+b.textContent.trim()}});last=tab;edges()};
 tabs.addEventListener('scroll',edges,{passive:true});addEventListener('resize',edges);
 tabs.addEventListener('keydown',e=>{const v=vis(),i=v.indexOf(document.activeElement);if(i<0)return;let j=null;if(e.key==='ArrowRight')j=(i+1)%v.length;else if(e.key==='ArrowLeft')j=(i-1+v.length)%v.length;else if(e.key==='Home')j=0;else if(e.key==='End')j=v.length-1;if(j===null)return;e.preventDefault();v[j].focus();v[j].click()});
})();
