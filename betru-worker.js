'use strict';

function ceilSafe(x){ return Math.ceil(x - 1e-10); }
function floorSafe(x){ return Math.floor(x + 1e-10); }
function add4(list,c,d,S){
  if(!Number.isFinite(c)||!Number.isFinite(d)) return;
  const c0=Math.floor(c), d0=Math.floor(d), c1=Math.ceil(c), d1=Math.ceil(d);
  if(c0>=1&&d0>=1&&c0+d0<=S-1) list.push([c0,d0]);
  if(c0>=1&&d1>=1&&c0+d1<=S-1) list.push([c0,d1]);
  if(c1>=1&&d0>=1&&c1+d0<=S-1) list.push([c1,d0]);
  if(c1>=1&&d1>=1&&c1+d1<=S-1) list.push([c1,d1]);
}
function pairLine(p1,q1,r1,p2,q2,r2){
  const det=p1*q2-p2*q1;
  if(Math.abs(det)<1e-12) return null;
  return [(r1*q2-r2*q1)/det,(p1*r2-p2*r1)/det];
}
function candidatePointsX12(C,b,X,O,R1,R2){
  const S=C-b, out=[];
  // Objective lines: AB, AD, BD.
  const AB=[R1-X,-X,O*b-X*S];
  const AD=[-X,R2-X,O*b-X*S];
  const BD=[R1,-R2,0];
  // Domain lines: c=1, d=1, a=1 (c+d=S-1).
  const C1=[1,0,1], D1=[0,1,1], A1=[1,1,S-1];
  const lines=[AB,AD,BD];
  const domains=[C1,D1,A1];
  for(let i=0;i<3;i++) for(let j=i+1;j<3;j++){const z=pairLine(...lines[i],...lines[j]);if(z)add4(out,z[0],z[1],S)}
  for(const l of lines) for(const d of domains){const z=pairLine(...l,...d);if(z)add4(out,z[0],z[1],S)}
  add4(out,1,1,S);add4(out,1,S-2,S);add4(out,S-2,1,S);
  return out;
}
function candidatePointsV1(C,b,V1,R1,V2,R2){
  const S=C-b,K=V1*S+R1*b,out=[];
  // Objective lines: AB, AD, BD.
  const AB=[V1,V1+R2,V1*S];
  const AD=[V1+V2,V1+R2,K];
  const BD=[1,0,R1*b/V2];
  const C1=[1,0,1], D1=[0,1,1], A1=[1,1,S-1];
  const lines=[AB,AD,BD], domains=[C1,D1,A1];
  for(let i=0;i<3;i++) for(let j=i+1;j<3;j++){const z=pairLine(...lines[i],...lines[j]);if(z)add4(out,z[0],z[1],S)}
  for(const l of lines) for(const d of domains){const z=pairLine(...l,...d);if(z)add4(out,z[0],z[1],S)}
  add4(out,1,1,S);add4(out,1,S-2,S);add4(out,S-2,1,S);
  return out;
}

function maxSolveV1(C,V1,R1,V2,R2,id){
  if(C<4) return {best:null,sols:[],count5:null};
  let best=-Infinity, sols=[];
  for(let b=1;b<=C-3;b++){
    const S=C-b;
    const K=V1*S+R1*b;
    const cand=candidatePointsV1(C,b,V1,R1,V2,R2);
    for(const [c,d] of cand){
      const a=C-b-c-d;
      if(a<1) continue;
      const A=V1*a+R1*b, B=R1*b+R2*d, D=V2*c+R2*d;
      const T=Math.min(A,B,D);
      if(T>best+1e-9){best=T;sols=[[a,b,c,d,A,B,D]]}
      else if(Math.abs(T-best)<=1e-9) sols.push([a,b,c,d,A,B,D]);
    }
    if(b%5000===0 || b===C-3) postMessage({type:'progress',id,percent:Math.min(99,Math.round(b/(C-3)*99))});
  }
  const map=new Map();
  for(const s of sols) map.set(s.slice(0,4).join(','),s);
  sols=[...map.values()].sort((p,q)=>p[0]-q[0]||p[1]-q[1]||p[2]-q[2]||p[3]-q[3]);
  return {best,sols,count5:C<=5000?count5V1(C,V1,R1,V2,R2,C*1.05):null};
}
function maxSolveX12(C,X,O,R1,R2,id){
  if(C<4) return {best:null,sols:[],count5:null};
  let best=-Infinity, sols=[];
  for(let b=1;b<=C-3;b++){
    const S=C-b;
    const cand=candidatePointsX12(C,b,X,O,R1,R2);
    for(const [c,d] of cand){
      const a=C-b-c-d;
      if(a<1) continue;
      const A=X*a+R1*c+R2*d, B=O*b+R2*d, D=O*b+R1*c;
      const T=Math.min(A,B,D);
      if(T>best+1e-9){best=T;sols=[[a,b,c,d,A,B,D]]}
      else if(Math.abs(T-best)<=1e-9) sols.push([a,b,c,d,A,B,D]);
    }
    if(b%5000===0 || b===C-3) postMessage({type:'progress',id,percent:Math.min(99,Math.round(b/(C-3)*99))});
  }
  const map=new Map();
  for(const s of sols) map.set(s.slice(0,4).join(','),s);
  sols=[...map.values()].sort((p,q)=>p[0]-q[0]||p[1]-q[1]||p[2]-q[2]||p[3]-q[3]);
  return {best,sols,count5:C<=5000?count5X12(C,X,O,R1,R2,C*1.05):null};
}
function count5V1(C,V1,R1,V2,R2,T){
  let count=0;
  for(let b=1;b<=C-3;b++){
    const minA=ceilSafe((T-R1*b)/V1);
    for(let d=1;d<=C-b-2;d++){
      const S=C-b-d;
      if(R1*b+R2*d<T) continue;
      const minC=ceilSafe((T-R2*d)/V2);
      const lo=Math.max(1,minA);
      const hi=Math.min(S-1,S-minC);
      if(hi>=lo) count+=hi-lo+1;
    }
  }
  return count;
}
function count5X12(C,X,O,R1,R2,T){
  let count=0;
  for(let b=1;b<=C-3;b++){
    for(let d=1;d<=C-b-2;d++){
      if(O*b+R2*d<T) continue;
      const S=C-b-d;
      const minC=ceilSafe((T-O*b)/R1);
      const maxC=floorSafe((X*S+R2*d-T)/(X-R1));
      const lo=Math.max(1,minC);
      const hi=Math.min(S-1,maxC);
      if(hi>=lo) count+=hi-lo+1;
    }
  }
  return count;
}

self.onmessage=function(e){
  const {id,model,C,o}=e.data;
  try{
    const [q1,q2,q3,q4]=o;
    if(!Number.isFinite(C)||C<4||o.some(x=>!Number.isFinite(x)||x<=0)){
      postMessage({type:'done',id,result:{best:null,sols:[],count5:null}});return;
    }
    const result=model===1?maxSolveV1(C,q1,q2,q3,q4,id):maxSolveX12(C,q1,q2,q3,q4,id);
    postMessage({type:'progress',id,percent:100});
    postMessage({type:'done',id,result});
  }catch(err){
    postMessage({type:'done',id,result:{error:'Le calcul a rencontré une erreur technique. Veuillez réessayer avec des valeurs raisonnables.'}});
  }
};
