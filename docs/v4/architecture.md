# Architecture V4 — proposition IT à valider par QA

Statut : conception et modèle de contrat local. Aucun changement du dépôt, des données réelles ou de la production. Le modèle joint illustre les règles ; il n’est pas un service déployé ni une preuve d’intégration Firebase.

## Périmètre et continuité

Refonte ciblée de V3.2.2, en conservant les composants et contenus valides. Le cadre existant reste : `main` en production, branches `feature/*`, Actions et Deploy Preview, revue QA avant fusion, puis contrôle en production. Les professeurs conçoivent et valident les contenus ; leur intervention ne nécessite pas un appel IA à chaque génération d’exercice. Les 41 notions (20 maths, 21 anglais) ont chacune cinq familles pédagogiques adaptées, et non cinq formats artificiels imposés à chaque séance.

Avant implémentation : vérifier que le commit de référence est bien `27d41ed`, créer une référence Git immuable, exporter les données Firebase et documenter leur restauration. Le code sauvegardé n’inclut ni secrets ni copie publique de données élèves. Les données locales disponibles seront exportées séparément avec leur provenance. Une sauvegarde n’est déclarée utilisable qu’après vérification d’une restauration sur environnement isolé.

## Règles finales

| Sujet | Contrat |
|---|---|
| Séance | Théorie, 10 questions d’entraînement, mini-test de 5 questions, bilan |
| Seuil | Seul le mini-test détermine la réussite : au moins 80 %, donc 4/5 |
| Aide | Théorie et aide contextuelle pendant entraînement ; aucune pendant mini-test ; aide disponible au bilan |
| XP | 10 XP par réponse correcte à l’entraînement ou au mini-test ; bonus de 50 XP si mini-test réussi |
| Limites | Par matière et date Europe/Brussels : arrêt dès 6 essais OU 3 chapitres distincts réussis ; aucune règle 400 XP, 50 % au deuxième ou 0 au troisième |
| Essai | Compté à la clôture d’une séance normale complète, une seule fois ; reprendre la même séance n’en consomme pas une autre |
| Renouvellement | Sous 80 %, nouvelle tentative sur la même notion, questions renouvelées et erreurs ciblées ; au moins 80 %, notion suivante |
| Fin du programme | Après la dernière notion réussie : programme terminé et révision possible ; pas de notion hors bornes |
| Snap | Récompense à 10 000 points ; accès et règles du contrat familial affichés, sans prétendre piloter Snapchat |
| Inactivité | Trois jours calendaires complets sans séance terminée sans retrait ; écart de dates 4 → 5 %, 5 → 10 %, 6 → 15 %, au moins 7 → 20 %, sur le solde de début de période ; seulement le supplément non encore appliqué est débité, avec arrondi inférieur du retrait cumulé |
| QA | Aucun XP, historique élève, progression, pénalité, limite quotidienne ou e-mail réel impacté |

Les règles sont versionnées et figées dans chaque séance. Les questions et réponses attendues ne changent pas au milieu d’un test.

## Composants

Frontend modulaire : catalogue validé, moteur de séance, lecteur de théorie/audio, entraînement, mini-test, bilan, tableau de bord. Le moteur reçoit un contexte explicite `normal` ou `qa`, jamais un drapeau global persistant. Toute mission normale crée un nouveau contexte normal. Les profils élève et parent sont distincts.

Netlify Functions : authentification, création/reprise de séance, démarrage du test, enregistrement des réponses, clôture, progression, XP, demandes d’aide et émission d’événements de notification. Firestore stocke les profils, séances, réponses, compteurs quotidiens, validations, journal XP, migrations et événements de notification. Le navigateur ne décide jamais du score autoritatif, du bonus ou des droits parent.

Authentification Firebase : compte élève durable avec mécanisme de connexion/reprise utilisable sur plusieurs appareils ; un compte anonyme seul ne suffit pas. Lier les données existantes à un compte vérifié selon leur provenance, sans fusionner automatiquement des identités différentes. Le parent est autorisé par relation explicite avec l’élève, pas par une adresse ou un rôle modifiable côté client. Les règles Firestore et les fonctions contrôlent propriétaire et rôle ; secrets conservés exclusivement côté serveur.

Le projet Firebase QA est séparé de production. Les parcours QA ordinaires utilisent ce projet et un destinataire de notification fictif. Le mode QA affiché est explicite et ne peut être activé pour contourner des compteurs du compte réel. Les déploiements de prévisualisation n’ont pas d’identifiants Firebase ou e-mail de production.

## Transactions et interruptions

Identifiant unique de séance, règles figées, questions persistées. La création d’une séance normale contrôle atomiquement le quota ; une reprise renvoie la séance existante. Le démarrage du mini-test ne débite aucun essai. Une seule séance active par élève et matière, garantie par transaction serveur, évite de contourner les quotas avec plusieurs onglets ou appareils. Le serveur autorise uniquement la notion courante ou une révision d’une notion déjà débloquée ; un identifiant de chapitre client ne débloque rien. Reprendre conserve la même séance ; abandon explicite marque la séance abandonnée et libère le verrou, sans XP ni essai consommé puisqu’aucune séance complète n’a été clôturée. Une séance abandonnée ne peut plus être clôturée. Les horodatages sont attribués côté serveur, persistés et chronologiquement contrôlés ; les identifiants sont des chaînes non vides bornées. Les réponses soumises sont persistées et les réponses du test verrouillées après soumission.

La clôture calcule les résultats côté serveur à partir des réponses enregistrées. Une transaction Firestore inscrit ensemble statut terminé, XP/journal, historique, validation et progression ; répéter la clôture renvoie le résultat existant. Les compteurs de réussite utilisent un ensemble d’identifiants de chapitres. Une fin de séance déjà autorisée n’est pas refusée parce qu’un quota est désormais atteint. Les essais et réussites sont imputés au jour de clôture Europe/Brussels, même si la séance a commencé avant minuit ; les deux dates sont enregistrées. Un changement de jour ne modifie ni ne recrée une séance active.

Une période d’inactivité stocke sa date d’ancrage, son solde initial et le pourcentage déjà appliqué ; relancer l’accueil ne peut pas reproduire un débit. Le débit effectif est limité au solde disponible, sans solde négatif ni dette : journaliser montant théorique, montant appliqué et différence non recouvrée ; marquer le pourcentage atteint pour ne pas reprendre cette différence sur des gains futurs. Une dépense de récompense ne change pas la base de période. Une séance terminée clôture la période sans remboursement, puis fixe une nouvelle date d’activité et une nouvelle base. Un journal permet d’expliquer tout changement de solde. Les modifications de récompenses restent indépendantes des validations scolaires. Chaque dépense ou attribution de récompense est une transaction serveur autorisée, avec solde suffisant, clé anti-doublon et écriture au journal ; seuls les rôles autorisés changent le catalogue. Conserver la distinction solde disponible et XP cumulés si elle existe dans les données sources ; ne jamais choisir automatiquement le maximum entre deux soldes contradictoires. Les crédits récupérés lors d’une réparation ne sont ajoutés que si une trace justifie score et montant, avec identifiant anti-doublon.

Hors ligne : conserver les réponses en attente localement, afficher « synchronisation en attente » et reprendre. Une nouvelle séance nécessitant un contrôle serveur des quotas attend la reconnexion. Une réussite non confirmée ne se présente pas comme créditée. Les notifications sont des événements indépendants après commit, avec déduplication ; un échec d’e-mail ne fait pas perdre les XP.

## Pédagogie et génération

Catalogue de notions versionné avec objectif, prérequis, théorie, exemples, cinq familles et banques/générateurs approuvés par les professeurs. Génération locale ou serveur à partir de modèles validés et d’une graine persistée ; vérification de l’unicité des questions et des choix après normalisation/équivalence. QCM à choix unique : exactement une bonne réponse. Les contractions anglaises et variantes admises sont documentées par consigne. Maths : contrôler aussi la forme demandée ; une expression équivalente non réduite ou une fraction non irréductible ne suffit pas si la consigne demande cette forme. Chaque mini-test répartit ses cinq questions selon une grille de compétences du professeur ; éviter cinq fois la même micro-compétence. Le premier essai est enregistré séparément des réponses après aide ou correction ; une correction répétée ne crée pas de crédit supplémentaire. Anglais : vocabulaire adapté, difficulté progressive reconnaître/compléter/ordonner/transformer/produire, critères par famille. Les mini-tests couvrent plusieurs sujets et formes, sans recopier les phrases de pratique ni introduire une tâche inconnue. Normaliser apostrophes, espaces et casse sans effacer l’erreur grammaticale ciblée ; accepter is not/isn’t et les contractions de sujet autorisées par la consigne. Dimensionner la banque pour six séances renouvelées et vérifier les doublons sémantiques.

Éviter les répétitions dans une séance et entre tentatives voisines, modifier aussi les valeurs, contextes et tâches. Tirage borné ; banque de secours validée en cas d’épuisement ; jamais de boucle infinie ni d’exception brute présentée à l’élève. Si la banque ne peut produire une séance conforme, suspendre cette notion avec message compréhensible et signalement technique plutôt que produire des questions invalides. Audio plus lent avec préférence féminine disponible ; indiquer les limites des voix proposées par l’appareil.

## Aide IA

Endpoint authentifié Netlify, clé serveur, limite de fréquence et taille de requête, contrôle de l’étape de séance à partir du stockage serveur. En entraînement : contexte minimal de la notion et exercice courant, aide graduée sans exposition de données inutiles. En mini-test : endpoint refuse l’aide, même si le client falsifie l’étape ; aucune théorie ou réponse attendue chargée par l’interface du test. Après clôture : explications accessibles au bilan. Consignes de l’élève traitées comme entrée non fiable et n’accordant jamais de nouveaux droits.

Le fournisseur IA ne corrige pas le score autoritatif. Éviter d’inclure dans l’aide les questions du mini-test à venir ou leur corrigé. En cas d’indisponibilité : conseils pédagogiques locaux approuvés, clairement étiquetés « aide préparée, sans IA ». Les erreurs restent sans effet sur les points ou la progression.

## Migration

Schéma V4 et registre de migration versionnés. Inventorier les schémas V3 et sources locales/cloud avant d’écrire l’adaptateur. Copier sans détruire la source, conserver provenance et champs inconnus, rapprocher les identités explicitement. Préserver solde et historique prouvés ; ne pas recalculer des points historiques à partir des nouvelles règles. Associer les chapitres par identifiant stable, jamais seulement par position. Un historique absent reste absent, sans invention.

Répéter une migration n’ajoute aucun crédit ni doublon. Comparer les comptes, soldes, historiques et validations avant/après sur une copie ; tester les données vides, anciennes, partielles et contradictoires. Un retour au code V3 ne doit pas effacer les séances V4 : restauration et coexistence des schémas doivent être prévues. Aucun passage au compte réel avant revue de la migration.

## Notifications et validation

Événements de début au lancement du premier entraînement, et de fin après clôture ; jamais au login. Destinataire parent autorisé, bilan comprenant durées, résultats, score, XP et statut de synchronisation. Déduplication par séance/type ; reprise des échecs, suivi de livraison sans prétendre qu’un envoi accepté prouve la réception.

Ordre : IT présente cette architecture → QA la challenge → IT la révise → profs détaillent contenus et critères → IT implémente en branche → QA et IT exécutent les essais. Jusqu’à cinq cycles correction/revérification ; un défaut bloquant au cinquième reste bloquant. La validation couvre QA puis normal, doubles clôtures, quotas aux frontières, minuit Brussels/heure d’été, dernière notion, inactivité, interruption/hors ligne, Firebase multiappareil, migration, notifications, refus d’aide pendant test et les 41 notions/cinq familles. Tests unitaires seuls insuffisants : exécutions navigateur, Functions et projet Firebase de préproduction nécessaires.

Livraison seulement après preuves QA et IT, puis fusion/déploiement selon le processus existant et contrôle du numéro de version et des parcours sur la version réellement servie. Prévoir journal d’incidents et restauration documentée. Ce document ne constitue aucune de ces validations.


## Contrats API proposés (non implémentés)

Routes indicatives sous `/.netlify/functions/` ; JSON borné, jeton Firebase vérifié côté serveur, horodatage serveur et réponses sans secrets. Les décisions métier ci-dessus s’appliquent même si le navigateur demande autre chose.

| Route / méthode | Entrée → sortie | Contrôle principal |
|---|---|---|
| `session-create` POST | matière, chapterId, requestId → séance persistée ou séance active existante | Propriétaire, notion débloquée, quota, verrou matière ; idempotence requestId |
| `session-resume` GET | sessionId → étape et données autorisées | Propriétaire ; aucune correction future ou théorie en test |
| `practice-start` POST | sessionId, requestId → entraînement prêt | Transition théorie → entraînement ; événement début unique par séance, idempotent ; aucune notification au login ou simple théorie |
| `test-start` POST | sessionId → cinq questions persistées du mini-test | Exactement les 10 réponses initiales des questionIds distincts persistés de pratique enregistrées ; aucune tentative débitée ; reprise identique |
| `answer-submit` POST | sessionId, questionId, réponse, requestId → accusé + retour autorisé | Question de séance, première réponse figée ; correction différée pour mini-test |
| `session-finish` POST | sessionId, requestId → score, XP, progression, bilan | Exactement les 10 + 5 questionIds distincts attendus, réponses initiales vérifiées serveur ; transaction unique de clôture |
| `session-abandon` POST | sessionId → statut abandonné | Propriétaire ; libération verrou ; aucune clôture ultérieure |
| `help` POST | sessionId, questionId, demande → aide contextuelle ou aide préparée étiquetée | Étape serveur practice/bilan ; refus test ; authentification et quotas fournisseur |
| `dashboard` GET | profil autorisé → solde, historique, limites, progression | Élève propriétaire ou parent explicitement lié ; inactivité appliquée idempotemment |
| `reward-redeem` POST | rewardId, requestId → transaction/bilan | Récompense autorisée, solde suffisant, transaction journal+solde anti-doublon |
| `notify-dispatch` POST interne | eventId → statut d’envoi | Appel serveur signé ; destinataire autorisé ; déduplication ; aucune route publique libre |
| `migration-run` POST administratif | migrationId, dryRun → rapport/état | Administrateur, sauvegarde vérifiée, mode simulation avant mutation ; jamais élève |

Une réponse incorrecte du mini-test n’obtient pas son corrigé via `answer-submit`; la correction devient consultable seulement après clôture. Le client n’envoie jamais le nombre de bonnes réponses ni les XP à créditer. `v4-contract.mjs` accepte de tels nombres uniquement comme substitut d’une correction serveur, pour tester les règles isolément ; ce n’est pas le contrat HTTP. Il commence directement à l’étape entraînement et ne simule ni la transition théorie/practice ni l’enregistrement des quinze réponses individuelles : ces préconditions devront être testées sur le backend implémenté. Le modèle numérote abstraitement les chapitres de 0 à 19/20 ; la production emploie des identifiants stables et vérifie catalogue, appartenance matière, prérequis et existence de la notion suivante.

## Schéma Firestore proposé (non créé)

| Collection / document | Champs essentiels | Accès et invariants |
|---|---|---|
| `profiles/{uid}` | rôle, parentLinks vérifiés, migrationVersion | Lecture propre profil ; rôle/liens modifiés serveur autorisé seulement |
| `students/{uid}` | solde, totalAcquis si défini, lastActivityDay, inactivity{anchor,baseXP,pctApplied}, schemaVersion | Lecture élève/parent lié ; écritures métier serveur uniquement |
| `students/{uid}/sessions/{id}` | matière, chapterId, mode, rulesVersion/snapshot, contentVersion, graine, étape, createdAt/testAt/completedAt | Séance propriétaire ; aucun accès client aux corrigés de test avant clôture |
| `students/{uid}/sessions/{id}/answers/{questionId}` | réponse initiale, instant serveur, éventuelles corrections entraînement, résultat autoritatif | Soumission via fonction ; retour adapté étape ; une première réponse par question |
| `students/{uid}/active/{subject}` | sessionId | Verrou transactionnel partagé entre appareils et onglets |
| `students/{uid}/daily/{subject_day}` | completedAttempts, passedChapterIds | Date Brussels de clôture ; ensemble de chapitres distincts ; serveur seul |
| `students/{uid}/mastery/{chapterId}` | meilleure preuve de validation, contentVersion, progression pertinente | Serveur seul, distinction tentative/historique ; aucune validation QA |
| `students/{uid}/ledger/{operationId}` | delta effectif, cause, sessionId/rewardId, due/applied/uncollected si pénalité, createdAt | Journal immuable ; clé unique ; pas de crédit sur simple lecture |
| `students/{uid}/history/{sessionId}` | durées, résultats, score, XP, statusSync | Créé atomiquement à clôture ; visible élève/parent lié |
| `notificationEvents/{eventId}` | uid, sessionId, type, destinataire vérifié, statut, tentatives | Serveur uniquement ; identifiant session/type ; jamais QA réel |
| `catalogue/{chapterId}` | matière, ordre, objectifs, prérequis, cinq familles, versions et validation prof | Contenu publié lisible ; corrigés/réponses test dans stockage serveur protégé séparé |
| `migrations/{uid_version}` | origine, mapping, checksum, dryRunReport, statut, dates | Administrateur ; aucune fusion automatique par max XP |

Les accès parent doivent être bornés au profil lié. La lecture directe des collections sensibles est refusée par les règles Firestore ; les Functions utilisant les droits serveur effectuent leur propre autorisation, car les règles client ne suffisent pas à les protéger. Séparer physiquement les corrigés de la vue cliente évite qu’un document lisible révèle des champs secrets. Le projet QA utilise les mêmes schémas avec données fictives, secrets séparés et envoi e-mail désactivé ou capturé.

## Jalons de mise en œuvre proposés

1. Référence code exacte et sauvegardes de données/configuration, restauration de contrôle ; inventaire des versions, identités et schémas.
2. Validation de cette architecture par QA et critères professeurs ; catalogue stable et matrice des 41 notions × cinq familles.
3. Sur branche `feature/v4`, moteur de séances/règles et clôture transactionnelle ; schéma, droits et authentification durable ; revue QA des contrats et permissions.
4. Migration en simulation puis répétée sur copie, tests de non-perte et reprise ; aucune migration réelle à cette étape.
5. Banques pédagogiques, renouvellement, audio et aide IA ; notification start/finish et bilan ; tests navigateur/Functions/Firestore réels de préproduction.
6. Jusqu’à cinq cycles QA/IT : anomalies priorisées, correctifs, nouvelles preuves ; validation explicite et plan de restauration du code ET des données.
7. Sauvegarde fraîche avant bascule, migration réelle contrôlée puis publication selon processus existant ; contrôle postproduction du numéro V4, points, historique, quotas, reprise, e-mails et Firebase.

Toutes les routes, collections et étapes de cette section sont des choix de conception proposés, et non des composants livrés. La durée et le nombre de changements nécessaires ne sont pas établis avant l’inventaire du code existant.
