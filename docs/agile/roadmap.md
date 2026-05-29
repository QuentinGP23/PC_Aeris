# Roadmap — PC Aeris

> **Dernière mise à jour :** 29 mai 2026
> **Format :** Sprints courts (réalité observée : 1 à 4 jours pour S2→S4, plus longs ensuite)
> **Equipe :** Solo (1 développeur)
> **Vélocité réelle observée :** ~22 points/sprint en moyenne S1→S4

---

## Vision produit

**PC Aeris** est la plateforme de référence francophone pour configurer, vérifier et commander un PC sur mesure assemblé par des experts. L'objectif est de rendre accessible la construction d'un PC personnalisé à tous, des débutants aux passionnés.

---

## Timeline réelle observée vs prévisionnelle

```
2026
Jan–Mars      : Sprint 1 ✅ — Foundation (auth, configurateur, admin, design system)
17 avril      : Sprint 2 ✅ — fix login pseudo, toasts, scaffolding prix
17-20 avril   : Sprint 3 ✅ — compat GPU/PSU/case/storage + Vitest setup (27 tests)
20 avril      : Sprint 4 ✅ — admin création produit + édition prix + tests intégration (15)
Avril (hors)  : Profil utilisateur, page 404, fiche produit, enrichissement images
22-29 mai     : Mai 2026 🔄 — refonte dark theme + fix ordre configurateur + configs sauvegardées (US-040 à 044)
──────────────────────────────────────────────────
             MVP CIBLE : juin 2026 (reste Sprint 5 partiel)
             Bloqueur : credentials API non obtenus pour brancher les prix
──────────────────────────────────────────────────
Juin          : Sprint 5 (reste) — prix UI + responsive + remember me + admin search
Juin-Juillet  : Sprint 6 — Panier + Catalogue amélioré + Adresses livraison
Juillet       : Sprint 7 — Tunnel de commande + Stripe + Admin commandes
Août          : Sprint 8 — Suivi commande + Partage configs + Import CSV
──────────────────────────────────────────────────
             V1 PUBLIQUE CIBLE : fin août 2026
──────────────────────────────────────────────────
Sept+         : V2 — IA recommandation, responsive complet, paiement avancé, RGPD
```

### Écart observé vs plan initial

Le plan initial prévoyait des sprints de 2 semaines avec un MVP fin mai. En réalité :
- **Sprints 2-3-4 condensés sur quelques jours** (17-20 avril) parce que les stories étaient ciblées et que la dette technique du Sprint 1 était faible.
- **Travail "hors sprint" en avril** (profil, 404, fiche produit) intercalé entre sprints planifiés.
- **Mai consacré au polish** (refonte visuelle Aeris Dark + corrections UX configurateur) plutôt qu'à de nouvelles features.
- **MVP décalé à juin 2026** : la livraison des prix dépend de l'obtention de credentials API (Amazon Partenaires, Rakuten Affiliés, Cdiscount, eBay) qui n'ont pas abouti côté utilisateur. L'UI sera prête à les afficher dès branchement.

---

## Sprint 1 — ✅ Terminé
**Période :** Janvier – Mars 2026 (sprint long de mise en place)
**Objectif :** Fondations du projet
**Vélocité réalisée :** ~57 points (22 stories Done)

### Livraisons
- [x] Setup complet (Vite + React 19 + TS + Supabase + Vercel)
- [x] CI/CD GitHub Actions + Vercel
- [x] Design system complet (17 composants UI)
- [x] Authentification complète (signup / signin email / forgot / reset)
- [x] Configurateur PC avec sélection par catégorie et pagination
- [x] Compatibilité CPU / Carte mère / RAM / Ventirad
- [x] Interface admin : Dashboard, Users CRUD, Products (edit/delete)
- [x] Scripts import produits (BuildCores, BestBuy images)

### Dette technique identifiée → résolue dans les sprints suivants
- Bug connexion par pseudo → S2
- Page profil (TODO) → hors sprint avril
- Prix des produits absents → tuyauterie posée S2, données toujours absentes
- 0 tests → S3 (27 tests Vitest) + S4 (15 tests intégration)

---

## Sprint 2 — ✅ Terminé
**Période réelle :** 17 avril 2026 (sprint court ciblé)
**Objectif :** Corriger les bugs bloquants et poser la tuyauterie prix
**Vélocité réalisée :** ~12 points

### Livraisons
- [x] US-015 — Correction du bug connexion par pseudo
- [x] US-084 — Système de toast notifications globales (success/error/info/warning)
- [x] US-002 — Hero banner avec CTA sur la page d'accueil
- [x] Refactorisation page d'accueil (retrait du dump des données user)
- [x] Scaffolding multi-sources prix (Amazon, Rakuten, Cdiscount, eBay) — code prêt, credentials non obtenus

---

## Sprint 3 — ✅ Terminé
**Période réelle :** 17-20 avril 2026
**Objectif :** Compléter la compatibilité et initier les tests
**Vélocité réalisée :** ~19 points

### Livraisons
- [x] US-033 — Compatibilité GPU / Alimentation (calcul TDP + 20% headroom + buffer 100W)
- [x] US-034 — Compatibilité Boîtier / Format carte mère (ATX/mATX/ITX)
- [x] US-035 — Compatibilité Stockage / Connectique carte mère (M.2/SATA)
- [x] US-086 — Setup Vitest + 27 tests unitaires (compatibilité, auth)

---

## Sprint 4 — ✅ Terminé
**Période réelle :** 20 avril 2026
**Objectif :** Compléter l'interface admin et introduire la tuyauterie prix éditable
**Vélocité réalisée :** ~21 points

### Livraisons
- [x] US-078 — Création de produit depuis l'interface admin
- [x] US-079 — Édition des prix produits côté admin (champ price_avg_eur)
- [x] US-087 — 15 tests d'intégration sur les flux critiques (auth, admin, configurator)

---

## Avril 2026 — Hors sprint
**Travail intercalé entre les sprints planifiés**

- Page profil utilisateur (US-061, US-062) + danger zone
- Page 404 personnalisée (US-085)
- Fiche produit publique (route `/produit/:id`)
- Enrichissement automatique images (BestBuy → fallback Unsplash)

---

## Mai 2026 — Polish et stabilisation 🔄
**Période :** 22-29 mai 2026
**Objectif :** Refonte visuelle + correction logique configurateur + premières features Sprint 5

### Livraisons (PRs ouvertes vers `develop`)
- [x] Refonte design system Aeris Dark sur tout le site
- [x] RGAA AA : contrastes corrigés sur fond sombre
- [x] Fix ordre verrouillé du configurateur (CPU → MOBO → Boîtier → RAM → GPU → Stockage → Ventirad → PSU)
- [x] Cascade d'invalidation automatique lors des changements amont
- [x] Nouveaux filtres : GPU/boîtier (longueur), ventirad/boîtier (hauteur)
- [x] US-040 — Indicateur de complétude (badge "Configuration complète")
- [x] US-041 à US-044 — Sauvegarder / nommer / lister / supprimer une configuration

---

## Sprint 5 (reste) — À faire
**Période cible :** juin 2026
**Objectif :** Finir le MVP — prix UI, responsive, UX

### Stories ciblées

| ID | Description | Points | Bloqueur |
|---|---|---|---|
| US-006 | Site responsive mobile complet (pages principales) | 8 | — |
| US-010 | Voir le prix de chaque composant dans le catalogue | 3 | Credentials API |
| US-028 | Voir le prix de chaque composant dans le configurateur | 3 | Credentials API |
| US-039 | Voir le prix total de sa configuration | 2 | Credentials API |
| US-030 | Voir une image du composant dans la liste | 2 | — |
| US-004 | Tarifs indicatifs d'assemblage visibles | 2 | — |
| US-016 | Rester connecté entre les sessions (remember me) | 2 | — |
| US-063 | Modification du pseudo depuis le profil | 2 | — |
| US-064 | Changement de mot de passe depuis le profil | 2 | — |
| US-074 | Rechercher et filtrer les utilisateurs (admin) | 3 | — |

**Total estimé : ~29 points**

### Critères de fin de Sprint 5 (et du MVP)
- [ ] Toutes les pages principales utilisables sur mobile
- [ ] L'UI prix est déployée (affichera des données dès que les credentials API sont branchés)
- [ ] Le profil permet de modifier pseudo + mot de passe
- [ ] L'admin peut rechercher un utilisateur par nom/email

---

## JALON — MVP (cible juin 2026, partiellement atteint)

À la fin du Sprint 5, le MVP sera atteint. État au 29 mai 2026 :

```
Fonctionnel :
✓ Authentification complète sans bugs
✓ Configurateur avec compatibilité complète (8 catégories)
✓ Ordre verrouillé du configurateur (zéro impasse)
✓ Configurations sauvegardées (US-040 à 044) — initialement V1, avancées en MVP
✓ Interface admin CRUD produits + édition prix
✓ Page profil utilisateur (modification infos)
✓ Toast notifications
✓ 67 tests (unitaires + intégration)
✓ Identité visuelle complète (Aeris Dark, RGAA AA)
~ Tuyauterie multi-sources des prix (Amazon/Rakuten/Cdiscount/eBay) prête, en attente credentials
☐ Affichage des prix UI (à implémenter Sprint 5 reste)
☐ Responsive mobile (à implémenter Sprint 5 reste)
☐ Tarifs d'assemblage visibles (à implémenter Sprint 5 reste)

Exclu du MVP :
✗ Panier et tunnel de commande
✗ Intégration Stripe
✗ Filtres avancés catalogue
```

**Remarque** : les configs sauvegardées (initialement prévues en V1) ont été avancées en MVP pour démontrer une valeur produit forte, l'effort étant raisonnable (table + 1 service + 1 modal).

---

## Sprint 6 — V1
**Période cible :** juillet 2026
**Objectif :** Panier et catalogue amélioré

### Stories ciblées

| ID | Description | Points |
|---|---|---|
| US-003 | Configurations populaires sur la home | 5 |
| US-009 | Filtres avancés catalogue (marque, prix) | 5 |
| US-022 | Choisir un usage cible (Gaming, Bureautique, Création) | 8 |
| US-029 | Filtre par fourchette de prix dans le configurateur | 3 |
| US-047 | Ajout configuration au panier | 5 |
| US-048 | Page panier | 3 |
| US-049 | Modification/suppression articles panier | 3 |
| US-050 | Persistance panier (localStorage) | 3 |
| US-066 | Gestion adresses de livraison sur le profil | 3 |
| US-067 | Adresse par défaut | 2 |
| US-070 | Graphiques admin (évolution inscriptions/commandes) | 5 |

**Total :** 45 points (sprint chargé — à découper si nécessaire)

---

## Sprint 7 — V1
**Période cible :** juillet 2026
**Objectif :** Tunnel de commande et intégration Stripe

### Stories ciblées

| ID | Description | Points |
|---|---|---|
| US-051 | Saisie adresse de livraison au checkout | 3 |
| US-052 | Sélection adresse sauvegardée au checkout | 2 |
| US-053 | Choix option de livraison | 3 |
| US-054 | Paiement Stripe | 8 |
| US-055 | Email de confirmation de commande | 3 |
| US-013 | OAuth Google (login social) | 5 |
| US-081 | Liste commandes admin | 3 |
| US-082 | Mise à jour statut commande admin | 3 |
| US-083 | Détail commande admin | 2 |

**Total :** 32 points

### Prérequis techniques Sprint 7
- Supabase Edge Function : création Payment Intent Stripe
- Table `orders` en base de données
- Configuration webhook Stripe
- Compte Stripe créé et vérifié

---

## Sprint 8 — V1
**Période cible :** août 2026
**Objectif :** Suivi commandes, polish et préparation lancement

### Stories ciblées

| ID | Description | Points |
|---|---|---|
| US-007 | Footer avec informations légales | 2 |
| US-045 | Partage de configuration via lien unique | 5 |
| US-058 | Historique des commandes | 3 |
| US-059 | Statut d'une commande en cours | 3 |
| US-080 | Import CSV de produits (admin) | 8 |
| — | Tests E2E Playwright sur le parcours principal | 5 |

**Total :** 26 points

---

## JALON — V1 Publique (fin août 2026)

À la fin du Sprint 8, la V1 sera prête pour un lancement public :

```
Fonctionnel :
✓ Parcours complet : configuration → panier → paiement → confirmation
✓ Historique et suivi des commandes
✓ Profil utilisateur complet avec gestion adresses
✓ Configurations sauvegardées (déjà livré en mai 2026)
✓ Responsive mobile sur les pages principales
✓ Catalogue avec filtres avancés
✓ Admin : CRUD complet + gestion commandes + graphiques + import CSV
✓ Partage de configurations
✓ OAuth Google
✓ Tests unitaires + intégration + E2E

Commercial :
✓ Prix des composants affichés (dès credentials API obtenus)
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
| Haute | Responsive mobile complet (toutes les pages) | US-006 (complément) | 5 |
| Moyenne | Notifications email suivi commande | US-060 | 5 |
| Moyenne | Export configuration en PDF | US-046 | 5 |
| Moyenne | Suppression de compte (RGPD) | US-068 | 5 |
| Basse | IA de recommandation de configuration | US-036 | 13 |
| Basse | Suggestion automatique alimentation | US-037 | 8 |
| Basse | Paiement en plusieurs fois | US-056 | 5 |
| Basse | PayPal | US-057 | 5 |
| Basse | Photo de profil (avatar upload) | US-065 | 5 |

**Total V2 estimé :** ~56 points (~3 sprints)

> Note : US-003 (configurations populaires), US-013 (OAuth Google), US-022 (usage cible), US-070 (graphiques admin) et US-080 (import CSV) ont été ré-affectés à Sprints 6-8 plutôt qu'à V2, le périmètre V1 étant ajustable.

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
