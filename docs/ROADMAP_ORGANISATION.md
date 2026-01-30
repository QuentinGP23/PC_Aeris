# Roadmap & Organisation opérationnelle — PC Aeris

---

## 1. Roadmap produit

### Vue d'ensemble

```
2026                                          2027                    2028
│                                             │                       │
├─── T1 ────┼─── T2 ────┼─── T3 ────┼─── T4 ──┼─── T1-T2 ───┼─── T3+ ─┤
│           │           │           │         │             │         │
│   MVP     │    V1     │   V1.5    │   V2    │  CROISSANCE │ EXPAND  │
│           │           │           │         │             │         │
└───────────┴───────────┴───────────┴─────────┴─────────────┴─────────┘
```

---

### Phase 1 : MVP (T1 2026)

**Objectif** : Valider le concept avec un produit fonctionnel minimum.

| Fonctionnalité                                     | Priorité     | État        |
| -------------------------------------------------- | ------------ | ----------- |
| Architecture technique (React/TypeScript/Vite)     | 🔴 Critique  | ✅ Fait     |
| Système d'authentification (inscription/connexion) | 🔴 Critique  | ✅ Fait     |
| Composants UI de base (Button, Input, Form)        | 🔴 Critique  | ✅ Fait     |
| Structure routing                                  | 🔴 Critique  | ✅ Fait     |
| Base de données composants (structure)             | 🔴 Critique  | 🔄 En cours |
| Configurateur basique (sélection manuelle)         | 🔴 Critique  | ⏳ À faire  |
| Page produit composant                             | 🟡 Important | ⏳ À faire  |
| Panier / Récapitulatif configuration               | 🟡 Important | ⏳ À faire  |

**Livrable** : Configurateur fonctionnel sans IA, utilisable en beta fermée.

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

## 3. Planning détaillé T1-T2 2026

### Janvier - Février 2026

| Semaine | Objectifs                                    |
| ------- | -------------------------------------------- |
| S1-S2   | Finaliser architecture, auth, composants UI  |
| S3-S4   | Structure BDD composants, modèles de données |
| S5-S6   | Configurateur v0 (sélection manuelle)        |
| S7-S8   | Pages produits, filtres, recherche           |

### Mars - Avril 2026

| Semaine | Objectifs                                 |
| ------- | ----------------------------------------- |
| S9-S10  | Panier, récapitulatif, tunnel de commande |
| S11-S12 | Intégration paiement (Stripe)             |
| S13-S14 | Tests, corrections, beta fermée           |
| S15-S16 | Retours beta, ajustements                 |

### Mai - Juin 2026

| Semaine | Objectifs                         |
| ------- | --------------------------------- |
| S17-S18 | IA compatibilité v1               |
| S19-S20 | Système de prix (API ou scraping) |
| S21-S22 | Questionnaire guidé débutants     |
| S23-S24 | Lancement V1 publique 🚀          |

---

_Document de travail — PC Aeris — Janvier 2026_
