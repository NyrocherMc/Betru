// Betru — moteur mathématique isolé dans un Web Worker
self.onmessage=({data})=>{
 try{
  const {v,p}=data,{C,c1,c2,c3,c4}=v;
  const minInt=Math.ceil(Math.max(c1,c2,c3,c4)+Math.min(c1,c2,c3,c4)-1e-10);
  if(!(c1>c3&&c3>c4&&c4>c2)){postMessage({ok:false,error:"Ordre des côtes invalide : C1 > C3 > C4 > C2."});return}
  const maxN=Math.floor(C);let count=0,tmax=-Infinity,limits=[];
  for(let a=minInt;a<=maxN-3*minInt;a++){
   for(let b=minInt;b<=maxN-a-2*minInt;b++){
    const B=c2*b;
    for(let c=minInt;c<=maxN-a-b-minInt;c++){
     const dMax=Math.floor(C-a-b-c),T=B+c3*c;
     if(dMax<minInt||T<C*(1+p)-1e-9)continue;
     for(let d=minInt;d<=dMax;d++){
      if(c1*a>c+d+1e-9)continue;
      const R2=c1*a+c3*c+c4*d,R4=B+c4*d;
      if(R2<C-1e-9||R4<C-1e-9)continue;
      // R5: ((C2b+C3c)-C) >= (C-(C3c+C4d))
      if(B+2*c3*c+c4*d<2*C-1e-9)continue;
      // R6: ((C2b+C4d)-C) >= (C-(C3c+C4d))
      if(B+c3*c+2*c4*d<2*C-1e-9)continue;
      count++;
      const item={a,b,c,d,t:T,r2:R2,r4:R4};
      if(T>tmax+1e-9){tmax=T;limits=[item]}else if(Math.abs(T-tmax)<1e-9)limits.push(item);
     }
    }
   }
   if(a%3===0)postMessage({type:"progress",value:Math.min(99,Math.round(a/maxN*100))});
  }
  postMessage({ok:true,count,tmax,limits,minInt});
 }catch(e){postMessage({ok:false,error:e?.message||String(e)})}
};