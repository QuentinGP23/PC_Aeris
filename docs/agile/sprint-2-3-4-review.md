# Revues consolidées des Sprints 2, 3 et 4 — PC Aeris

> **Sprints couverts :** 2, 3, 4
> **Période réelle :** 17–20 avril 2026 (sprints ciblés, courts)
> **Equipe :** Quentin Guichard (développeur solo)
> **Date de revue :** 29 mai 2026
> **Format :** Document de présentation pour entretien M2

---

## Pourquoi un document consolidé ?

Les sprints 2, 3 et 4 ont été exécutés sur une période très courte (17 au 20 avril 2026), chacun ciblé sur un thème précis. Plutôt que trois documents séparés très courts, ce document consolidé donne une vue d'ensemble plus lisible des trois sprints qui ont préparé la fin du MVP.

---

## 1. Objectifs et résultats par sprint

### Sprint 2 — 17 avril 2026 — UX et tuyauterie prix

**Objectif :** Corriger le bug critique de connexion par pseudo, ajouter le feedback toast global, poser la tuyauterie multi-sources des prix.

**Vélocité réalisée :** ~12 points

| US | Description | Statut |
|---|---|---|
| US-015 | Connexion par pseudo (correction du bug) | ✅ |
| US-084 | Système de toast notifications globales | ✅ |
| US-002 | Hero banner avec CTA sur la page d'accueil | ✅ |
| — | Refactorisation page d'accueil (retrait du dump des données user) | ✅ |
| — | Scaffolding multi-sources prix (Amazon, Rakuten, Cdiscount, eBay) | ✅ code, ⚠️ données absentes |

**Détail technique** :
- Toast : store Zustand dédié (`toastStore`), 4 variantes (success/error/info/warning), auto-dismiss 4s, animations CSS.
- Login pseudo : résolution préalable pseudo → email via la table `profiles`, puis Supabase Auth.
- Scaffolding prix : table `products` enrichie (`price_min_eur`, `price_max_eur`, `price_avg_eur`, `price_new_eur`, `price_new_source`, `price_used_sources` jsonb), 4 scripts Node de fetch par source. **Aucune donnée prix en base** : les credentials API (Amazon Partenaires, Rakuten Affiliés, Cdiscount, eBay) n'ont pas pu être obtenus à temps. L'UI sera implémentée en Sprint 5 et affichera des valeurs dès que les credentials seront branchés.

---

### Sprint 3 — 17–20 avril 2026 — Compatibilité et tests

**Objectif :** Compléter les règles de compatibilité du configurateur et initier la couverture de tests.

**Vélocité réalisée :** ~19 points

| US | Description | Statut |
|---|---|---|
| US-033 | Compatibilité GPU / Alimentation (calcul TDP) | ✅ |
| US-034 | Compatibilité Boîtier / Format carte mère (ATX/mATX/ITX) | ✅ |
| US-035 | Compatibilité Stockage / Connectique carte mère (M.2/SATA) | ✅ |
| US-086 | Setup Vitest + tests unitaires utils et services | ✅ (27 tests) |

**Détail technique** :
- **US-033** : `psu` filtré par `wattage >= ceil((tdp_cpu + tdp_gpu + 100) * 1.2)` — 20% de headroom + buffer système de 100W (cf. règles standards de dimensionnement PSU).
- **US-034** : `pc_case` filtré par `supported_mobo_form_factors @> [form_factor_mobo]` (array containment Supabase).
- **US-035** : `storage` filtré par `nvme` selon les slots M.2 / ports SATA disponibles sur la carte mère.
- **Tests** : 27 tests unitaires Vitest répartis sur `utils/compatibility` (20 tests) et `services/auth` (7 tests). Configuration vitest+globals dans tsconfig, scripts `npm test` et `npm run test:watch`.

---

### Sprint 4 — 20 avril 2026 — Admin et tests d'intégration

**Objectif :** Compléter le CRUD admin (création produits + édition prix) et ajouter des tests d'intégration sur les flux critiques.

**Vélocité réalisée :** ~21 points

| US | Description | Statut |
|---|---|---|
| US-078 | Création de produit depuis l'interface admin | ✅ |
| US-079 | Édition des prix produits côté admin | ✅ |
| US-087 | Tests d'intégration sur les flux critiques | ✅ (15 tests) |

**Détail technique** :
- **US-078** : nouveau formulaire admin avec tous les champs principaux + une 2e onglet pour les specs techniques (typage dynamique par catégorie).
- **US-079** : édition inline des champs `price_min_eur`, `price_max_eur`, `price_avg_eur` directement depuis la table admin produits.
- **US-087** : 15 tests d'intégration sur 3 flux : authentification (inscription/connexion/reset), administration (CRUD users + produits), configurator (sélection chaînée et filtres de compatibilité).

---

## 2. Vélocité cumulée

| Sprint | Points livrés | Stories | Durée |
|---|---|---|---|
| Sprint 2 | ~12 | 5 (dont scaffolding) | 1 jour |
| Sprint 3 | ~19 | 4 | 3 jours |
| Sprint 4 | ~21 | 3 | 1 jour |
| **Total S2+S3+S4** | **~52** | **12** | **~5 jours** |

Vélocité moyenne observée sur la phase mid-MVP : **~10 points/jour** sur les sprints courts, soit l'équivalent d'une vélocité de 20 points/sprint hebdo si on lisse.

---

## 3. Couverture de tests à fin Sprint 4

| Type | Nombre | Couverture |
|---|---|---|
| Unitaires (Vitest) | 27 | utils/compatibility (20) + services/auth (7) |
| Intégration | 15 | auth (6) + admin (4) + configurator (5) |
| E2E | 0 | Repoussé en V1 (Sprint 8) |
| **Total** | **42** | **0 régressions sur S1→S4** |

> Au 29 mai 2026, après les travaux mai (configurator order + saved configs), on est à **67 tests**.

---

## 4. Ce qui n'a pas été livré comme prévu

### Données prix absentes en base
**Impact :** US-010, US-028, US-039 (affichage prix) restent bloquées en l'absence de données.
**Cause :** Credentials API (Amazon Partenaires, Rakuten Affiliés, Cdiscount, eBay) non obtenus à temps. Le code est prêt à brancher les sources dès credentials disponibles.
**Mitigation :** L'UI prix sera développée en Sprint 5 et affichera "—" ou "N/A" tant qu'aucune donnée n'est en base. Édition manuelle possible côté admin pour les démos.

### Page profil (US-061, 062) livrée hors sprint
**Note :** Ces stories étaient pressenties pour Sprint 4 dans le plan initial mais ont été livrées **hors cadence sprint en avril 2026** (commits `3404c8e feat(profile): add user profile page` et `874e095 refactor(profile): redesign danger zone`). Elles font donc partie du MVP atteint.

### Page 404 (US-085) livrée hors sprint
**Note :** Idem, livrée en avril 2026 (commit `9e5d98b feat(404): add proper not found page`).

---

## 5. Rétrospective

### Ce qui a bien marché

**Sprints courts et ciblés**
Découper Sprint 2-3-4 sur des thèmes très précis (UX, compat, admin) plutôt que de les charger a permis d'avancer vite sans dette. La vélocité instantanée a été élevée parce que les changements étaient autonomes.

**Tests dès Sprint 3**
Avoir investi dans Vitest avant Sprint 4 a permis d'écrire les tests d'intégration directement sur une base déjà testée. Les régressions sont évitées sur les Sprints suivants.

**Architecture services + compatibilité**
La séparation `utils/compatibility.ts` (logique pure) / `services/*` (Supabase) / composants React a rendu chaque sprint indépendant. Pas de cross-cutting concerns à gérer.

### Ce qui peut être amélioré

**Dépendance à des credentials externes mal anticipée**
Le bloqueur prix (credentials API non obtenus) aurait dû être identifié comme risque dès Sprint 1. Mitigation : prévoir un plan B (édition manuelle, données factices) dès la planification.

**Absence de phase design dédiée**
Les sprints ciblés ont sauté la phase design recommandée dans la roadmap initiale, ce qui a généré du polish visuel à rattraper en mai 2026 (refonte Aeris Dark complète sur 1 PR).

**Documentation agile en retard**
Le sprint-1-review.md a été écrit le 27 mars 2026, puis aucun review n'a été produit pour S2/S3/S4 jusqu'au 29 mai. Ce document consolidé corrige rétroactivement le décalage.

---

## 6. Bilan MVP au 29 mai 2026

À l'issue des Sprints 1 à 4 + travaux d'avril/mai 2026 (configurations sauvegardées avancées en MVP), le périmètre fonctionnel du MVP est atteint à **~85 %**.

Reste à livrer en Sprint 5 (juin 2026) pour boucler le MVP :
- Affichage UI des prix (US-010, 028, 039) — code prêt, données dépendantes des credentials API
- Responsive mobile pages principales (US-006)
- Tarifs d'assemblage (US-004)
- Remember me (US-016)
- Modifications profil (US-063, 064)
- Recherche utilisateurs admin (US-074)
- Images composants dans la liste (US-030)

**Estimation reste à livrer :** ~26 points → 1 sprint long ou 2 mini-sprints.
