# Betru V13 — basée sur BETRU_GUIDE_modif_001.docx

## Règles
C1 > C3 > C4 > C2
- C1*a + C3*c + C4*d >= CAI*(1+p)
- C2*b + C3*c >= CAI
- C2*b + C4*d >= CAI
- C1*a - C3*c >= min(Ci)
- C1*a - C4*d >= min(Ci)
- a+b+c+d <= CAI
- a,b,c,d >= max(Ci)+min(Ci)

## Performance
Le calcul Tmax/Pmax ne fait jamais de balayage 4D. Il utilise un moteur O(CAI) sur b dans worker.js.
Le comptage exhaustif des solutions à p est limité aux CAI <= 220 afin d'éviter les blocages sur téléphones peu puissants. Au-delà, l'application affiche clairement le mode gros capital sécurisé et fournit Tmax/Pmax/solutions limites.

## Interface
La structure suit le Word : CAPITAL INITIAL, PARAMETRES DU MATCH, LEVERAGE, LIMITES, REGLES LIMITES, SIMEU/SIME, ESTIMATION DE L'ITÉRATION et FOND DE JEU.
Les abréviations sont accompagnées d'infobulles.
