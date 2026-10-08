# Betru V14 — guide 002

Cette version reprend le document `BETRU_GUIDE_modif_002.docx`.

## Règles intégrées
1. C1 > C3 > C4 > C2
2. C1*a + C3*c + C4*d >= CAI*(1+pmax)
3. C2*b + C3*c >= CAI
4. C2*b + C4*d >= CAI
5. C1*a - C3*c >= min(Ci)
6. C1*a - C4*d >= min(Ci)
7. C3*c - C4*d >= min(Ci)
8. C3*c > C4*d
9. a,b,c,d >= max(Ci)+min(Ci)
10. a+b+c+d <= CAI

## Optimisation
Le moteur `worker.js` calcule Tmax/Pmax/limites avec un balayage O(CAI), jamais avec une boucle 4D.
Le comptage exhaustif des solutions à p est limité à CAI <= 220. Pour les gros capitaux, le comptage est désactivé afin de protéger les téléphones moins puissants, tandis que Tmax/Pmax/limites restent calculés.

## Interface
La page suit l'organisation du Word : capital initial, paramètres du match, leverage, limites, règles limites, SIMEU/SIME, estimation de l'itération et fond de jeu. Les abréviations sont accompagnées d'infobulles et la mise en page passe en une colonne sur mobile.
