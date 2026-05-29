# Périmètre MVP — PC Aeris

> **Dernière mise à jour :** 29 mai 2026
> **Cible MVP initiale :** Sprint 4 (fin mai 2026)
> **Cible MVP révisée :** fin Sprint 5 (juin 2026) — décalée en raison du bloqueur prix (credentials API non obtenus)
> **Objectif :** Avoir un produit utilisable et démontrable pour valider les hypothèses commerciales et satisfaire les exigences du projet M2

---

## État du MVP au 29 mai 2026

**Acquis (Sprints 1 à 4 + travaux mai 2026)** :
- ✅ Authentification complète (signup/signin email + pseudo / forgot / reset / déconnexion) — bug pseudo corrigé S2
- ✅ Configurateur PC fonctionnel avec compatibilité complète sur les 8 catégories (CPU/MOBO/RAM/GPU/Stockage/PSU/Boîtier/Ventirad)
- ✅ Ordre verrouillé du configurateur (zéro impasse) — mai 2026
- ✅ Configurations sauvegardées (US-040 à 044) — avancées du V1 vers le MVP, livrées mai 2026
- ✅ Interface admin CRUD produits + édition prix
- ✅ Toast notifications globales
- ✅ Page 404 personnalisée
- ✅ Page profil utilisateur (modification infos)
- ✅ Identité visuelle Aeris Dark (RGAA AA)
- ✅ 67 tests (unitaires + intégration) — couverture critique

**Reste à faire pour MVP complet (Sprint 5)** :
- ☐ Affichage prix UI dans catalogue/configurateur (US-010, 028, 039) — bloqué par credentials API
- ☐ Responsive mobile pages principales (US-006)
- ☐ Tarifs d'assemblage sur la home (US-004)
- ☐ Remember me (US-016)
- ☐ Modification pseudo + mot de passe depuis profil (US-063, 064)
- ☐ Recherche utilisateurs admin (US-074)
- ☐ Images composants dans la liste (US-030)

**Bloqueur principal** : la **tuyauterie multi-sources des prix** (Amazon Partenaires, Rakuten Affiliés, Cdiscount, eBay) est scaffoldée côté code mais les credentials API n'ont pas pu être obtenus. L'UI prix sera implémentée en Sprint 5 et affichera des valeurs dès que les credentials seront branchés.

---

## Définition du MVP

Le MVP de PC Aeris est la version minimale qui permet à un utilisateur de :
1. S'inscrire et se connecter
2. Configurer un PC complet avec vérification de compatibilité complète
3. Voir les prix des composants et le total de sa configuration
4. Que l'administrateur puisse gérer le catalogue de produits (CRUD complet avec prix)

Ce MVP exclut volontairement le tunnel de commande et le paiement : la valeur principale à valider est l'expérience de configuration, pas encore le flux e-commerce complet.

---

## Ce qui EST dans le MVP

### Authentification complète et sans bugs
**Pourquoi :** Sans authentification fonctionnelle, aucune donnée utilisateur ne peut être persistée. C'est le socle de tout le reste.
- Inscription email/mot de passe avec pseudo
- Connexion email et connexion pseudo (bug corrigé)
- Réinitialisation de mot de passe
- Déconnexion

### Design system et composants UI cohérents
**Pourquoi :** Un design system fonctionnel a été construit en Sprint 1. Il faut l'utiliser correctement et corriger les pages qui n'ont pas encore de vrai design.
- 17 composants UI disponibles (Button, Input, Modal, Table, Badge, etc.)
- Pages auth avec design réel (pas de placeholder)
- Navigation et layout cohérents

### Configurateur PC fonctionnel avec compatibilité complète
**Pourquoi :** C'est le coeur du produit. Sans compatibilité complète, le configurateur peut induire l'utilisateur en erreur — ce qui est pire que de ne pas avoir de configurateur.
- Sélection de composants pour les 8 catégories
- Compatibilité CPU / Carte mère / RAM / Ventirad (déjà fait)
- Compatibilité GPU / Alimentation (TDP)
- Compatibilité Boîtier / Format carte mère
- Compatibilité Stockage / Connectique carte mère
- Récapitulatif de configuration avec prix total
- Recherche et pagination

### Prix des produits visibles
**Pourquoi :** Sans prix, le configurateur n'a pas de valeur commerciale réelle. L'utilisateur ne peut pas savoir combien lui coûterait sa configuration. C'est un élément bloquant pour la validation du concept commercial.
- ✅ Champ prix en base de données (colonnes `price_min_eur`, `price_max_eur`, `price_avg_eur`, `price_new_eur`)
- ✅ Édition manuelle du prix côté admin (Sprint 4)
- ☐ Affichage prix sur chaque composant dans le configurateur (Sprint 5, UI prête, données dépendantes des credentials API)
- ☐ Prix total calculé dans le récapitulatif (Sprint 5)

> **Statut réel** : aucune donnée prix en base — la tuyauterie multi-sources est scaffoldée mais les credentials API (Amazon Partenaires, Rakuten Affiliés, Cdiscount, eBay) n'ont pas pu être obtenus à temps. L'UI sera développée en Sprint 5, le branchement effectif des sources sera fait dès credentials disponibles.

### Notifications toast globales
**Pourquoi :** Sans feedback visuel sur les actions, l'expérience utilisateur est dégradée. Les toasts sont un prérequis UX minimal pour que le produit soit utilisable.
- Toast succès, erreur, info, warning
- Intégration dans les actions clés (connexion, erreur, etc.)

### Interface admin CRUD produits complète
**Pourquoi :** L'administrateur doit pouvoir gérer le catalogue sans passer par des scripts. La création de produits et la gestion des prix sont essentielles pour la maintenance du catalogue.
- Création de nouveaux produits
- Édition des produits existants (déjà fait)
- Suppression de produits (déjà fait)
- Gestion des prix
- CRUD utilisateurs (déjà fait)
- Dashboard stats (déjà fait)

### Page 404 et gestion des erreurs basique
**Pourquoi :** Une page 404 personnalisée est le minimum attendu d'un produit professionnel.

---

## Ce qui N'EST PAS dans le MVP

### Panier et tunnel de commande
**Pourquoi exclu :** Implémenter un tunnel de commande complet (panier → adresse → paiement → confirmation) représente 3-4 sprints de travail. Pour le MVP, la valeur est dans la configuration, pas dans la transaction. La commande peut se faire par un autre canal (email, formulaire de contact) dans un premier temps.

### Intégration Stripe
**Pourquoi exclu :** Stripe nécessite des certificats SSL, des webhooks, une gestion des erreurs de paiement, des remboursements, une conformité PCI-DSS et des tests spécifiques. Ce travail est significatif et ne doit pas être bâclé. Il sera intégré en V1 quand la base est solide.

### Configurations sauvegardées — ✅ **avancées en MVP** (mai 2026)
**Décision révisée** : initialement prévues en V1, ces fonctionnalités (US-040 à US-044) ont été livrées en mai 2026 pendant la phase de polish. L'effort s'est avéré raisonnable (1 table Supabase + 1 service + 1 modal) et démontre une valeur produit forte pour la présentation client.

### Responsive mobile complet
**Pourquoi exclu :** La refonte responsive est transversale et chronophage (8 points estimés). Le MVP cible d'abord les utilisateurs desktop, qui représentent la large majorité des builders PC.

### Page profil complète (avec gestion des commandes, adresses)
**Pourquoi exclu :** La page profil de base (affichage et édition des infos) sera dans le MVP. Mais la gestion des adresses et l'historique des commandes sont liés au tunnel de commande, non disponible en MVP.

### Connexion OAuth (Google)
**Pourquoi exclu :** La connexion email est suffisante pour le MVP. OAuth ajoute de la complexité de configuration (app Google, gestion des comptes existants, etc.) sans valider d'hypothèse nouvelle.

### Filtres avancés et catalogue public
**Pourquoi exclu :** Le catalogue filtrable est une amélioration de l'expérience, pas un prérequis pour que le configurateur fonctionne. Les filtres de prix et de marque seront ajoutés en V1.

### IA de recommandation
**Pourquoi exclu :** L'IA est une fonctionnalité différenciante de V2. L'intégrer avant d'avoir validé la proposition de valeur de base serait prématuré.

---

## User stories incluses dans le MVP

| ID | User Story | Sprint | Statut |
|---|---|---|---|
| US-001 | Page d'accueil | S1 | ✅ |
| US-002 | Hero banner avec CTA | S2 | ✅ |
| US-005 | Navigation principale | S1 | ✅ |
| US-008 | Catalogue composants | S1 | ✅ |
| US-010 | Prix dans le catalogue | S5 | ☐ UI à faire, données bloquées |
| US-011 | Inscription | S1 | ✅ |
| US-012 | Pseudo à l'inscription | S1 | ✅ |
| US-014 | Connexion email | S1 | ✅ |
| US-015 | Connexion pseudo (bug fix) | S2 | ✅ |
| US-017 | Reset mot de passe | S1 | ✅ |
| US-018 | Nouveau mot de passe | S1 | ✅ |
| US-019 | Déconnexion | S1 | ✅ |
| US-020 | Accès configurateur | S1 | ✅ |
| US-021 | Catégories composants | S1 | ✅ |
| US-023 | Pagination configurateur | S1 | ✅ |
| US-024 | Recherche composant | S1 | ✅ |
| US-025 | Specs techniques clés | S1 | ✅ |
| US-026 | Sélection composant | S1 | ✅ |
| US-027 | Suppression composant | S1 | ✅ |
| US-028 | Prix composant dans configurateur | S5 | ☐ UI à faire, données bloquées |
| US-031 | Compatibilité CPU/MB/RAM | S1 | ✅ |
| US-032 | Explication filtre compatibilité | S1 | ✅ |
| US-033 | Compatibilité GPU/PSU | S3 | ✅ |
| US-034 | Compatibilité Boîtier/Format MB | S3 | ✅ |
| US-035 | Compatibilité Stockage/MB | S3 | ✅ |
| US-038 | Récapitulatif configuration | S1 | ✅ |
| US-039 | Prix total configuration | S5 | ☐ UI à faire, données bloquées |
| US-040 | Indicateur de complétude | Mai 2026 | ✅ avancé V1→MVP |
| US-041 | Sauvegarder une configuration | Mai 2026 | ✅ avancé V1→MVP |
| US-042 | Nommer une config sauvegardée | Mai 2026 | ✅ avancé V1→MVP |
| US-043 | Accéder aux configs sauvegardées | Mai 2026 | ✅ avancé V1→MVP |
| US-044 | Supprimer une config sauvegardée | Mai 2026 | ✅ avancé V1→MVP |
| US-061 | Page profil (version basique) | Avril 2026 | ✅ hors sprint |
| US-062 | Modification infos personnelles | Avril 2026 | ✅ hors sprint |
| US-069 | Dashboard admin | S1 | ✅ |
| US-071 | Liste utilisateurs admin | S1 | ✅ |
| US-072 | Modification rôle utilisateur | S1 | ✅ |
| US-073 | Suppression utilisateur | S1 | ✅ |
| US-075 | Liste produits admin | S1 | ✅ |
| US-076 | Modification produit | S1 | ✅ |
| US-077 | Suppression produit | S1 | ✅ |
| US-078 | Création produit admin | S4 | ✅ |
| US-079 | Édition prix produits | S4 | ✅ |
| US-084 | Toast notifications | S2 | ✅ |
| US-085 | Page 404 | Avril 2026 | ✅ hors sprint |
| US-086 | Tests unitaires utils/services | S3 | ✅ (27 tests Vitest) |
| US-087 | Tests intégration flux critiques | S4 | ✅ (15 tests) |

---

## Critères de succès du MVP

### Critères fonctionnels
- [ ] Un utilisateur peut créer un compte et se connecter sans bug
- [ ] Un utilisateur peut configurer un PC complet avec tous les composants et ne voir que des combinaisons compatibles
- [ ] Un utilisateur voit le prix total de sa configuration
- [ ] Un administrateur peut créer, modifier et supprimer des produits avec leurs prix
- [ ] Zéro bug bloquant sur le parcours principal (config → récapitulatif)

### Critères de qualité
- [ ] Aucune erreur console sur le parcours principal
- [ ] Temps de chargement des pages < 3 secondes (réseau normal)
- [ ] Toutes les actions importantes donnent un feedback visuel (toast ou état UI)
- [ ] Le projet est déployé en production sur Vercel et accessible publiquement

### Critères de validation M2
- [x] Story map complète et documentée
- [x] Backlog priorisé avec points de complexité
- [x] Revue de Sprint 1 documentée
- [x] Revues Sprints 2 à 5 documentées (sprint-2-3-4-review.md)
- [x] README à jour avec instructions de démarrage

---

## Hypothèses et risques

### Hypothèses du MVP

| # | Hypothèse | Risque si fausse | Plan de mitigation |
|---|---|---|---|
| H1 | Les utilisateurs veulent configurer eux-mêmes leur PC plutôt que d'acheter un PC préconstruit | Pas d'usage du configurateur | Mesurer le taux de visite et le temps passé sur le configurateur |
| H2 | La vérification de compatibilité automatique est la fonctionnalité différenciante clé | Utilisateurs indifférents à la compatibilité | Intégrer un questionnaire d'onboarding pour valider le cas d'usage |
| H3 | Les prix des composants affichés sur la plateforme sont compétitifs vs Amazon/LDLC | Utilisateurs qui achètent ailleurs | Surveiller les prix des concurrents et ajuster la marge |
| H4 | Les utilisateurs M2 (early adopters techniques) sont représentatifs du marché cible | Biais de sélection | Tester avec des profils moins techniques après le MVP |

### Risques techniques

| # | Risque | Probabilité | Impact | Mitigation |
|---|---|---|---|---|
| R1 | La base de produits est incomplète (specs manquantes, produits obsolètes) | Haute | Haute | Audit de la base avant le MVP, compléter les prix en priorité |
| R2 | Les règles de compatibilité sont incomplètes ou incorrectes | Moyenne | Haute | Tester avec des configurations réelles connues, consulter des forums PC |
| R3 | Performance dégradée avec beaucoup de produits en base (>1000 produits) | Faible | Moyenne | Index Supabase sur les colonnes de filtrage, pagination déjà en place |
| R4 | Supabase Free Tier limitations (500MB, 5GB bandwidth) | Faible | Basse | Surveiller l'usage, passer au plan Pro si nécessaire (~$25/mois) |

### Risques projet (solo)

| # | Risque | Probabilité | Impact | Mitigation |
|---|---|---|---|---|
| R5 | Scope creep — trop de features avant le MVP | Haute | Haute | Respecter strictement le périmètre MVP défini dans ce document |
| R6 | Dette technique accumulée (0 tests) | Haute | Moyenne | Allouer Sprint 3 aux tests avant d'ajouter de nouvelles features |
| R7 | Dépendance à Supabase (vendor lock-in) | Faible | Haute | Architecture propre avec couche service abstraite — déjà en place |
