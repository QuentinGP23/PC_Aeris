# Roadmap & Organisation opérationnelle — PC Aeris

> **Dernière mise à jour :** 29 mai 2026
> **Source de vérité fine sur les sprints :** [docs/agile/roadmap.md](./agile/roadmap.md)

---

## 1. Roadmap produit

### Vue d'ensemble

```
2026                                          2027                    2028
│                                             │                       │
├ T1 ─┼ T2 ─┼ T3 ─┼ T4 ─┼─ T1-T2 ─┼─ T3+ ─┤
│     │     │     │     │         │       │
│ MVP │ V1  │V1.5 │ V2  │CROIS    │ EXPAND│
│     │     │     │     │         │       │
└─────┴─────┴─────┴─────┴─────────┴───────┘
```

État réel au 29 mai 2026 : **MVP atteint à ~85 %**, finalisation en juin (Sprint 5 reste).

---

### Phase 1 : MVP (T1-T2 2026) — ~85% atteint

**Objectif** : Valider le concept avec un produit fonctionnel minimum.

| Fonctionnalité                                     | Priorité     | État        |
| -------------------------------------------------- | ------------ | ----------- |
| Architecture technique (React/TypeScript/Vite)     | 🔴 Critique  | ✅ Fait     |
| Système d'authentification (inscription/connexion) | 🔴 Critique  | ✅ Fait     |
| Composants UI de base (Button, Input, Form)        | 🔴 Critique  | ✅ Fait     |
| Structure routing                                  | 🔴 Critique  | ✅ Fait     |
| Base de données composants (structure complète)    | 🔴 Critique  | ✅ Fait     |
| Configurateur avec compatibilité (8 catégories)    | 🔴 Critique  | ✅ Fait     |
| Ordre verrouillé + cascade d'invalidation          | 🔴 Critique  | ✅ Fait     |
| Page produit composant                             | 🟡 Important | ✅ Fait     |
| Configurations sauvegardées (CRUD)                 | 🟡 Important | ✅ Fait (avancé V1→MVP) |
| Back-office admin (CRUD produits + édition prix)   | 🟡 Important | ✅ Fait     |
| Tests automatisés (67 unitaires + intégration)     | 🟡 Important | ✅ Fait     |
| Identité visuelle Aeris Dark (RGAA AA)             | 🟡 Important | ✅ Fait     |
| Affichage UI prix dans catalogue/configurateur     | 🔴 Critique  | 🔄 Sprint 5 (juin) — UI à faire, données bloquées par credentials API |
| Responsive mobile (pages principales)              | 🟡 Important | ⏳ Sprint 5 |

**Livrable** : Configurateur fonctionnel avec compatibilité vérifiée, utilisable en beta fermée. **IA non incluse** (V2).

---

### Phase 2 : V1 (T2-T3 2026)

**Objectif** : Lancer la première version publique avec les fonctionnalités clés.

| Fonctionnalité                | Priorité     | Détail                                                          |
| ----------------------------- | ------------ | --------------------------------------------------------------- |
| IA de compatibilité           | 🔴 Critique  | Suggestions automatiques basées sur les composants sélectionnés |
| Système de prix (fourchettes) | 🔴 Critique  | Intégration API prix ou scraping                                |
| Questionnaire guidé           | 🔴 Critique  | Parcours débutant : usage → budget → config recommandée         |
| Espace client                 | 🟡 Important | Historique, configurations sauvegardées                         |
| Système de commande           | 🔴 Critique  | Tunnel de commande, paiement                                    |
| Back-office admin             | 🟡 Important | Gestion produits, commandes, utilisateurs                       |
| Responsive mobile             | 🟡 Important | Adaptation complète mobile/tablette                             |

**Livrable** : Plateforme publique, premières commandes réelles.

---

### Phase 3 : V1.5 (T4 2026)

**Objectif** : Améliorer l'expérience et fidéliser.

| Fonctionnalité                | Priorité        | Détail                                   |
| ----------------------------- | --------------- | ---------------------------------------- |
| Alertes prix                  | 🟡 Important    | Notification quand un composant baisse   |
| Comparateur de configurations | 🟢 Nice-to-have | Comparer 2-3 configs côte à côte         |
| Partage de configuration      | 🟡 Important    | Lien public, intégration réseaux sociaux |
| Avis et notes                 | 🟢 Nice-to-have | Retours utilisateurs sur les configs     |
| Programme parrainage          | 🟢 Nice-to-have | Récompenses pour recommandations         |
| Optimisations performances    | 🟡 Important    | Temps de chargement, SEO technique       |

**Livrable** : Plateforme enrichie, début de communauté.

---

### Phase 4 : V2 (2027)

**Objectif** : Scaler et diversifier.

| Fonctionnalité                     | Priorité        | Détail                              |
| ---------------------------------- | --------------- | ----------------------------------- |
| Application mobile (PWA ou native) | 🟡 Important    | Consultation, suivi commandes       |
| Abonnement Pro                     | 🟢 Nice-to-have | Fonctionnalités avancées payantes   |
| Intégration occasion               | 🟡 Important    | Prix et dispo composants d'occasion |
| API partenaires                    | 🟢 Nice-to-have | Intégration avec revendeurs         |
| Multi-langue                       | 🟢 Nice-to-have | Expansion Europe (EN, DE, ES)       |

**Livrable** : Plateforme mature, revenus diversifiés.

---

## 2. Organisation opérationnelle

### Structure de l'équipe

#### Phase de lancement (2026)

```
┌─────────────────────────────────────────┐
│              FONDATEUR                  │
│      (Vision, Stratégie, Commercial)    │
└─────────────────┬───────────────────────┘
                  │
    ┌─────────────┼─────────────┐
    │             │             │
    ▼             ▼             ▼
┌───────┐   ┌───────────┐   ┌──────────┐
│  DEV  │   │  HARDWARE │   │ EXTERNE  │
│       │   │  EXPERT   │   │          │
│ Full- │   │           │   │ Comptable│
│ stack │   │ BDD, IA,  │   │ Juridique│
│       │   │ Compat.   │   │          │
└───────┘   └───────────┘   └──────────┘
 Associé     Temps partiel   Prestataires
 ou salarié  ou freelance
```

| Rôle                | Responsabilités                                          | Statut             | Charge   |
| ------------------- | -------------------------------------------------------- | ------------------ | -------- |
| **Fondateur**       | Vision, stratégie, marketing, commercial, support client | Temps plein        | 100%     |
| **Développeur**     | Plateforme, IA, maintenance, évolutions                  | Associé ou salarié | 100%     |
| **Expert hardware** | Base de données, règles compatibilité, veille tech       | Freelance          | 20-40%   |
| **Comptable**       | Comptabilité, déclarations                               | Prestataire        | Ponctuel |
| **Juridique**       | CGV, RGPD, contrats                                      | Prestataire        | Ponctuel |

---

#### Phase de croissance (2027+)

```
┌─────────────────────────────────────────┐
│              DIRECTION                  │
└─────────────────┬───────────────────────┘
                  │
    ┌─────────────┼─────────────┬─────────────┐
    │             │             │             │
    ▼             ▼             ▼             ▼
┌───────┐   ┌───────────┐   ┌──────────┐  ┌──────────┐
│  TECH │   │  PRODUIT  │   │MARKETING │  │ SUPPORT  │
│       │   │           │   │          │  │          │
│ 2 dev │   │ 1 product │   │ 1 growth │  │ 1 support│
│       │   │  + expert │   │          │  │          │
└───────┘   └───────────┘   └──────────┘  └──────────┘
```

---

### Processus opérationnels

#### Cycle de commande

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  CLIENT  │    │  CONFIG  │    │ COMMANDE │    │ASSEMBLAGE│    │LIVRAISON │
│  arrive  │───►│  créée   │───►│ validée  │───►│  + tests │───►│  client  │
└──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘
                     │               │               │
                     ▼               ▼               ▼
               Sauvegarde      Paiement        Sous-traitant
               possible        sécurisé        ou interne
```

| Étape               | Responsable                  | Délai cible           | Outils             |
| ------------------- | ---------------------------- | --------------------- | ------------------ |
| Configuration       | Client (autonome)            | —                     | Configurateur      |
| Validation commande | Automatique + vérif manuelle | < 24h                 | Back-office        |
| Sourcing composants | Fondateur / Partenaire       | 2-5 jours             | Fournisseurs       |
| Assemblage          | Partenaire ou interne        | 1-3 jours             | Atelier partenaire |
| Tests qualité       | Assembleur                   | 1 jour                | Checklist QC       |
| Expédition          | Logisticien                  | 1-2 jours             | Transporteur       |
| **Total**           |                              | **5-10 jours ouvrés** |                    |

---

#### Support client

| Canal                       | Disponibilité   | Outil                     |
| --------------------------- | --------------- | ------------------------- |
| Email                       | 24-48h réponse  | Helpdesk (Crisp, Zendesk) |
| Chat en ligne               | Horaires bureau | Intégré site              |
| FAQ / Base de connaissances | 24/7            | Site web                  |
| Réseaux sociaux             | Best effort     | Twitter/X, Discord        |

**Politique SAV** :

- Garantie légale 2 ans
- Retours sous 14 jours (droit de rétractation)
- Support technique post-achat inclus

---

### Environnement technique

#### Stack technologique

| Couche              | Technologie                            | Justification                           |
| ------------------- | -------------------------------------- | --------------------------------------- |
| **Frontend**        | React + TypeScript + Vite              | Performance, maintenabilité, écosystème |
| **Styling**         | SCSS + Design system maison            | Flexibilité, cohérence                  |
| **Backend**         | Node.js / Express ou Supabase          | Simplicité, scalabilité                 |
| **Base de données** | PostgreSQL                             | Robustesse, requêtes complexes          |
| **Auth**            | Supabase Auth ou Auth0                 | Sécurité, OAuth intégré                 |
| **Hébergement**     | Vercel (front) + Railway/Render (back) | CI/CD intégré, coût maîtrisé            |
| **Paiement**        | Stripe                                 | Standard du marché, fiable              |
| **Analytics**       | Plausible ou Matomo                    | RGPD-friendly                           |
| **Monitoring**      | Sentry                                 | Erreurs en temps réel                   |

---

#### Infrastructure

```
┌─────────────────────────────────────────────────────────────┐
│                         INTERNET                            │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   CLOUDFLARE    │
                    │   (CDN + DNS)   │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
     ┌─────────────────┐          ┌─────────────────┐
     │     VERCEL      │          │  RAILWAY/RENDER │
     │   (Frontend)    │          │    (Backend)    │
     │                 │          │                 │
     │  React App      │◄────────►│  API Node.js    │
     └─────────────────┘          └────────┬────────┘
                                           │
                                           ▼
                                  ┌─────────────────┐
                                  │   POSTGRESQL    │
                                  │   (Database)    │
                                  └─────────────────┘
                                           │
                                           ▼
                                  ┌─────────────────┐
                                  │    SUPABASE     │
                                  │  (Auth + Store) │
                                  └─────────────────┘
```

---

#### Environnements

| Environnement  | Usage         | URL                |
| -------------- | ------------- | ------------------ |
| **Local**      | Développement | localhost:5173     |
| **Staging**    | Tests, démo   | staging.pcaeris.fr |
| **Production** | Public        | www.pcaeris.fr     |

---

### Workflow de développement

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  ISSUE   │    │  BRANCH  │    │   CODE   │    │   PR     │
│  créée   │───►│  feature │───►│  + tests │───►│  review  │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                                                      │
┌──────────┐    ┌──────────┐    ┌──────────┐          │
│  DEPLOY  │◄───│  MERGE   │◄───│ APPROVED │◄─────────┘
│  auto    │    │  main    │    │          │
└──────────┘    └──────────┘    └──────────┘
```

| Outil                 | Usage                   |
| --------------------- | ----------------------- |
| **GitHub**            | Versioning, issues, PRs |
| **GitHub Actions**    | CI/CD automatisé        |
| **ESLint + Prettier** | Qualité code            |
| **Vitest**            | Tests unitaires         |
| **Playwright**        | Tests E2E (futur)       |

---

### Indicateurs de suivi opérationnel

| Catégorie     | KPI                   | Objectif        |
| ------------- | --------------------- | --------------- |
| **Technique** | Uptime                | > 99,5%         |
| **Technique** | Temps de réponse API  | < 200ms         |
| **Technique** | Erreurs JS (Sentry)   | < 0,1% sessions |
| **Commandes** | Délai moyen livraison | < 10 jours      |
| **Commandes** | Taux de retour        | < 5%            |
| **Support**   | Temps réponse email   | < 24h           |
| **Support**   | Satisfaction (NPS)    | > 40            |

---

## 3. Planning détaillé (état réel + prévisionnel révisé)

### Janvier – Mars 2026 — Sprint 1 ✅
Architecture, auth, design system (17 composants UI), configurateur de base avec compatibilité CPU/MOBO/RAM/Ventirad, admin CRUD utilisateurs + produits (edit/delete), scripts d'import BuildCores/BestBuy. **~57 points livrés.**

### Avril 2026 — Sprints 2, 3, 4 ✅ + travaux hors sprint
- **17 avril (Sprint 2)** : fix bug login pseudo, toasts globaux, hero banner home, refactor home, scaffolding multi-sources prix.
- **17-20 avril (Sprint 3)** : compatibilité GPU/PSU, boîtier/format mobo, stockage M.2/SATA, setup Vitest + 27 tests.
- **20 avril (Sprint 4)** : création produit admin, édition prix, 15 tests d'intégration.
- **Hors sprint** : page profil utilisateur (US-061, 062), page 404 (US-085), fiche produit publique, enrichissement images.

### Mai 2026 — Polish et features additionnelles 🔄
- **22-29 mai** : refonte design Aeris Dark sur tout le site (RGAA AA), fix ordre verrouillé du configurateur (cascade d'invalidation), nouveaux filtres GPU/cooler vs boîtier, configurations sauvegardées (US-040 à 044 avancées en MVP).

### Juin 2026 — Sprint 5 (reste) pour clore le MVP ⏳
Affichage UI des prix, responsive mobile, tarifs d'assemblage, remember me, modifications profil, recherche utilisateurs admin, images composants.

### Juillet 2026 — Sprint 6 (V1) ⏳
Panier et catalogue amélioré (filtres, fourchettes prix, configurations populaires, usage cible, adresses livraison, graphiques admin).

### Juillet 2026 — Sprint 7 (V1) ⏳
Tunnel de commande : adresse, livraison, Stripe, email confirmation, gestion commandes admin, OAuth Google.

### Août 2026 — Sprint 8 (V1) ⏳
Suivi commande client, partage de configuration par lien, import CSV produits, tests E2E Playwright. **🚀 Lancement V1 publique fin août.**

### Septembre 2026+ — V2
IA recommandation, responsive complet, paiement multi-fois, PayPal, avatar, RGPD, notifications email.

---

_Document de travail — PC Aeris — mis à jour le 29 mai 2026_
