// Betru V14 — moteur optimisé.
// Objectif : ne jamais faire de balayage 4D.
// Pour chaque b, les contraintes R3/R4 donnent les plus petites c,d.
// Comme C1>C3>C4, augmenter c ou d au-delà de ce minimum réduit Tmax
// lorsqu'une unité est transférée depuis a. Le meilleur a est donc le reliquat maximal.
// La règle supplémentaire C3*c-C4*d >= min(Ci) est contrôlée avant évaluation.

self.onmessage=({data})=>{
try{
 const {C,c1,c2,c3,c4}=data.v;
 const mn=Math.ceil(Math.max(c1,c2,c3,c4)+Math.min(c1,c2,c3,c4)-1e-10);
 const minC=Math.min(c1,c2,c3,c4);
 let best=-Infinity,limits=[];
 const bMax=Math.floor(C-3*mn);
 for(let b=mn;b<=bMax;b++){
   const c=Math.max(mn,Math.ceil((C-c2*b-1e-10)/c3));
   const d=Math.max(mn,Math.ceil((C-c2*b-1e-10)/c4));
   const a=Math.floor(C-b-c-d);
   if(a<mn)continue;
   if(c1*a-c3*c<minC-1e-9)continue;
   if(c1*a-c4*d<minC-1e-9)continue;
   if(c3*c-c4*d<minC-1e-9)continue;
   if(!(c3*c>c4*d))continue;
   const T=c1*a+c3*c+c4*d;
   const q={a,b,c,d,t:T};
   if(T>best+1e-9){best=T;limits=[q]}
   else if(Math.abs(T-best)<1e-9)limits.push(q);
 }
 postMessage({ok:true,tmax:best,limits,minInt:mn});
}catch(e){postMessage({ok:false,error:e&&e.message?e.message:String(e)})}
};