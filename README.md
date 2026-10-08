# Betru V14.1 — correction du moteur

## Correction
La V14 initiale calculait c et d minimaux séparément pour chaque b. Cette méthode était incorrecte : une solution peut nécessiter d'augmenter c afin de satisfaire simultanément R7 et R8.

Avec CAI=100, C1=2.87, C2=1.38, C3=1.91, C4=1.79, p=5%, les 4 solutions exactes sont :
- (14,48,19,19)
- (14,50,18,18)
- (15,51,17,17)
- (16,52,16,16)

La solution limite unique est (14,48,19,19), avec Tmax=110.48 et Pmax=10.48%.

## Optimisation
Le calcul de la limite est O(CAI²) et reste dans le Web Worker.
Le comptage exact ne parcourt plus d : il calcule directement l'intervalle entier admissible de d, ce qui réduit fortement le travail.
