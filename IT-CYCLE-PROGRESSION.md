# IT — progression par cycles après achèvement du programme

**Statut : proposition d'architecture, non implémentée.**

Les 21 chapitres d'anglais et les 20 de mathématiques constituent chacun un cycle. Après réussite du dernier chapitre (mini-test >=80 %), recommencer au chapitre 1 de la même matière avec le cycle suivant, jusqu'à **5 cycles maximum** (`cycle` de 1 à 5). Chaque matière progresse indépendamment.

- Conserver les règles existantes : réussite >=80 % = chapitre suivant ; échec = même chapitre avec nouvelles questions ; 6 essais/jour/matière ou 3 chapitres distincts réussis ; Test qualité sans impact.
- Identifier une progression par `{subject,cycle,topicIndex}`, et non seulement `topicIndex % catalog.length`. Enregistrer `cycle` dans les séances, résultats et historique.
- Définir par chapitre des banques adaptées au palier 1 (couverture du programme) et paliers 2 à 5 (progression graduelle : raisonnement à plusieurs étapes, transfert, autonomie croissante), sans dépasser les prérequis scolaires ; éviter une simple augmentation des nombres.
- À la réussite du dernier chapitre du cycle 5, marquer la matière comme terminée, ne pas lancer de cycle 6 et envoyer un e-mail au parent via le mécanisme de notification existant ; empêcher les notifications en double (clé unique matière/cycle/achèvement).\n- Au changement de cycle, ne pas perdre les XP, les récompenses, l'historique ou les acquis. Migration des anciens profils : `cycle=1` par défaut ; ne jamais déduire un cycle du seul modulo de l'index.
- Comptage des 3 réussites distinctes : utiliser `subject:cycle:topicId` pour distinguer les réussites à différents paliers, sans compter deux fois un même chapitre dans le même cycle.
- Test qualité : utiliser un état temporaire de cycle, sans enregistrer ni changer les données réelles.
- Exposer « Cycle N/5 · Niveau adapté » dans la mission et le rapport parent.
- QA requis : 80 % au dernier chapitre des cycles 1 à 4 → cycle suivant chapitre 1 ; 79 % → maintien ; fin du cycle 5 → notification unique et état terminé ; anglais et maths indépendants ; redémarrage navigateur, cloud, reprise d'un ancien profil, limite quotidienne, Test qualité, absence de perte d'XP ; validation pédagogique des questions palier 2.

**Déploiement recommandé :** phase A audit/variété cycle 1, puis phase B cycles et nouveaux générateurs, chacune en branche avec E2E Chromium et revue QA avant fusion.
