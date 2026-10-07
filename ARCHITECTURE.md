# Architecture de livraison — Elise Learning

## Principe
La branche `main` représente uniquement la production. Toute nouveauté est développée sur une branche `feature/*` et validée avant fusion.

Flux cible :
1. Développement sur `feature/*`.
2. GitHub Actions exécute le QA moteur/catalogue.
3. Netlify génère un Deploy Preview de la pull request.
4. QA pré-production vérifie la Preview : accueil → cours → exercices → résultat → progression → accueil.
5. Fusion dans `main` uniquement après validation.
6. Netlify publie `main` en production.
7. QA post-production vérifie la version live.

## Contrat pédagogique
Après chaque vraie séance :
- score >= 80 % : décision pédagogique = chapitre suivant ;
- score < 80 % : même chapitre, nouvelle série d'exercices ;
- le mode Test reste isolé : 0 XP, aucun historique réel, aucune progression réelle.

Les agents professeurs anglais et mathématiques sont responsables de la conception/validation des banques et générateurs utilisés pour ces décisions. Le runtime ne dépend pas d'un appel IA externe : les règles validées sont intégrées au code afin que l'application reste disponible et déterministe.

## Garde-fous
- Une seule source de vérité pour le chapitre courant : catalogue + état de progression.
- Aucun titre pédagogique statique ne doit contredire cette source.
- Chaque hotfix doit être testable sur Preview avant production.
- Les assets runtime doivent éviter les caches persistants susceptibles de servir une ancienne version.
- Le QA doit distinguer tests du moteur, tests UI pré-production et smoke tests post-production.
