# Revue de Sprint 1 — PC Aeris

> **Sprint :** 1
> **Période :** Janvier 2026 – Mars 2026 (sprint long, mise en place initiale du projet)
> **Equipe :** Quentin Guichard (développeur solo)
> **Date de revue :** 27 mars 2026
> **Format :** Document de présentation pour entretien M2

---

## 1. Objectif du Sprint 1

L'objectif du Sprint 1 était de poser les fondations complètes du projet PC Aeris :

- Mettre en place l'infrastructure technique (Vite + React 19 + TypeScript + Supabase + Vercel)
- Implémenter l'authentification complète (inscription, connexion, reset)
- Construire le design system de composants UI
- Développer le configurateur PC avec compatibilité partielle
- Mettre en place l'interface d'administration

Ce sprint correspond à la phase de mise en place rétroactive : le code a été produit avant la formalisation agile, et ce document structure ce travail dans un cadre méthodologique.

---

## 2. Vélocité

| Métrique | Valeur |
|---|---|
| Stories planifiées | 25 |
| Stories livrées (Done) | 22 |
| Stories partiellement livrées | 2 |
| Stories avec bug | 1 |
| Points estimés | ~65 |
| Points livrés (Done complet) | ~57 |
| Points livrés (Done + partiel) | ~65 |
| Taux de complétion | 88% |

**Détail par statut :**

| Statut | Stories | Points |
|---|---|---|
| Done | 22 | ~57 |
| Done (partiel) | 2 | ~8 |
| Bug | 1 | 3 |

---

## 3. Ce qui a été livré

### 3.1 Infrastructure et CI/CD

**Stories :** Fondation technique (hors backlog user)

```
Infrastructure livrée :
├── Vite + React 19 + TypeScript                    [OK]
├── SCSS avec variables globales et design tokens   [OK]
├── Supabase (PostgreSQL + Auth)                    [OK]
├── Zustand (state management)                      [OK]
├── React Router v6                                  [OK]
├── Déploiement Vercel (preview + production)       [OK]
├── GitHub Actions CI (lint + build)                [OK]
└── ESLint + TypeScript strict                      [OK]
```

**Schéma de base de données Supabase :**
```
Tables créées :
├── profiles          (id, pseudo, first_name, last_name, phone, role, ...)
├── products          (id, name, manufacturer, category, image_url, ...)
├── cpu_specs         (product_id, socket, cores, threads, boost_clock, ...)
├── motherboard_specs (product_id, socket, form_factor, chipset, ram_type, ...)
├── ram_specs         (product_id, ram_type, speed_mhz, capacity, ...)
├── gpu_specs         (product_id, vram_gb, boost_clock, tdp_watts, ...)
├── storage_specs     (product_id, capacity_gb, type, interface, ...)
├── psu_specs         (product_id, wattage, efficiency_rating, modular, ...)
├── pc_case_specs     (product_id, type, form_factor, side_panel, ...)
└── cpu_cooler_specs  (product_id, type, fan_rpm_max, cpu_sockets, ...)
```

---

### 3.2 Authentification (US-011, 014, 017, 018, 019)

**Flux implémentés :**

```
/signup  → Formulaire inscription
         → Validation email (unicité) + pseudo (format)
         → Création compte Supabase Auth
         → Création profil en table profiles
         → Connexion automatique
         → [OK]

/signin  → Formulaire connexion
         → Connexion par email : [FONCTIONNE]
         → Connexion par pseudo : [BUG - retourne erreur hardcodée]
         → Redirection selon le rôle (admin → /admin, user → /)
         → [OK partiel]

/forgot-password → Email de reset envoyé via Supabase
                 → [OK]

/reset-password  → Formulaire nouveau mot de passe
                 → Validation token Supabase
                 → [OK]

Déconnexion → Bouton présent sur la page Home
           → Suppression session Supabase
           → [OK]
```

**Capture d'écran simulée — Page de connexion :**
```
┌─────────────────────────────────────┐
│           PC Aeris                  │
│                                     │
│  ┌─────────────────────────────┐    │
│  │         Connexion           │    │
│  ├─────────────────────────────┤    │
│  │ Email ou pseudo             │    │
│  │ [________________________]  │    │
│  │                             │    │
│  │ Mot de passe                │    │
│  │ [________________________]  │    │
│  │                             │    │
│  │ □ Se souvenir de moi        │    │
│  │                             │    │
│  │ [      Se connecter       ] │    │
│  │                             │    │
│  │ Mot de passe oublié ?       │    │
│  │ Pas encore de compte ?      │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

---

### 3.3 Design System (~17 composants) (hors backlog user — livraison technique)

**Composants livrés :**

```
src/components/
├── ui/
│   └── HeroBanner/           [Livré]
│
└── common/
    ├── Alert/                [Livré] — variantes: info, success, warning, error
    ├── Avatar/               [Livré] — initiales + image
    ├── Badge/                [Livré] — variantes: primary, success, warning, error, info
    ├── Button/               [Livré] — variantes: primary, secondary, outline, ghost
    ├── Card/                 [Livré]
    ├── Checkbox/             [Livré]
    ├── Divider/              [Livré]
    ├── Form/                 [Livré] — Form.Group, Form.Error, Form.Label
    ├── Input/                [Livré]
    ├── Modal/                [Livré] — avec backdrop et animation
    ├── ProtectedRoute/       [Livré] — avec support requiredRole
    ├── Radio/                [Livré]
    ├── Select/               [Livré]
    ├── Spinner/              [Livré]
    ├── Table/                [Livré]
    ├── Textarea/             [Livré]
    └── Toggle/               [Livré]
```

**Page de démo composants :** Route `/components` disponible (dev only)

---

### 3.4 Configurateur PC (US-020 à 027, 031, 032, 038)

**Fonctionnalités livrées :**

```
Configurateur (/configurateur)
├── Sélection de catégorie (CPU, GPU, RAM, Carte mère, Stockage,
│   Alimentation, Boîtier, Ventirad)                              [OK]
├── Liste des composants avec pagination (24/page)                [OK]
├── Recherche par nom (ilike Supabase)                           [OK]
├── Affichage des specs clés par catégorie                       [OK]
├── Sélection / désélection de composant                        [OK]
├── Récapitulatif de configuration (panneau latéral)             [OK]
├── Bouton "Réinitialiser la configuration"                      [OK]
│
├── Compatibilité CPU ↔ Carte mère (socket)                     [OK]
├── Compatibilité Carte mère → RAM (DDR4/DDR5)                  [OK]
├── Compatibilité CPU → Ventirad (socket)                       [OK]
│
├── Compatibilité GPU ↔ Alimentation (TDP)                     [ABSENT]
├── Compatibilité Boîtier ↔ Carte mère (form factor)           [ABSENT]
└── Compatibilité Stockage ↔ Carte mère (M.2/SATA)            [ABSENT]
```

**Capture d'écran simulée — Configurateur :**
```
┌──────────────────────────────────────────────────────────┐
│ Configurateur PC                                         │
├────────────────────────────────┬─────────────────────────┤
│ [CPU] [MB] [RAM] [GPU] [STO]  │  Ma configuration       │
│ [PSU] [BOI] [VEN]             ├─────────────────────────┤
│                                │ CPU      i9-14900K      │
│ Rechercher...          [🔍]   │ Carte mère  Z790 Hero  │
│                                │ RAM      DDR5 32GB     │
│ Filtré par socket LGA1700 ✓   │ GPU      —             │
│                                │ Stockage —             │
│ ┌──────────────────────────┐  │ Alim.    —             │
│ │ Intel Core i5-14600K     │  │ Boîtier  —             │
│ │ LGA1700 • 14 cores       │  │ Ventirad —             │
│ │ Boost : 5.3 GHz          │  ├─────────────────────────┤
│ │              [Sélectionner│  │ Prix total : —         │
│ ├──────────────────────────┤  │                         │
│ │ Intel Core i7-14700K     │  │ [Réinitialiser]        │
│ │ LGA1700 • 20 cores       │  └─────────────────────────┘
│ │ Boost : 5.6 GHz          │
│ │              [Sélectionner│
│ └──────────────────────────┘
│
│ [← Préc.]  Page 1/3  [Suiv. →]
└────────────────────────────────┘
```

---

### 3.5 Administration (US-069 à 077)

**Fonctionnalités livrées :**

```
/admin          → Dashboard stats (nb users, nb produits)        [OK]
/admin/users    → Liste utilisateurs (pagination, tri)           [OK]
                → Modification rôle (user ↔ admin)              [OK]
                → Suppression utilisateur                        [OK]
/admin/products → Liste produits (pagination, filtre catégorie) [OK]
                → Modification produit (infos + specs)          [OK]
                → Suppression produit                           [OK]
                → Création produit                              [ABSENT]
                → Gestion prix                                   [ABSENT]
```

**Capture d'écran simulée — Page admin Produits :**
```
┌──────────────────────────────────────────────────────────┐
│ PC Aeris Admin                          [Dashboard User] │
├──────────┬───────────────────────────────────────────────┤
│ Dashboard│  Produits                    [+ Nouveau]      │
│ Users    │                                               │
│ Produits │  Catégorie : [Toutes ▾]  Rechercher...       │
│          │                                               │
│          │  ┌────────────────────────────────────────┐  │
│          │  │ Nom          Catégorie  Actions         │  │
│          │  ├──────────────────────────────────────  │  │
│          │  │ i9-14900K    CPU        [Edit] [Suppr]  │  │
│          │  │ RTX 4090     GPU        [Edit] [Suppr]  │  │
│          │  │ Z790 Hero    Carte mère [Edit] [Suppr]  │  │
│          │  └────────────────────────────────────────┘  │
│          │  (247 produits • Page 1/5)                   │
└──────────┴───────────────────────────────────────────────┘
```

---

### 3.6 Scripts d'import produits (hors backlog user)

```
scripts/
├── import-buildcores.mjs    → Import produits depuis BuildCores API
└── fetch-images-bestbuy.mjs → Récupération images depuis BestBuy
```

Ces scripts ont permis de peupler la base de données avec un catalogue initial de composants PC.

---

## 4. Ce qui n'a pas été livré

### Bug : Connexion par pseudo (US-015)
**Raison :** La logique de résolution pseudo → email n'a pas été implémentée lors du développement initial de l'auth. Une valeur hardcodée retourne une erreur. Ce bug sera corrigé en Sprint 2.

**Impact :** Les utilisateurs ne peuvent pas se connecter avec leur pseudo, uniquement avec leur email.

### Fonctionnel absent : Création de produit en admin (US-078)
**Raison :** L'interface admin Produits a été développée avec focus sur l'édition et la suppression. La création via UI n'a pas été priorisée car un script d'import couvrait ce besoin temporairement.

**Impact :** L'administrateur ne peut pas créer de nouveaux produits via l'interface — il doit utiliser les scripts ou l'interface Supabase directement.

### Fonctionnel absent : Prix des produits (US-079)
**Raison :** La base de données ne contient pas de colonne prix. Ce champ a été identifié comme critique mais pas encore implémenté.

**Impact :** Le configurateur n'affiche aucun prix, ce qui limite fortement la valeur commerciale démontrée.

### Absence de tests (US-086, 087)
**Raison :** Sous la pression du développement des fonctionnalités, les tests ont été déprioritisés. La base de code est à 0% de couverture.

**Impact :** Risque de régression élevé sur les prochains sprints, notamment sur la logique de compatibilité.

### Page profil (US-061)
**Raison :** La route `/profile` existe dans le router mais retourne un `<div>Page Profil (TODO)</div>`.

**Impact :** Les utilisateurs connectés ne peuvent pas accéder à leurs informations personnelles.

---

## 5. Rétrospective

### Ce qui a bien marché

**Architecture solide dès le départ**
Le choix de séparer les services (authService, adminService), de typer strictement avec TypeScript et de créer une couche d'abstraction Supabase s'est révélé payant. Les évolutions sont faciles à ajouter sans casser l'existant.

**Design system cohérent**
Avoir investi tôt dans un design system complet (17 composants) permet maintenant de construire rapidement de nouvelles pages sans réinventer les composants de base. La cohérence visuelle est assurée.

**Configurateur fonctionnel rapidement**
La logique de compatibilité CPU/MB/RAM est déjà opérationnelle et basée sur de vraies données en BDD. C'est la fonctionnalité centrale et elle fonctionne.

**CI/CD opérationnel**
Le pipeline de déploiement automatique sur Vercel (preview par PR, production sur main) permet d'itérer rapidement et de tester dans un environnement proche de la production.

**Scripts d'import**
Les scripts BuildCores et BestBuy ont permis de peupler la base rapidement avec de vrais produits, évitant de passer du temps sur la saisie manuelle.

---

### Ce qui peut être amélioré

**0 tests — dette technique majeure**
Aucun test unitaire, d'intégration ou E2E n'a été écrit. C'est le risque le plus important pour la suite. Les prochains sprints devront allouer du temps aux tests.

**Action Sprint 2 :** Configurer Vitest et écrire les premiers tests unitaires sur la logique de compatibilité.

**Design/UX non défini**
Les pages fonctionnent mais n'ont pas de vrai design. La page d'accueil est un placeholder, le configurateur est fonctionnel mais visuellement brut.

**Action Sprint 2 :** Travailler sur le design de la page d'accueil et du configurateur avant d'ajouter de nouvelles features.

**Pas de feedback utilisateur (toasts)**
Les actions importantes (connexion, erreur, sauvegarde) ne donnent pas de feedback visuel clair. L'expérience est déceptive.

**Action Sprint 2 :** Implémenter le système de toasts globaux.

**Bus facteur / documentation**
Le projet est solo et sans documentation. Si le contexte est perdu, il est difficile de reprendre.

**Action en cours :** Ce document agile répond partiellement à ce besoin.

---

## 6. Objectifs Sprint 2

### Objectif principal
**Corriger les bugs critiques et améliorer la qualité de l'expérience utilisateur.**

### Stories ciblées

| ID | User Story | Points | Priorité |
|---|---|---|---|
| US-015 | Correction bug connexion par pseudo | 3 | Critique |
| US-084 | Toast notifications globales | 3 | Haute |
| US-002 | Hero banner avec CTA configurateur | 3 | Haute |
| US-085 | Page 404 personnalisée | 2 | Moyenne |
| — | Refactorisation page d'accueil (supprimer le profil hardcodé) | 2 | Haute |
| — | Responsive partiel : pages auth et home | 3 | Haute |

**Total estimé : ~16 points**

### Definition of Done du Sprint 2
- [ ] Le bug de connexion par pseudo est corrigé et testé
- [ ] Les toasts sont intégrés dans toutes les actions clés
- [ ] La page d'accueil a un vrai contenu (pas de dump des données user)
- [ ] La page 404 est opérationnelle
- [ ] Aucune régression introduite sur les fonctionnalités du Sprint 1

---

## 7. Métriques du projet à date

| Métrique | Valeur |
|---|---|
| Lignes de code (TypeScript/TSX) | ~4 500 |
| Composants React | ~35 |
| Routes | 10 |
| Tables Supabase | 12 |
| Produits en base | ~500 (estimation) |
| Couverture de tests | 0% |
| Score Lighthouse Performance | Non mesuré |
| Score Lighthouse Accessibilité | Non mesuré |
| Déploiements Vercel | ~15 (estimation) |
