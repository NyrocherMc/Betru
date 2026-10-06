let MODELS={};
function parseRule(s){
 const out=[0,0,0,0];
 const m=s.match(/([\d.]+)a(?:\s*\+\s*([\d.]+)b)?(?:\s*\+\s*([\d.]+)c)?(?:\s*\+\s*([\d.]+)d)?/);
 // fallback token parser, handles any term order
 if(m){ out[0]=+m[1]||0; if(m[2])out[1]=+m[2]; if(m[3])out[2]=+m[3]; if(m[4])out[3]=+m[4]; }
 const re=/([\d.]+)\s*([abcd])/g; let x;
 while((x=re.exec(s))){ const k='abcd'.indexOf(x[2]); out[k]=+x[1]; }
 return out;
}
function ceilPos(x){ return Math.max(1, Math.ceil(x-1e-10)); }
function build(model){ return (model.rules||[]).filter(r=>/>=/.test(r)).map(parseRule); }
function feasibleFixed(model,C,T,c,d){
 const R=build(model); let amin=1,bmin=1;
 for(const r of R){
   const fixed=r[2]*c+r[3]*d;
   if(r[1]===0 && r[0]>0) amin=Math.max(amin,ceilPos((T-fixed)/r[0]));
   if(r[0]===0 && r[1]>0) bmin=Math.max(bmin,ceilPos((T-fixed)/r[1]));
 }
 const coupled=R.filter(r=>r[0]>0&&r[1]>0);
 const maxA=C-c-d-1; if(maxA<amin)return null;
 if(!coupled.length){
   if(amin+bmin+c+d>C)return null;
   return R.every(r=>r[0]*amin+r[1]*bmin+r[2]*c+r[3]*d+1e-9>=T)?[amin,bmin,c,d]:null;
 }
 // Exact 2-variable solve for normal app-sized capitals. This fixes models whose source rules contain a+b terms.
 if(C<=250){
   let best=null;
   for(let a=amin;a<=maxA;a++){
     let b=bmin;
     for(const r of coupled){const rem=T-r[2]*c-r[3]*d-r[0]*a;if(rem>0)b=Math.max(b,ceilPos(rem/r[1]));}
     if(a+b+c+d>C)continue;
     if(R.every(r=>r[0]*a+r[1]*b+r[2]*c+r[3]*d+1e-9>=T)){if(!best||a+b<best[0]+best[1])best=[a,b,c,d];}
   }
   return best;
 }
 const candidates=new Set([amin]);
 for(const r of coupled){const rem=T-r[2]*c-r[3]*d;const a0=Math.floor((rem-r[1]*bmin)/r[0]);for(let z=a0-3;z<=a0+3;z++)if(z>=amin&&z<=maxA)candidates.add(z)}
 for(let z=amin;z<=Math.min(maxA,amin+20);z++)candidates.add(z);
 let best=null;
 for(const a of candidates){let b=bmin;for(const r of coupled){const rem=T-r[2]*c-r[3]*d-r[0]*a;if(rem>0)b=Math.max(b,ceilPos(rem/r[1]));}if(a+b+c+d>C)continue;if(R.every(r=>r[0]*a+r[1]*b+r[2]*c+r[3]*d+1e-9>=T)){if(!best||a+b<best[0]+best[1])best=[a,b,c,d]}}
 return best;
}
function exactAt(model,C,T,limit=2000000){
 // Enumerate c,d. For C<=2000 this is at most ~4M pairs.
 let count=0, sols=[];
 for(let c=1;c<=C-3;c++){
   for(let d=1;d<=C-c-2;d++){
     const q=feasibleFixed(model,C,T,c,d); if(q){sols.push(q); if(sols.length>=limit) return {sols,truncated:true};}
   }
 }
 return {sols,truncated:false};
}
function continuousGuess(model,C){
 const R=build(model); let best={T:-1,x:null};
 // A practical continuous relaxation: sample proportions using several candidates,
 // then locally improve by coordinate search. It is homogeneous and works well for large C.
 const candidates=[];
 for(let i=1;i<=30;i++){
   const f=i/30;
   candidates.push([C*f,C*f,C*(1-f)/2,C*(1-f)/2]);
 }
 candidates.push([C/4,C/4,C/4,C/4]);
 for(const x of candidates){
   let xx=x.slice();
   for(let it=0;it<80;it++){
     let bestT=Math.min(...R.map(r=>r[0]*xx[0]+r[1]*xx[1]+r[2]*xx[2]+r[3]*xx[3]));
     let changed=false;
     for(let v=0;v<4;v++){
       for(const dir of [-1,1]){
         const y=xx.slice(); const delta=C*0.01*dir; y[v]=Math.max(1,y[v]+delta);
         const sum=y.reduce((a,b)=>a+b,0); if(sum>C){y[v]-=sum-C; if(y[v]<1)continue;}
         const t=Math.min(...R.map(r=>r[0]*y[0]+r[1]*y[1]+r[2]*y[2]+r[3]*y[3]));
         if(t>bestT+1e-8){xx=y;bestT=t;changed=true;}
       }
     }
     if(!changed)break;
   }
   const t=Math.min(...R.map(r=>r[0]*xx[0]+r[1]*xx[1]+r[2]*xx[2]+r[3]*xx[3]));
   if(t>best.T)best={T:t,x:xx};
 }
 return best;
}
function solve(model,C,pct){
 C=Math.max(4,Math.floor(Number(C)||100)); pct=Number(pct)||5; const T=C*(1+pct/100);
 let at5;
 if(C<=1200){ at5=exactAt(model,C,T); }
 else { const g=continuousGuess(model,C); const c=Math.max(1,Math.round(g.x[2])); const d=Math.max(1,Math.round(g.x[3]));
   const sols=[]; const W=80;
   for(let cc=Math.max(1,c-W);cc<=Math.min(C-3,c+W);cc++) for(let dd=Math.max(1,d-W);dd<=Math.min(C-cc-2,d+W);dd++){const q=feasibleFixed(model,C,T,cc,dd);if(q)sols.push(q);}
   at5={sols,truncated:false,large:true};
 }
 // Max threshold. Exact binary search for moderate C; large C uses continuous guess + local integer neighborhood.
 let maxT, maxSols=[];
 if(C<=500){
   let lo=0,hi=C*5; // start high and grow
   hi=C*3; while(exactAt(model,C,hi,1).sols.length) hi*=1.5;
   for(let i=0;i<24;i++){const mid=(lo+hi)/2; const f=exactAt(model,C,mid,1).sols.length>0;if(f)lo=mid;else hi=mid;}
   // Recover all integer solutions at the true maximum from a threshold infinitesimally below the LP/integer boundary.
   const near=exactAt(model,C,Math.max(0,lo-1e-7),1000000); let best=-Infinity; const sols=[];
   for(const q of near.sols){const vals=build(model).map(r=>r[0]*q[0]+r[1]*q[1]+r[2]*q[2]+r[3]*q[3]);const t=Math.min(...vals);if(t>best+1e-9){best=t;sols.length=0;sols.push({q,vals});}else if(Math.abs(t-best)<1e-9)sols.push({q,vals});}
   maxT=best; maxSols=sols.map(z=>z.q);
 } else {
   const g=continuousGuess(model,C); maxT=g.T; const base=g.x.map(Math.round); let best=-1, sols=[]; const W=120;
   const cc0=Math.max(1,base[2]),dd0=Math.max(1,base[3]);
   for(let c=Math.max(1,cc0-W);c<=Math.min(C-3,cc0+W);c++)for(let d=Math.max(1,dd0-W);d<=Math.min(C-c-2,dd0+W);d++){const q=feasibleFixed(model,C,1,c,d); if(!q)continue; const vals=build(model).map(r=>r[0]*q[0]+r[1]*q[1]+r[2]*q[2]+r[3]*q[3]);const t=Math.min(...vals);if(t>best){best=t;sols=[q]}else if(Math.abs(t-best)<1e-9)sols.push(q)}
   maxT=best;maxSols=sols;
 }
 const leverage=(maxT/C-1)*100;
 return {capital:C,pct,threshold:T,solutions5:at5.sols,maxThreshold:maxT,maxLeverage:leverage,maxSolutions:maxSols,solutions5Truncated:!!at5.truncated,large:!!at5.large};
}
self.onmessage=e=>{const {type,model,capital,pct}=e.data;try{if(type==='solve')postMessage({type:'result',id:e.data.id,data:solve(model,capital,pct)});}catch(err){postMessage({type:'error',id:e.data.id,error:String(err)})}};
