// Betru V14.1 — moteur corrigé et optimisé.
// Correction majeure : le moteur V14 initial imposait c et d minimaux
// indépendamment. Cela pouvait rejeter une solution valide lorsque
// l'augmentation de c était nécessaire pour satisfaire
// C3*c - C4*d >= min(Ci).
//
// Pour Tmax, on parcourt b,c et on prend le plus petit d admissible.
// Comme C1 > C3 > C4, le reliquat maximal est affecté à a.
// Cela donne une recherche O(CAI²), sans balayage 4D.

const ceilEps = x => Math.ceil(x - 1e-10);

self.onmessage = ({data}) => {
  try {
    const {C,c1,c2,c3,c4} = data.v;
    const mn = Math.ceil(Math.max(c1,c2,c3,c4)+Math.min(c1,c2,c3,c4)-1e-10);
    const minC = Math.min(c1,c2,c3,c4);

    let best = -Infinity;
    let limits = [];

    // b doit laisser au moins mn pour a,c,d.
    for (let b=mn; b<=C-3*mn; b++) {
      // R3: c >= (C-c2*b)/c3
      const cMinR3 = ceilEps((C-c2*b)/c3);

      for (let c=Math.max(mn,cMinR3); c<=C-b-2*mn; c++) {
        // R4: d >= (C-c2*b)/c4
        const dMinR4 = Math.max(mn,ceilEps((C-c2*b)/c4));
        const d = dMinR4;

        // Si le d minimal dépasse le capital restant, aucun d possible.
        if (b+c+d > C-mn) continue;

        const a = Math.floor(C-b-c-d);
        if (a < mn) continue;

        // R5/R6/R7/R8
        if (c1*a-c3*c < minC-1e-9) continue;
        if (c1*a-c4*d < minC-1e-9) continue;
        if (c3*c-c4*d < minC-1e-9) continue;
        if (!(c3*c > c4*d)) continue;

        const T = c1*a+c3*c+c4*d;
        const q={a,b,c,d,t:T};

        if (T > best+1e-9) {
          best=T;
          limits=[q];
        } else if (Math.abs(T-best)<1e-9) {
          limits.push(q);
        }
      }
    }

    postMessage({ok:true,tmax:best,limits,minInt:mn});
  } catch(e) {
    postMessage({ok:false,error:e&&e.message?e.message:String(e)});
  }
};