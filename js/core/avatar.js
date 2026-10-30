/* Foto de perfil: se recorta en cuadrado y se reduce sin pedir nada al usuario.
   Lado final entre 100 y 300 px (reduce lo grande, amplía lo diminuto) y formato ligero (WebP/JPEG). No hay límite de tamaño de entrada. */
const avatarSide=(w,h)=>Math.max(100,Math.min(300,Math.min(w,h)));
async function resizeAvatar(file){
 const bmp=window.createImageBitmap?await createImageBitmap(file):await new Promise((ok,ko)=>{const i=new Image(),u=URL.createObjectURL(file);i.onload=()=>{URL.revokeObjectURL(u);ok(i)};i.onerror=ko;i.src=u});
 const w=bmp.width,h=bmp.height,s=Math.min(w,h),side=avatarSide(w,h),c=document.createElement('canvas');c.width=c.height=side;
 const x=c.getContext('2d');x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';x.fillStyle='#fff';x.fillRect(0,0,side,side);x.drawImage(bmp,(w-s)/2,(h-s)/2,s,s,0,0,side,side);if(bmp.close)bmp.close();
 let out='';for(const q of[.82,.66,.5]){out=c.toDataURL('image/webp',q);if(!out.startsWith('data:image/webp')){out=c.toDataURL('image/jpeg',q);}if(out.length<26000)break}
 return out}
