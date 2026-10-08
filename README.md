# Betru V11 — prototype Vercel

Version mono-page basée sur l'esquisse BETRU_GUIDE.docx et l'écran fourni comme référence visuelle.

## Déploiement
1. Décompresser.
2. Remplacer le contenu du dossier/repo GitHub Betru par ces fichiers.
3. Commit/push.
4. Vercel redéploie automatiquement.

## Important
Le moteur applique les règles du document, notamment R5/R6 et la règle `a,b,c,d >= max(Ci)+min(Ci)`.
Avec C1=2.87, C2=1.38, C3=1.91, C4=1.79, le minimum entier est 5.

Le texte d'exemple du document indique « A 5% : 31 solutions », mais l'application calcule dynamiquement les solutions à partir des formules. Avec les règles transcrites du document et C=100, p=5%, le moteur trouve 71 solutions. Le texte statique du document n'est donc pas utilisé comme résultat calculé.

Le prototype contient aussi les trois blocs SIMEU/SIME de la page 1-2, selon les formules présentes dans le document.

## Architecture V11.1
- `index.html` = interface mono-page.
- `worker.js` = moteur de calcul dans un Web Worker, afin d'éviter de bloquer l'interface.
- `config.json` = configuration centrale des coefficients, valeurs par défaut et règles.
- `sw.js` = cache PWA.
