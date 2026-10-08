// Betru V13 — moteur O(C) pour Tmax/Pmax et solutions limites.
// Il n'effectue JAMAIS de boucle 4D. Le comptage exact est réservé à index.html
// pour les petits capitaux afin de protéger les appareils mobiles.
self.onmessage=({data})=>{
 try{
  const {v}=data,{C,c1,c2,c3,c4}=v;
  const mn=Math.ceil(Math.max(c1,c2,c3,c4)+Math.min(c1,c2,c3,c4)-1e-10);
  const minC=Math.min(c1,c2,c3,c4);
  let best=-Infinity,L=[];
  const bMax=Math.floor(C-3*mn);
  for(let b=mn;b<=bMax;b++){
   // Pour un b fixé, les contraintes R3/R4 imposent les plus petits c,d.
   // Comme C1 est le coefficient le plus élevé, on place tout le capital restant sur a.
   const c=Math.max(mn,Math.ceil((C-c2*b-1e-10)/c3));
   const d=Math.max(mn,Math.ceil((C-c2*b-1e-10)/c4));
   const a=Math.floor(C-b-c-d);
   if(a<mn)continue;
   if(c1*a-c3*c<minC-1e-9)continue;
   if(c1*a-c4*d<minC-1e-9)continue;
   const T=c1*a+c3*c+c4*d;
   const q={a,b,c,d,t:T,r2:T,r4:c2*b+c4*d};
   if(T>best+1e-9){best=T;L=[q]}else if(Math.abs(T-best)<1e-9)L.push(q);
  }
  postMessage({ok:true,tmax:best,limits:L,minInt:mn});
 }catch(e){postMessage({ok:false,error:e?.message||String(e)})}
};