# Betru V14 — Type 1 + Type 2

## Organisation
- Toutes les sections historiques sont désormais nommées TYPE 1.
- Les sections TYPE 2 sont ajoutées sous les sections TYPE 1, sur la même page.
- Les coefficients, formules SIMEU, estimations d'itération et fonds de jeu restent identiques entre les types et utilisent la combinaison optimale propre à chaque type.

## Règles Type 1
Le moteur historique est conservé. Les anciennes règles R3 et R4 restent `C2*b+C3*c >= CAI` et `C2*b+C4*d >= CAI`.

## Règles Type 2
- `C1*a + C3*c + C4*d >= CAI*(1+p)`
- `C2*b + C3*c >= CAI*(1+p)`
- `C2*b + C4*d >= CAI*(1+p)`
- R5 à R10 restent inchangées.
- `Tmax Type 2 = max min(R2, R3, R4)`.
- `Pmax Type 2 = (Tmax Type 2 / CAI) - 1`.

## Formules conservées
- Nul : `(C1.a)+(C3.c)+(C4.d)`.
- Annulé et Nul : `(C1.a)+(1.c)+(1.d)`.

## Performance
Les deux moteurs de recherche des maxima utilisent une recherche O(CAI²) et restent dans `worker.js`. Le comptage exhaustif à p n'est affiché que pour CAI <= 180, pour protéger les téléphones moins puissants.


## Affichage des tableaux LIMITES
Les tableaux TYPE 1 et TYPE 2 ont désormais strictement les mêmes intitulés de colonnes et formules de résultats : Victoire favoris `(C2*b)+(C4*d)`, Victoire tocard `(C2*b)+(C3*c)`, Nul `(C1*a)+(C3*c)+(C4*d)`, Annulé et Nul `(C1*a)+(1*c)+(1*d)`. Seules les combinaisons optimales sélectionnées diffèrent entre les types.
