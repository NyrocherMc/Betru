// Betru — moteur de calcul isolé du thread d'interface
self.onmessage = ({data}) => {
  try {
    const {v,p} = data;
    const {C,c1,c2,c3,c4}=v;
    const minInt=Math.ceil(Math.max(c1,c2,c3,c4)+Math.min(c1,c2,c3,c4)-1e-10);
    if (!(c1>c3 && c3>c4 && c4>c2)) {
      postMessage({ok:false,error:"Ordre des côtes invalide : C1 > C3 > C4 > C2."}); return;
    }
    const maxN=Math.floor(C);
    let count=0, tmax=-Infinity;
    const limits=[];
    // Bornes réduites : R1 dépend seulement de b,c.
    // R5/R6 sont réécrites sous forme linéaire pour accélérer le filtrage.
    for(let a=minInt;a<=maxN-3*minInt;a++){
      for(let b=minInt;b<=maxN-a-2*minInt;b++){
        const bTerm=c2*b;
        for(let c=minInt;c<=maxN-a-b-minInt;c++){
          const dMax=Math.floor(C-a-b-c);
          if(dMax<minInt) continue;
          const r1base=bTerm+c3*c;
          if(r1base < C*(1+p)-1e-9) continue;
          const c4c3=c3*c;
          const needR5 = 2*C - c4c3 - bTerm;
          const needR6 = 2*C - bTerm - c3*c;
          // R5: b*C2 + 3.82*c + d*C4 >= 200
          // R6: b*C2 + c*C3 + 3.58*d >= 200
          for(let d=minInt;d<=dMax;d++){
            if(c1*a > c+d+1e-9) continue;
            if(c1*a+c4c3+c4*d < C-1e-9) continue;
            if(bTerm+c4*d < C-1e-9) continue;
            if(bTerm+3.82*c+c4*d < 2*C-1e-9) continue;
            if(bTerm+c3*c+3.58*d < 2*C-1e-9) continue;
            count++;
            const t=r1base;
            if(t>tmax+1e-9){tmax=t; limits.length=0; limits.push({a,b,c,d,t,r2:c1*a+c3*c+c4*d,r4:bTerm+c4*d});}
            else if(Math.abs(t-tmax)<1e-9){limits.push({a,b,c,d,t,r2:c1*a+c3*c+c4*d,r4:bTerm+c4*d});}
          }
        }
      }
      if(a%5===0) postMessage({type:"progress",value:Math.min(99,Math.round(a/maxN*100))});
    }
    postMessage({ok:true,count,tmax,limits,minInt});
  } catch(e){ postMessage({ok:false,error:e?.message||String(e)}); }
};
