self.onmessage=({data})=>{
try{const{v,p}=data,{C,c1,c2,c3,c4}=v,m=Math.ceil(Math.max(c1,c2,c3,c4)+Math.min(c1,c2,c3,c4)-1e-10);
if(!(c1>c3&&c3>c4&&c4>c2)){postMessage({ok:false,error:"Ordre des côtes invalide"});return}
let count=0,tmax=-Infinity,limits=[],N=Math.floor(C);
for(let a=m;a<=N-3*m;a++)for(let b=m;b<=N-a-2*m;b++){const B=c2*b;for(let c=m;c<=N-a-b-m;c++){const dmax=Math.floor(C-a-b-c),T=B+c3*c;if(dmax<m||T<C*(1+p)-1e-9)continue;
for(let d=m;d<=dmax;d++){if(c1*a>c+d+1e-9)continue;const r2=c1*a+c3*c+c4*d,r4=B+c4*d;
if(r2<C-1e-9||r4<C-1e-9)continue;
if(B+2*c3*c+c4*d<2*C-1e-9)continue;if(B+c3*c+2*c4*d<2*C-1e-9)continue;
count++;const q={a,b,c,d,t:T,r2,r4};if(T>tmax+1e-9){tmax=T;limits=[q]}else if(Math.abs(T-tmax)<1e-9)limits.push(q)}}}
postMessage({ok:true,count,tmax,limits,minInt:m})}catch(e){postMessage({ok:false,error:e.message||String(e)})}};