# Revue QA indépendante V4 — première passe

Cette revue porte sur l'architecture et un modèle de contrat. Elle ne valide ni l'application ni la production. Aucun essai sur Firebase réel ou sur l'appareil d'Elise n'est réalisé.

## Critères bloquants

- Les six séances normales complètes OU les trois chapitres distincts réussis par matière et jour Europe/Brussels bloquent les nouveaux départs normaux. Abandon et mode qualité ne consomment pas ces limites.
- XP : dix par réponse correcte, cinquante supplémentaires si mini-test >= 80 %. Aucun plafond 400, aucune réduction 50 %, aucun troisième essai à zéro.
- Mode qualité isolé côté serveur : zéro impact XP, historique réel, progression, notifications et compteurs. Revenir à une mission normale doit créer une séance explicitement normale.
- Aide IA réelle autorisée pendant entraînement et bilan, refusée par le serveur pendant mini-test. Une aide inactive ne doit pas être présentée comme une IA active.
- Le serveur calcule score, XP et progression; le client ne peut pas imposer un score ni changer la phase.
- Un identifiant de séance et de finalisation idempotent empêche double XP et double notification.
- Authentification et rôle parent vérifiés côté serveur; un enfant ne peut ni accéder à un autre profil ni obtenir les droits parent.
- Migration conserve les dépenses et pénalités : pas de fusion par maximum de XP susceptible de ressusciter un solde dépensé. Migration unique et traçable.
- Dépenses, pénalités et gains utilisent un ledger et des opérations atomiques; limites vérifiées à l'intérieur de la transaction.
- Jour Brussels, minuit et DST explicités; règle sur séance commencée avant minuit et terminée après, sans crédit sur deux jours.
- Le modèle doit rejeter entrées non finies, scores incohérents, matière/mode/phase inconnus, identifiants manquants et finalisation incomplète.
- Les tests purs ne prouvent pas concurrence Firestore, droits réels, livraison de mails, existence du coach IA ou fonctionnement de l'interface. Ces validations restent obligatoires au stade application.

## Statut

Première passe : architecture à réviser, modèle non validé. Exécution indépendante `node --test v4-contract.test.mjs` : 12 tests, 10 réussis, 2 échoués.

## Retours à IT

1. Bloquant métier : l’inactivité documentée/modélisée à 20 % dès trois jours diverge du contrat confirmé par root : trois jours calendaires complets sans pénalité, puis 5 % par jour supplémentaire, maximum 20 % sur la base de la période. Révisions et tests attendus.
2. Modèle : `createSession` accepte un objet comme identifiant. Imposer une chaîne non vide, bornée et une clé non ambiguë.
3. Modèle : une clôture datée avant le début est acceptée. Persister des instants serveur et contrôler ordre chronologique; le jour seul ne suffit pas.
4. Conception : préciser l’abandon et la reprise d’une séance active. Une séance interrompue ne doit ni consommer un essai ni condamner l’élève à un verrou permanent.
5. Conception : le serveur doit autoriser le chapitre normal selon progression/prérequis; le modèle permet actuellement un chapitre arbitraire. Les sessions QA sont une projection éphémère distincte; invariance de l’état élève réel explicitée.
6. Conception : détailler débit de récompense, pénalité et crédits dans la transaction et le journal; interdire explicitement fusion par maximum XP à la migration, qui pourrait ressusciter un solde dépensé.

## Éléments conformes à cette passe

Six clôtures normales complètes ou trois réussites distinctes par matière et jour Brussels, XP plein à chaque essai, seuil 4/5, absence d’effet élève des séances QA, transition QA puis normale, clôture idempotente, exclusion d’une seconde séance active, aide refusée pendant test, minuit et dates DST : tests purs réussis.

## Limites de preuve

Le modèle reçoit des comptes supposés vérifiés côté serveur; cela ne teste pas correction réelle ni soumission complète de quinze réponses. Exclusion active et idempotence testées séquentiellement ne prouvent pas les transactions concurrentes Firestore. Auth/rôles, isolation des identifiants QA, migrations, dépenses réelles, notifications, fonctionnement du coach IA et interface exigent implémentation et préproduction. Le contrat `helpAllowed` ne prouve pas qu’un appel IA existe ou que son endpoint refuse une requête falsifiée.

## Revue finale après corrections IT

**Verdict : architecture acceptable pour préparer l'implémentation détaillée. Modèle de contrat contrôlé : 19 tests indépendants réussis sur 19. Application et production : non validées.**

Commande : `node --test v4-contract.test.mjs`. Dernière exécution après notification IT « fichiers stables » : 19 PASS, 0 FAIL.

Les six retours de première passe ont été traités : inactivité 5/10/15/20 % après 3 jours complets, identifiants bornés et clés de prototype refusées, instants chronologiques, abandon libérant la séance sans débit, notion normale autorisée selon progression, architecture des transactions de récompenses et interdiction de fusion maximum XP. Un défaut supplémentaire détecté pendant la révision (pénalité pouvant rendre le solde négatif après une dépense) est corrigé : débit effectif plafonné au disponible, différence non recouvrée journalisée et aucun recouvrement différé du même palier.

Les nouveaux tests couvrent aussi abandon, saut de chapitre interdit, identifiants et dates invalides, nouveau jour Brussels, maintien du verrou de séance active à minuit, et absence de dette différée. La fixture de dernière notion utilise explicitement une progression déjà déverrouillée; elle ne simule pas un saut autorisé.

La validation ne prouve toujours pas les transactions concurrentes ni les protections du backend : le modèle est pur et séquentiel. Les métadonnées de séance QA ajoutées au modèle sont éphémères; la projection de l'état élève réel (XP, compteurs, historique, maîtrise, progression, journal, activité) reste inchangée. Les tests de compteur supposent quinze réponses côté serveur; les tests applicatifs devront prouver leur présence, leur verrouillage et le calcul sans confiance dans les nombres fournis par le client.

Avant feu vert application : preuves préproduction des rôles et propriétaires, concurrence multiappareil et doubles clôtures, quotas atomiques, refus serveur du coach durant test, véritable endpoint IA et repli correctement libellé, migrations/récompenses, notifications dédupliquées, navigateur et validation pédagogique des 41 notions. Les règles figées par séance devront inclure le versionnement de la politique quotidienne appliquée par le backend.

Dernier garde IT contrôlé : une date normale antérieure à la dernière activité connue est rejetée. Nouvelle exécution sur cette révision : 19/19 PASS.

## Dernière revue des contrats API et du schéma

Après ajouts IT, revue indépendante des routes proposées et collections : conforme au périmètre architecture. Les accès Functions contrôlent jeton, propriétaire et lien parent; les droits administrateur sont séparés. Le projet QA conserve données fictives et secrets séparés, sans e-mail réel. Corrigés du mini-test physiquement séparés de la vue cliente; soumission sans corrigé avant clôture. Le contrat HTTP n'accepte ni nombre de réponses correctes ni XP client.

Deux précisions QA ont été intégrées : `practice-start` produit une seule notification de début à la transition théorie → entraînement; `test-start` exige les dix réponses initiales attendues et distinctes, puis `session-finish` exige exactement les dix plus cinq réponses aux questions persistées. Le modèle reste explicitement simplifié et ne prouve pas ces contrôles HTTP.

**Statut final inchangé : conception approuvée pour détailler et implémenter; 19/19 tests purs déjà réussis; aucun backend, schéma Firestore, migration ou déploiement livré par ces documents.** Le modèle n'ayant pas changé lors des ajouts de documentation, les tests n'ont pas été répétés inutilement.
