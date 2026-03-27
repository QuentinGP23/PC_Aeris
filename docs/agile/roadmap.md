# Roadmap — PC Aeris

> **Dernière mise à jour :** 27 mars 2026
> **Format :** Sprints de 2 semaines
> **Equipe :** Solo (1 développeur)
> **Vélocité cible :** 15-20 points/sprint (solo, réaliste avec phase design incluse)

---

## Vision produit

**PC Aeris** est la plateforme de référence francophone pour configurer, vérifier et commander un PC sur mesure assemblé par des experts. L'objectif est de rendre accessible la construction d'un PC personnalisé à tous, des débutants aux passionnés.

---

## Timeline globale

```
2026
Janv – Mars  : Sprint 1 (terminé) — Foundation
Avril        : Sprint 2 — Bugs critiques + UX de base
Avril-Mai    : Sprint 3 — Compatibilité complète + Tests
Mai          : Sprint 4 — Admin complet + Prix
──────────────────────────────────────────────────
             MVP TARGET : fin mai 2026
──────────────────────────────────────────────────
Juin         : Sprint 5 — Profil + Prix + Configs sauvegardées
Juin-Juillet : Sprint 6 — Panier + Catalogue amélioré
Juillet      : Sprint 7 — Tunnel de commande + Stripe
Aout         : Sprint 8 — Suivi commandes + Polish
──────────────────────────────────────────────────
             V1 PUBLIQUE TARGET : fin aout 2026
──────────────────────────────────────────────────
Sept+        : V2 — IA, responsive complet, features avancées
```

---

## Sprint 1 — TERMINE
**Période :** Janvier – Mars 2026 (sprint long de mise en place)
**Objectif :** Fondations du projet

### Livraisons
- [x] Setup complet (Vite + React 19 + TS + Supabase + Vercel)
- [x] CI/CD GitHub Actions + Vercel
- [x] Design system complet (17 composants UI)
- [x] Authentification complète (signup / signin email / forgot / reset)
- [x] Configurateur PC avec sélection par catégorie et pagination
- [x] Compatibilité CPU / Carte mère / RAM / Ventirad
- [x] Interface admin : Dashboard, Users CRUD, Products (edit/delete)
- [x] Scripts import produits (BuildCores, BestBuy images)

### Ce qui reste à corriger (reporté Sprint 2)
- [ ] Bug connexion par pseudo
- [ ] Page profil (TODO dans le code)
- [ ] Prix des produits absents
- [ ] 0 tests

**Vélocité réalisée :** ~57 points (22 stories Done)

---

## Sprint 2 — En cours
**Période :** 28 mars – 11 avril 2026
**Objectif :** Corriger les bugs bloquants et améliorer l'expérience de base

### Stories ciblées

| ID | Description | Points |
|---|---|---|
| US-015 | Correction bug connexion par pseudo | 3 |
| US-084 | Système de toast notifications globales | 3 |
| US-002 | Hero banner avec CTA sur la page d'accueil | 3 |
| — | Refactorisation page d'accueil (suppression du dump de données user) | 2 |
| US-085 | Page 404 personnalisée | 2 |
| — | Responsive partiel : pages auth (signin, signup, forgot, reset) | 3 |

**Total :** 16 points

### Phase Design Sprint 2 (en parallèle du dev)
- Définir la palette de couleurs, typographie et espacements
- Maquetter la page d'accueil (lo-fi)
- Définir le positionnement des blocs du configurateur

### Critères de fin de sprint
- [ ] Zero bug bloquant sur le parcours auth
- [ ] Toasts intégrés dans les actions principales
- [ ] Page d'accueil avec un vrai contenu
- [ ] Site utilisable sur mobile pour les pages auth

---

## Sprint 3 — A venir
**Période :** 14 – 25 avril 2026
**Objectif :** Compléter la compatibilité et initier les tests

### Stories ciblées

| ID | Description | Points |
|---|---|---|
| US-033 | Compatibilité GPU / Alimentation (TDP) | 5 |
| US-034 | Compatibilité Boîtier / Format carte mère | 3 |
| US-035 | Compatibilité Stockage / Connectique carte mère | 3 |
| US-086 | Setup Vitest + tests unitaires compatibilité | 8 |

**Total :** 19 points

### Phase Design Sprint 3
- Maquetter le configurateur (desktop) — layout final
- Définir les états UI (chargement, erreur, vide, filtre actif)

### Critères de fin de sprint
- [ ] Les 8 catégories ont leurs règles de compatibilité
- [ ] Vitest configuré et > 10 tests unitaires sur la compatibilité
- [ ] Les tests passent dans le CI

---

## Sprint 4 — A venir
**Période :** 28 avril – 9 mai 2026
**Objectif :** Compléter l'interface admin et introduire les prix

### Stories ciblées

| ID | Description | Points |
|---|---|---|
| US-078 | Création de produit depuis l'interface admin | 5 |
| US-079 | Gestion des prix des produits | 3 |
| US-087 | Tests d'intégration sur les flux critiques | 8 |
| US-061 | Page profil utilisateur (version basique) | 3 |
| US-062 | Modification informations personnelles | 2 |

**Total :** 21 points

### Phase Design Sprint 4
- Maquetter la page profil utilisateur
- Maquetter le formulaire de création de produit admin

### Critères de fin de sprint
- [ ] Admin : CRUD produits 100% fonctionnel via UI
- [ ] Les prix sont visibles dans le configurateur
- [ ] La page profil remplace le TODO

---

## JALÓN — MVP (fin mai 2026)

A la fin du Sprint 4, le MVP est atteint :

```
Fonctionnel :
✓ Authentification complète sans bugs
✓ Configurateur avec compatibilité complète (8 catégories)
✓ Prix des composants visibles
✓ Prix total de la configuration affiché
✓ Interface admin CRUD produits + prix
✓ Page profil utilisateur basique
✓ Toast notifications
✓ Tests unitaires et d'intégration de base

Exclu du MVP :
✗ Panier et tunnel de commande
✗ Intégration Stripe
✗ Configurations sauvegardées
✗ Responsive mobile complet
✗ Filtres avancés
```

---

## Sprint 5 — V1
**Période :** 12 – 23 mai 2026
**Objectif :** Prix, profil complet et configurations sauvegardées

### Stories ciblées

| ID | Description | Points |
|---|---|---|
| US-028 | Prix composant dans le configurateur | 3 |
| US-039 | Prix total configuration | 2 |
| US-040 | Indicateur de complétude de la configuration | 3 |
| US-041 | Sauvegarde de configuration | 5 |
| US-042 | Nommage d'une configuration sauvegardée | 2 |
| US-043 | Accès aux configurations sauvegardées | 3 |
| US-044 | Suppression d'une configuration sauvegardée | 1 |
| US-063 | Modification du pseudo | 2 |
| US-064 | Changement de mot de passe depuis le profil | 2 |

**Total :** 23 points

---

## Sprint 6 — V1
**Période :** 26 mai – 6 juin 2026
**Objectif :** Panier et catalogue amélioré

### Stories ciblées

| ID | Description | Points |
|---|---|---|
| US-006 | Responsive mobile (pages principales) | 8 |
| US-009 | Filtres avancés catalogue (marque, prix) | 5 |
| US-029 | Filtre par fourchette de prix dans le configurateur | 3 |
| US-047 | Ajout configuration au panier | 5 |
| US-048 | Page panier | 3 |
| US-049 | Modification/suppression articles panier | 3 |
| US-050 | Persistance panier (localStorage) | 3 |
| US-066 | Gestion adresses de livraison sur le profil | 3 |
| US-067 | Adresse par défaut | 2 |

**Total :** 35 points (sprint chargé — à découper si nécessaire)

---

## Sprint 7 — V1
**Période :** 9 – 20 juin 2026
**Objectif :** Tunnel de commande et intégration Stripe

### Stories ciblées

| ID | Description | Points |
|---|---|---|
| US-051 | Saisie adresse de livraison au checkout | 3 |
| US-052 | Sélection adresse sauvegardée au checkout | 2 |
| US-053 | Choix option de livraison | 3 |
| US-054 | Paiement Stripe | 8 |
| US-055 | Email de confirmation de commande | 3 |
| US-081 | Liste commandes admin | 3 |
| US-082 | Mise à jour statut commande admin | 3 |
| US-083 | Détail commande admin | 2 |

**Total :** 27 points

### Prérequis techniques Sprint 7
- Supabase Edge Function : création Payment Intent Stripe
- Table `orders` en base de données
- Configuration webhook Stripe
- Compte Stripe créé et vérifié

---

## Sprint 8 — V1
**Période :** 23 juin – 4 juillet 2026
**Objectif :** Suivi commandes, polish et préparation lancement

### Stories ciblées

| ID | Description | Points |
|---|---|---|
| US-004 | Tarifs d'assemblage sur la page d'accueil | 2 |
| US-007 | Footer avec informations légales | 2 |
| US-058 | Historique des commandes | 3 |
| US-059 | Statut d'une commande en cours | 3 |
| US-045 | Partage de configuration via lien unique | 5 |
| US-074 | Recherche/filtre utilisateurs admin | 3 |
| US-030 | Image des composants dans le configurateur | 2 |
| — | Tests E2E Playwright sur le parcours principal | 5 |

**Total :** 25 points

---

## JALÓN — V1 Publique (fin juillet 2026)

A la fin du Sprint 8, la V1 est prête pour un lancement public :

```
Fonctionnel :
✓ Parcours complet : configuration → panier → paiement → confirmation
✓ Historique et suivi des commandes
✓ Profil utilisateur complet avec gestion adresses
✓ Configurations sauvegardées
✓ Responsive mobile sur les pages principales
✓ Catalogue avec filtres avancés
✓ Admin : CRUD complet + gestion commandes
✓ Partage de configurations
✓ Tests unitaires + intégration + E2E

Commercial :
✓ Prix des composants affichés
✓ Paiement Stripe opérationnel
✓ Email transactionnel (confirmation commande)
✓ Tarifs d'assemblage visibles
```

---

## V2 — Fonctionnalités avancées (Sprint 9+)
**Période estimée :** Septembre 2026 et au-delà

### Roadmap V2 (non datée)

| Priorité | Feature | Stories | Points estimés |
|---|---|---|---|
| Haute | Responsive mobile complet (toutes les pages) | US-006 (complément) | 8 |
| Haute | Graphiques admin (évolution inscriptions/commandes) | US-070 | 5 |
| Haute | Import CSV de produits | US-080 | 8 |
| Moyenne | Connexion OAuth Google | US-013 | 5 |
| Moyenne | Notifications email suivi commande | US-060 | 5 |
| Moyenne | Export configuration en PDF | US-046 | 5 |
| Moyenne | Suppression de compte (RGPD) | US-068 | 5 |
| Basse | IA de recommandation de configuration | US-036 | 13 |
| Basse | Suggestion automatique alimentation | US-037 | 8 |
| Basse | Paiement en plusieurs fois | US-056 | 5 |
| Basse | PayPal | US-057 | 5 |
| Basse | Photo de profil (avatar upload) | US-065 | 5 |
| Basse | Configurations populaires sur la page d'accueil | US-003 | 5 |

**Total V2 estimé :** ~82 points (~4-5 sprints)

---

## Budget temps estimé

| Phase | Sprints | Semaines | Objectif |
|---|---|---|---|
| Sprint 1 | 1 | ~10 semaines | Fondations (terminé) |
| Sprint 2-4 | 3 | 6 semaines | MVP |
| Sprint 5-8 | 4 | 8 semaines | V1 |
| Sprint 9+ | 4-5 | 8-10 semaines | V2 |
| **Total** | **12-13** | **~32 semaines** | **Produit complet** |

---

## Principes de la roadmap

### Ce qui a été volontairement repoussé et pourquoi

**Responsive mobile (Sprint 5-6 plutôt que Sprint 2)**
Le responsive est important mais transversal. L'implémenter avant d'avoir stabilisé le design de base créerait plus de dette que d'économie. Le design est défini en Sprint 2-3, puis le responsive suit en Sprint 5-6.

**Stripe en Sprint 7 plutôt qu'en Sprint 4**
Stripe est complexe (webhooks, edge functions, gestion d'erreurs). L'intégrer avant d'avoir un panier solide et une gestion d'adresses serait prématuré. La valeur commerciale sera validée avec les prix visibles (Sprint 4) avant de construire le paiement.

**IA en V2**
L'IA de recommandation est une feature différenciante mais complexe (LLM ou ML, données d'entraînement, latence). Elle ne sera construite qu'une fois le flux de base parfaitement maîtrisé.

### Règles de gestion de la roadmap

1. **Le MVP ne bouge pas** : aucune feature V1/V2 n'entre dans les Sprints 2-4 sans supprimer une feature équivalente
2. **La dette technique est payée avant d'avancer** : Sprint 3 entier alloué aux tests
3. **Design avant développement** : chaque sprint a une phase design en parallèle pour préparer le sprint suivant
4. **Les bugs sont prioritaires** : tout bug critique bloque les nouvelles features
