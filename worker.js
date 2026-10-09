// Betru V14 — moteur double Type 1 / Type 2. Recherche O(CAI²), aucun balayage 4D.
const ceilEps=x=>Math.ceil(x-1e-10);
const floorEps=x=>Math.floor(x+1e-10);
function bounds(b,c,C,c1,c2,c3,c4,mn,minC){
  const rem=C-b-c;
  let hi=Math.min(C-b-c-mn,
    floorEps((c1*rem-c3*c-minC)/c1),
    floorEps((c1*rem-minC)/(c1+c4)),
    floorEps((c3*c-minC)/c4),
    Math.ceil(c3*c/c4-1e-10)-1);
  return {lo:mn,hi};
}
function type1(v){
 const {C,c1,c2,c3,c4}=v,mn=ceilEps(Math.max(c1,c2,c3,c4)+Math.min(c1,c2,c3,c4)),minC=Math.min(c1,c2,c3,c4);
 let best=-Infinity,limits=[];
 for(let b=mn;b<=C-3*mn;b++){
  const cMin=Math.max(mn,ceilEps((C-c2*b)/c3));
  for(let c=cMin;c<=C-b-2*mn;c++){
   const dMin=Math.max(mn,ceilEps((C-c2*b)/c4)),d=dMin;
   if(b+c+d>C-mn)continue;
   const a=Math.floor(C-b-c-d);if(a<mn)continue;
   if(c1*a-c3*c<minC-1e-9||c1*a-c4*d<minC-1e-9||c3*c-c4*d<minC-1e-9||!(c3*c>c4*d))continue;
   const T=c1*a+c3*c+c4*d,q={a,b,c,d,t:T};
   if(T>best+1e-9){best=T;limits=[q]}else if(Math.abs(T-best)<1e-9)limits.push(q);
  }
 }
 return {tmax:best,limits,minInt:mn};
}
function type2(v){
 const {C,c1,c2,c3,c4}=v,mn=ceilEps(Math.max(c1,c2,c3,c4)+Math.min(c1,c2,c3,c4)),minC=Math.min(c1,c2,c3,c4);
 let best=-Infinity;
 // For each b,c, the Type 2 objective is min(T1,T2,T3).
 // T1 decreases with d; T3 increases with d. Test the crossover and feasible endpoints.
 for(let b=mn;b<=C-3*mn;b++){
  for(let c=mn;c<=C-b-2*mn;c++){
   const B=bounds(b,c,C,c1,c2,c3,c4,mn,minC);if(B.hi<B.lo)continue;
   const T2=c2*b+c3*c;
   const cross=(c1*(C-b-c)+c3*c-c2*b)/c1;
   const candidates=new Set([B.lo,B.hi,Math.max(B.lo,Math.min(B.hi,Math.floor(cross))),Math.max(B.lo,Math.min(B.hi,Math.ceil(cross)))]);
   for(const d of candidates){
    const a=C-b-c-d;if(a<mn)continue;
    const t1=c1*a+c3*c+c4*d,t3=c2*b+c4*d,score=Math.min(t1,T2,t3);
    if(score>best+1e-9)best=score;
   }
  }
 }
 // Recover all integer tuples reaching the maximum common threshold.
 const limits=[];
 for(let b=mn;b<=C-3*mn;b++){
  for(let c=mn;c<=C-b-2*mn;c++){
   if(c2*b+c3*c<best-1e-8)continue;
   const rem=C-b-c;
   let lo=Math.max(mn,ceilEps((best-c2*b)/c4));
   let hi=Math.min(C-b-c-mn,
     floorEps((c1*rem-c3*c-minC)/c1),
     floorEps((c1*rem-minC)/(c1+c4)),
     floorEps((c3*c-minC)/c4),
     Math.ceil(c3*c/c4-1e-10)-1,
     floorEps((c1*rem+c3*c-best)/(c1-c4)));
   for(let d=lo;d<=hi;d++){
    const aMin=Math.max(mn,ceilEps((best-c3*c-c4*d)/c1),ceilEps((c3*c+minC)/c1),ceilEps((c4*d+minC)/c1));
    const aMax=C-b-c-d;
    for(let a=aMin;a<=aMax;a++){
     const t1=c1*a+c3*c+c4*d,t2=c2*b+c3*c,t3=c2*b+c4*d;
     if(Math.min(t1,t2,t3)>=best-1e-7)limits.push({a,b,c,d,t:Math.min(t1,t2,t3),t1,t2,t3});
    }
   }
  }
 }
 return {tmax:best,limits,minInt:mn};
}
self.onmessage=({data})=>{try{const v=data.v;const a=type1(v),b=type2(v);if(!a.limits.length||!b.limits.length||!Number.isFinite(a.tmax)||!Number.isFinite(b.tmax))throw new Error("Aucune solution admissible avec ces paramètres.");postMessage({ok:true,type1:a,type2:b})}catch(e){postMessage({ok:false,error:e&&e.message?e.message:String(e)})}};
