<!-- COVER -->
# PC Aeris

## Le PC sur-mesure, enfin accessible à tous.

**Rapport de projet — Dossier de soutenance M2**

Quentin Geoffroy · Juin 2026

**Démo en production :** https://pc-aeris.vercel.app/
**Code source :** https://github.com/QuentinGP23/PC_Aeris

> Plateforme web de configuration de PC sur-mesure combinant un configurateur à compatibilité garantie, une transparence radicale des prix et une expérience adaptée à chaque profil d'utilisateur.

<!-- ENDCOVER -->

---

# Partie A — Vision & stratégie

## 1. Pitch (5 minutes)

> **Format :** discours rédigé, à prononcer en ~5 minutes (≈ 700 mots). À maîtriser dans les grandes lignes, pas mot pour mot.
> **Audience :** jury M2 dans le rôle de clients, investisseurs et partenaires potentiels.

---

Bonjour. Je vais vous présenter **PC Aeris**, une plateforme qui s'attaque à un problème vécu par des millions de Français : en 2026, acheter un PC adapté à ses besoins reste un parcours du combattant.

Imaginez. Vous voulez un PC pour jouer, ou pour faire du montage vidéo. Vous allez sur LDLC, sur Materiel.net, sur Amazon. Et là, c'est la noyade : des centaines de produits, du jargon partout — socket AM5, DDR5, M.2 NVMe Gen 4. Trois questions vous tombent dessus, et **personne n'y répond simplement**. Première question : est-ce que ces composants sont compatibles entre eux ? Deuxième : est-ce que mon alimentation va suffire pour ma carte graphique ? Troisième : est-ce que je paie le juste prix, ou est-ce qu'on me prend pour une dinde sur un marché où les tarifs bougent chaque semaine ?

Le résultat est documenté : la majorité des acheteurs **abandonnent leur projet**, ou y passent des heures pour finalement faire un mauvais choix. Aujourd'hui, le marché exige du client qu'il devienne lui-même un expert. Notre conviction, c'est exactement l'inverse : **c'est à la plateforme de prendre ces trois questions en charge.**

La promesse de PC Aeris tient en une phrase : *vous nous dites ce que vous voulez faire, et nous nous occupons du reste.* Concrètement, ça repose sur trois piliers. Un, un **moteur de compatibilité** qui filtre automatiquement les composants incompatibles, avant même que la question se pose. Deux, une **transparence radicale des prix**, inspirée de StockX : pour chaque composant, on affiche un prix bas, un prix moyen et un prix haut du marché, neuf comme occasion. Le client voit instantanément si ce qu'on lui propose est compétitif. Cette transparence n'existe chez aucun concurrent francophone aujourd'hui. Trois, des **parcours adaptés à chaque profil** : un questionnaire guidé pour les débutants, un configurateur libre pour les connaisseurs, des PC pré-assemblés pour les pressés. Trois portes d'entrée, une seule promesse : zéro erreur, juste prix.

Et ce n'est pas une maquette. **Le produit existe, en code, en production.** Le configurateur verrouille l'ordre de montage : on choisit le processeur, puis la carte mère filtrée automatiquement sur le bon socket, puis le boîtier selon le format de la carte mère, et ainsi de suite. Si je sélectionne un boîtier Mini-ITX, les cartes mères trop grandes disparaissent immédiatement. On peut sauvegarder sa configuration, la retrouver, la modifier. Et il y a un back-office d'administration complet. Tout est déployé en continu, testé, documenté.

Parlons marché. Le PC en France, c'est **environ 4 milliards d'euros par an**. Notre segment — gaming et workstation — croît de 8 à 10 % par an. Et surtout, **personne n'occupe le créneau du sur-mesure simplifié** : les revendeurs traditionnels parlent technique, Amazon parle prix, mais personne ne parle simplicité. C'est notre quadrant, et il est vide.

Côté modèle économique, notre revenu vient d'**offres de montage à prix fixe** : le client paie les composants au meilleur prix du marché — sans marge de notre part — et choisit une formule de montage (Essentiel 79 €, Confort 129 €, Premium 199 €), soit ~120 € en moyenne par commande ; s'y ajouteront la garantie étendue et un abonnement Pro. Le modèle est **asset-light** : pas de stock, pas de besoin en fonds de roulement lourd. Nos projections sont volontairement prudentes et intègrent une montée en charge : l'année 1 est une phase de lancement sous le seuil de rentabilité (~86 000 € de chiffre d'affaires), suivie de ~240 000 € la deuxième année et ~500 000 € la troisième, portées par le bouche-à-oreille, le SEO et les partenariats créateurs.

Où en est-on ? Le **MVP est fonctionnellement complet**. Sprint 1 : les fondations. Sprints 2 à 4 : la compatibilité complète et les tests automatisés. Mai : la refonte visuelle et les configurations sauvegardées. Il ne reste qu'un reliquat — l'affichage des prix, qui attend des credentials API externes. Le code est prêt à les recevoir.

Aujourd'hui, le projet est porté en solo : stratégie, produit, développement, design, infra. C'était volontaire — je voulais prouver que je pouvais livrer un MVP défendable avant de recruter. Pour la suite, je cherche trois choses : **un amorçage de 35 000 €** pour les douze prochains mois, **100 beta-testeurs** sur nos segments cibles, et des **partenariats** avec des créateurs tech et gaming.

La vision de PC Aeris, c'est de rendre l'achat d'un PC sur-mesure aussi simple qu'une prise de rendez-vous en ligne. Pas plus compliqué que ça. Le produit existe, le modèle est défini, la roadmap est lisible. Il reste à exécuter — et c'est là que j'ai besoin de vous. Merci.

---

## 2. Business Model

### 2.1 Proposition de valeur

| Segment | Valeur délivrée |
|---|---|
| **Débutants** | Accès simplifié au PC sur-mesure sans connaissances techniques |
| **Connaisseurs** | Gain de temps grâce à l'IA de suggestion et compatibilité garantie |
| **Professionnels** | Configurations optimisées pour des usages spécifiques (3D, montage, dev) |
| **Tous** | Transparence des prix (fourchettes marché neuf/occasion) |

**Promesse centrale :** obtenir le PC parfait pour ses besoins — sans stress, sans erreur, au juste prix.

### 2.2 Segments de clientèle

**Cible exclusive : particuliers et professionnels individuels.** PC Aeris ne vend pas en gros. Chaque configuration est unique. Un client peut commander plusieurs PC, mais chaque machine est personnalisée — pas de commandes en lot standardisées.

| Segment | Profil | Budget moyen | Volume potentiel |
|---|---|---|---|
| Gamers débutants | 16-30 ans, premier PC gaming | 800 – 1 500 € | Élevé |
| Gamers confirmés | 20-40 ans, upgrade régulier | 1 500 – 3 000 € | Moyen |
| Créatifs / Freelances | Monteurs, graphistes, développeurs | 1 200 – 2 500 € | Moyen |
| Étudiants tech | Écoles d'ingé, informatique | 600 – 1 200 € | Élevé |
| Professionnels individuels | Indépendants, consultants, auto-entrepreneurs | 1 000 – 2 500 € | Moyen |

> Pas de vente aux entreprises, écoles ou collectivités. Le modèle repose sur des configurations uniques, pas sur du volume standardisé.

### 2.3 Sources de revenus

**Modèle principal — offres de montage à prix fixe :**

Le client paie les composants **au meilleur prix du marché** (sans marge de notre part) **+ une offre de montage à prix fixe**. C'est le montage qui constitue notre revenu, pas un pourcentage prélevé sur les composants. Prix total client = composants + offre de montage.

| Offre | Prix | Inclus |
|---|---|---|
| **Essentiel** | 79 € | Montage, câble management de base, test POST + démarrage Windows |
| **Confort** _(la plus choisie)_ | 129 € | + câblage premium, installation Windows + drivers, profil courbes ventilateurs |
| **Premium** | 199 € | + benchmarks 3DMark/Cinebench, profil XMP/EXPO, rapport de tests livré |

> Revenu moyen par commande ≈ **120 €** (mix des trois offres).

**Revenus complémentaires (à venir) :**

| Source | Description |
|---|---|
| **Garantie étendue** | Extension de garantie sur les PC assemblés (30 – 80 €) |
| **Abonnement Pro** | Alertes prix, historiques, configurations illimitées (5 – 10 €/mois) |
| **Affiliation** | Rémunération éventuelle sur le sourcing des composants |
| **Partenariats marques** | Mise en avant de produits sponsorisés (avec transparence) |

**Projection de revenus (hypothèse prudente) :**

| Année | Commandes/mois | Panier moyen | CA annuel estimé |
|---|---|---|---|
| N+1 | ~6 (montée ~2→~12) | 1 200 € | ~86 000 € |
| N+2 | ~16 | 1 250 € | ~240 000 € |
| N+3 | ~32 | 1 300 € | ~500 000 € |

*Marge brute ≈ l'offre de montage (~10 % du CA, les composants étant vendus à prix coûtant). Croissance conditionnée au bouche-à-oreille et aux partenariats.*

### 2.4 Canaux, relation client et ressources

| Canal | Rôle |
|---|---|
| Site web (responsive) | Canal principal — configurateur, commandes, espace client |
| Application mobile | Phase 2 — consultation, suivi commandes |
| Réseaux sociaux | Acquisition, communauté, contenus éducatifs |
| YouTube / Twitch | Partenariats créateurs gaming/tech |
| SEO / Content marketing | Guides, comparatifs, tutoriels |

| Relation client | Mécanisme |
|---|---|
| Self-service | Configurateur autonome, FAQ, guides |
| Assistance | Chat en ligne, support email |
| Communauté | Forum utilisateurs, partage de configurations |
| Personnalisation | Recommandations basées sur l'historique |

| Ressource clé | Description |
|---|---|
| Plateforme technique | Application web React/TypeScript, backend, IA de suggestion |
| Base de données composants | Référentiel exhaustif avec specs, compatibilités, prix |
| Algorithme de compatibilité | Moteur de règles + IA pour suggestions intelligentes |
| Réseau fournisseurs | Accès aux grossistes et marketplaces |

### 2.5 Partenaires, coûts et avantages durables

| Partenaire clé | Rôle |
|---|---|
| Grossistes hardware | Approvisionnement composants (Ingram Micro, Also) |
| Marketplaces | Comparaison prix, affiliation (Amazon, LDLC, Materiel.net) |
| Créateurs de contenu | Visibilité, crédibilité (YouTubers tech/gaming) |
| Prestataires logistiques | Livraison, gestion stocks |
| Assembleurs partenaires | Sous-traitance assemblage si besoin |

**Structure de coûts :** coûts fixes maîtrisés (infra cloud 200-500 €/mois, SaaS 100-300 €/mois, marketing 500-2 000 €/mois) ; coûts variables dominés par le coût des composants (80-88 % du CA), logistique (2-4 %), frais de paiement (1,5-2,5 %), SAV (1-2 %).

| Avantage concurrentiel | Barrière à l'entrée |
|---|---|
| IA de compatibilité | Temps de développement + données propriétaires |
| Transparence prix | Intégration multi-sources complexe |
| UX simplifiée | Design thinking + itérations utilisateurs |
| Communauté | Effet réseau, configurations partagées |
| Marque de confiance | Réputation à construire dans la durée |

### 2.6 Synthèse — Business Model Canvas

```
┌─────────────────┬─────────────────┬─────────────────┐
│   PARTENAIRES   │    ACTIVITÉS    │   PROPOSITION   │
│                 │                 │    DE VALEUR    │
│ • Grossistes    │ • Dev produit   │                 │
│ • Marketplaces  │ • Curation data │ PC sur-mesure   │
│ • Créateurs     │ • Acquisition   │ simplifié,      │
│ • Logisticiens  │ • Commandes     │ transparent,    │
│                 │ • Support       │ garanti         │
├─────────────────┼─────────────────┼─────────────────┤
│   RESSOURCES    │                 │    RELATION     │
│ • Plateforme    │                 │     CLIENT      │
│ • BDD composants│                 │ • Self-service  │
│ • Algo IA       │                 │ • Chat/Support  │
│ • Équipe        │                 │ • Communauté    │
├─────────────────┴─────────────────┼─────────────────┤
│        STRUCTURE DE COÛTS         │     REVENUS     │
│ • Infra technique (5%)            │ • Commission    │
│ • Marketing (10-15%)              │   ventes (12%)  │
│ • Équipe (variable)               │ • Assemblage    │
│ • Coût composants (80-88%)        │ • Abo Pro       │
│                                   │ • Partenariats  │
└───────────────────────────────────┴─────────────────┘
```

---

## 3. Étude de marché

> Synthèse en 2 pages : SWOT, PESTEL et 5 forces de Porter.

### 3.1 Analyse SWOT

| **FORCES** | **FAIBLESSES** |
|------------|----------------|
| Proposition de valeur unique (sur-mesure simplifié) | Notoriété à construire de zéro |
| Transparence des prix (différenciation forte) | Marges faibles sur le hardware |
| IA de compatibilité (barrière technologique) | Dépendance aux fournisseurs tiers |
| UX adaptée à tous les niveaux | Pas d'économies d'échelle (pas de vente en gros) |
| Pas de stock = pas de BFR élevé | Équipe réduite au lancement |

| **OPPORTUNITÉS** | **MENACES** |
|------------------|-------------|
| Croissance du marché gaming (+8-10 %/an) | Concurrence des acteurs établis (LDLC, Amazon) |
| Démocratisation du PC pour créatifs/streamers | Volatilité des prix des composants |
| Essor du télétravail (besoin de workstations) | Pénuries de composants (GPU, etc.) |
| Méfiance croissante envers les PC pré-assemblés | Guerre des prix sur le hardware |
| Génération Z habituée au sur-mesure digital | Évolution technologique rapide |

### 3.2 Analyse PESTEL

| Facteur | Impact sur PC Aeris |
|---------|---------------------|
| **Politique** | Favorable — soutien aux startups tech (BPI, French Tech), réglementation e-commerce stable. |
| **Économique** | Vigilance — inflation = arbitrage budgétaire ; mais le gaming reste prioritaire. Marché FR ~4 Mds €/an. |
| **Socioculturel** | Favorable — gaming mainstream, esports en croissance, attente de personnalisation et de transparence. |
| **Technologique** | Favorable — IA accessible, outils low-code, évolution rapide des composants = besoin de conseil. |
| **Écologique** | Opportunité — pression sur l'obsolescence ; intégrer l'occasion, promouvoir la durabilité. |
| **Légal** | Cadre clair — garantie légale 2 ans, RGPD à respecter pour les données utilisateurs. |

**Synthèse :** environnement globalement favorable, avec des opportunités sur la transparence et l'éco-responsabilité, et une vigilance sur le facteur économique.

### 3.3 Les 5 forces de Porter

| Force | Intensité | Analyse |
|-------|-----------|---------|
| **Pouvoir des fournisseurs** | Élevé | Marché concentré (Intel, AMD, Nvidia), pénuries récurrentes, peu de marge de négociation. |
| **Pouvoir des clients** | Élevé | Clients informés, comparent les prix, faible coût de changement, sensibilité prix forte. |
| **Menace des nouveaux entrants** | Moyenne | Barrières techniques (IA, BDD) mais peu de barrières capitalistiques. |
| **Menace des substituts** | Moyenne | Portables gaming, consoles, cloud gaming ; le PC fixe reste supérieur en perf/prix. |
| **Intensité concurrentielle** | Élevée | LDLC, Materiel.net, TopAchat, Amazon ; mais peu d'acteurs sur le « sur-mesure simplifié ». |

**Positionnement stratégique :** multi-sourcing face aux fournisseurs ; transparence et UX différenciante face aux clients ; avance technologique et effet réseau face aux entrants ; ciblage des usages où le PC fixe excelle face aux substituts ; éviter la guerre des prix en se positionnant sur la valeur ajoutée.

**Conclusion.** Marché porteur (~4 Mds €, en croissance sur le gaming/workstation), environnement favorable, concurrence intense **mais créneau « sur-mesure simplifié » peu exploité**. Clé de succès : la différenciation par l'UX, la transparence et l'IA. *PC Aeris se positionne sur une niche stratégique : le sur-mesure accessible, là où les géants sont absents.*

---

## 4. Business plan (succinct)

### 4.1 Executive summary

| Élément | Description |
|---|---|
| **Problème** | Acheter un PC adapté est complexe, chronophage et source d'erreurs |
| **Solution** | Plateforme tout-en-un : questionnaire, configurateur IA, prix transparents |
| **Cible** | Particuliers et professionnels individuels (gamers, créatifs, étudiants) |
| **Modèle économique** | Offres de montage à prix fixe (79–199 €), composants à prix coûtant ; services à venir (garantie, abonnement Pro) |
| **Différenciation** | Compatibilité garantie par IA + fourchettes de prix marché |

**Vision :** permettre à chacun d'obtenir le PC parfait pour ses besoins — sans stress, sans erreur, au juste prix. **Mission :** simplifier l'achat de PC sur-mesure grâce à la technologie et la transparence. **Valeurs :** simplicité, transparence, expertise.

### 4.2 Produits et services

| Offre | Description | Cible |
|---|---|---|
| Questionnaire guidé | Quelques questions → configuration recommandée | Débutants |
| Configurateur IA | Sélection composants avec suggestions intelligentes | Connaisseurs |
| PC prêts à l'emploi | Configurations assemblées et testées | Tous |
| Service d'assemblage | Montage par nos soins (79-199 €) | Option |
| Garantie étendue | Extension de garantie sur PC assemblés | Option |

### 4.3 Positionnement concurrentiel

| Concurrent | Forces | Faiblesses |
|---|---|---|
| LDLC / Materiel.net | Notoriété, catalogue large | UX technique, pas de conseil IA |
| TopAchat | Prix compétitifs | Interface datée |
| Amazon | Logistique, prix | Pas de conseil, jungle de produits |
| Configurateurs marques | Intégration verticale | Limités à une marque |

```
          EXPERTISE
              ▲
              │
    LDLC      │      ★ PC AERIS
 Materiel.net │
              │
 ─────────────┼─────────────► SIMPLICITÉ
              │
   TopAchat   │    PC pré-montés
              │     (grande distrib)
```

**PC Aeris occupe le quadrant inexploité : expertise + simplicité.**

### 4.4 Projections financières

| Année | Commandes/mois | Panier moyen | CA annuel | Marge brute |
|---|---|---|---|---|
| N+1 | ~6 (montée) | 1 200 € | ~86 K€ | 10 – 13 K€ |
| N+2 | ~16 | 1 250 € | ~240 K€ | 29 – 36 K€ |
| N+3 | ~32 | 1 300 € | ~500 K€ | 60 – 75 K€ |

*Hypothèses conservatrices pour une marque sans notoriété initiale. Croissance portée par le bouche-à-oreille, le SEO et les partenariats créateurs.*

### 4.5 Stratégie marketing

| Canal | Actions | Budget estimé |
|---|---|---|
| SEO | Guides, comparatifs, tutoriels | Temps + 200 €/mois outils |
| Réseaux sociaux | TikTok, Instagram, X | 500 €/mois |
| YouTube/Twitch | Partenariats créateurs tech/gaming | 1 000 €/mois |
| Communauté | Discord, forum, partage configs | Temps |

**Fidélisation :** espace client personnalisé, alertes prix, programme de parrainage, newsletter tech.

### 4.6 Besoins de financement (amorçage 6-12 mois)

| Poste | Montant |
|---|---|
| Développement plateforme | 15 000 € |
| Marketing lancement | 10 000 € |
| Infrastructure technique | 3 000 € |
| Juridique / Comptabilité | 2 000 € |
| Trésorerie / Imprévus | 5 000 € |
| **Total** | **35 000 €** |

**Sources envisagées :** apport personnel, love money, prêt d'honneur (Réseau Entreprendre, Initiative France), BPI France, concours startups.

### 4.7 KPIs et risques

| Catégorie | KPI | Objectif N+1 |
|---|---|---|
| Acquisition | Visiteurs uniques/mois | 10 000 |
| Conversion | Taux de conversion | 0,5 % |
| Satisfaction | NPS | > 40 |
| Financier | CA mensuel moyen | ~7 000 € (N+1, en montée de charge) |
| Rétention | Taux de recommandation | 30 % |

| Risque | Probabilité | Impact | Mitigation |
|---|---|---|---|
| Faible notoriété | Élevée | Élevé | Marketing digital, partenariats |
| Marges insuffisantes | Moyenne | Élevé | Services à valeur ajoutée |
| Pénurie composants | Moyenne | Moyen | Multi-sourcing, alertes |
| Concurrence accrue | Moyenne | Moyen | Différenciation UX/IA |
| Défaillance technique | Faible | Élevé | Tests, monitoring, backups |

**Forces du projet :** niche peu exploitée, modèle asset-light, technologie différenciante, fondations techniques opérationnelles. **Prochaines étapes :** finaliser le MVP, recruter les premiers beta-testeurs, itérer, lancer la V1 commerciale.

---

# Partie B — Organisation & équipe

## 5. Roadmap & environnement opérationnel

### 5.1 Roadmap produit — vue d'ensemble

```
2026                                          2027              2028
│                                             │                 │
├ T1 ─┼ T2 ─┼ T3 ─┼ T4 ─┼── T1-T2 ──┼─ T3+ ─┤
│ MVP │ V1  │V1.5 │ V2  │ CROISSANCE │EXPAND │
└─────┴─────┴─────┴─────┴────────────┴───────┘
```

État au 1ᵉʳ juin 2026 : **MVP fonctionnellement complet** ; lancement de la V1 publique visé fin août 2026.

**Phase 1 — MVP (T1-T2 2026).** Architecture React/TypeScript/Vite, authentification complète, design system (17 composants), base de données composants, configurateur avec compatibilité sur 8 catégories, ordre verrouillé + cascade d'invalidation, page produit, configurations sauvegardées, back-office admin (CRUD + prix), 67 tests automatisés, identité Aeris Dark (RGAA AA). **Reliquat :** affichage UI des prix (données dépendantes de credentials API).

**Phase 2 — V1 (T2-T3 2026).** IA de compatibilité, système de prix (fourchettes), questionnaire guidé, espace client, tunnel de commande + paiement, responsive mobile complet.

**Phase 3 — V1.5 (T4 2026).** Alertes prix, comparateur de configs, partage de configuration, avis et notes, programme de parrainage, optimisations performances/SEO.

**Phase 4 — V2 (2027).** Application mobile (PWA/native), abonnement Pro, intégration occasion, API partenaires, multi-langue (EN/DE/ES).

### 5.2 Organisation opérationnelle — équipe

```
Phase de lancement (2026)
┌─────────────────────────────────────────┐
│              FONDATEUR                   │
│      (Vision, Stratégie, Commercial)     │
└─────────────────┬───────────────────────┘
    ┌─────────────┼─────────────┐
    ▼             ▼             ▼
┌───────┐   ┌───────────┐   ┌──────────┐
│  DEV  │   │  HARDWARE │   │ EXTERNE  │
│ Full- │   │  EXPERT   │   │ Comptable│
│ stack │   │ BDD, IA   │   │ Juridique│
└───────┘   └───────────┘   └──────────┘
```

| Rôle | Responsabilités | Statut | Charge |
|---|---|---|---|
| Fondateur | Vision, stratégie, marketing, commercial, support | Temps plein | 100 % |
| Développeur | Plateforme, IA, maintenance, évolutions | Associé ou salarié | 100 % |
| Expert hardware | BDD, règles compatibilité, veille tech | Freelance | 20-40 % |
| Comptable | Comptabilité, déclarations | Prestataire | Ponctuel |
| Juridique | CGV, RGPD, contrats | Prestataire | Ponctuel |

### 5.3 Processus opérationnel — cycle de commande

```
┌────────┐  ┌────────┐  ┌────────┐  ┌──────────┐  ┌──────────┐
│ CLIENT │─►│ CONFIG │─►│COMMANDE│─►│ASSEMBLAGE│─►│ LIVRAISON│
│ arrive │  │ créée  │  │ validée│  │ + tests  │  │  client  │
└────────┘  └────────┘  └────────┘  └──────────┘  └──────────┘
```

| Étape | Responsable | Délai cible |
|---|---|---|
| Configuration | Client (autonome) | — |
| Validation commande | Auto + vérif manuelle | < 24h |
| Sourcing composants | Fondateur / Partenaire | 2-5 jours |
| Assemblage | Partenaire ou interne | 1-3 jours |
| Tests qualité | Assembleur | 1 jour |
| Expédition | Logisticien | 1-2 jours |
| **Total** | | **5-10 jours ouvrés** |

**Politique SAV :** garantie légale 2 ans, retours sous 14 jours (droit de rétractation), support technique post-achat inclus.

### 5.4 Environnement technique

| Couche | Technologie | Justification |
|---|---|---|
| Frontend | React + TypeScript + Vite | Performance, maintenabilité, écosystème |
| Styling | SCSS + design system maison | Flexibilité, cohérence |
| Backend / BDD | Supabase (PostgreSQL + Auth) | Simplicité, scalabilité, sécurité |
| Hébergement | Vercel (front) + Supabase (back) | CI/CD intégré, coût maîtrisé |
| Paiement | Stripe (V1) | Standard du marché, fiable |
| Analytics | Plausible ou Matomo | RGPD-friendly |
| Monitoring | Sentry | Erreurs en temps réel |

**Liens du projet :** application en production → https://pc-aeris.vercel.app/ · dépôt et historique de développement → https://github.com/QuentinGP23/PC_Aeris

**Workflow de développement :** Issue → branche `feature/*` ou `fix/*` → code + tests → Pull Request vers `develop` → revue → merge → déploiement automatique (preview Vercel par PR, production sur `main`). Outils : GitHub + GitHub Actions (CI/CD), ESLint + Prettier, Vitest (tests unitaires/intégration), Playwright (E2E, futur).

| Indicateur opérationnel | Objectif |
|---|---|
| Uptime | > 99,5 % |
| Temps de réponse API | < 200 ms |
| Erreurs JS (Sentry) | < 0,1 % sessions |
| Délai moyen livraison | < 10 jours |
| Taux de retour | < 5 % |
| Temps réponse support email | < 24h |

### 5.5 Planning détaillé (réel + prévisionnel)

- **Jan – Mars 2026 — Sprint 1 ✅** : architecture, auth, design system, configurateur de base, admin CRUD, scripts d'import. ~57 points.
- **Avril 2026 — Sprints 2, 3, 4 ✅** : fix login pseudo + toasts + scaffolding prix ; compatibilité GPU/PSU, boîtier, stockage + Vitest ; création produit admin + édition prix + tests d'intégration. **Hors sprint :** profil utilisateur, page 404, fiche produit.
- **Mai 2026 — Polish 🔄** : refonte Aeris Dark (RGAA AA), ordre verrouillé du configurateur + cascade d'invalidation, configurations sauvegardées (US-040 à 044).
- **Juin 2026 — Clôture MVP** : affichage UI prix, responsive mobile, tarifs d'assemblage, remember me, modifications profil, recherche utilisateurs admin.
- **Juillet 2026 — Sprints 6-7 (V1)** : panier + catalogue amélioré + adresses ; tunnel de commande + Stripe + admin commandes + OAuth Google.
- **Août 2026 — Sprint 8 (V1)** : suivi commande, partage de config par lien, import CSV, tests E2E Playwright. **🚀 Lancement V1 publique.**
- **Septembre 2026+ — V2** : IA recommandation, responsive complet, paiement multi-fois, PayPal, RGPD, notifications email.

---

## 6. Équipe idéale

### 6.1 Équipe cœur (phase de lancement)

**Fondateur / CEO** — Vision, stratégie, pilotage global, commercial. Profil : entrepreneur, passionné tech/gaming, à l'aise en communication. Temps : 100 %. *(En place.)*

**CTO / Lead Developer** — Architecture technique, développement, IA. Profil : full-stack senior, autonome, orienté produit (React/TypeScript, Node.js, PostgreSQL). Bonus : expérience IA/ML, intérêt hardware. Temps : 100 % (idéalement associé). *Qualités :* shipper vite et itérer, pragmatisme, sensibilité UX, autonomie. *À éviter :* « architecte » qui ne code pas, perfectionniste bloquant, aucun intérêt pour le domaine.

**Expert Hardware / PO technique** — Base de données composants, règles de compatibilité, veille. Profil : monteur PC expérimenté, rédacteur/YouTuber tech, ancien vendeur spécialisé, membre actif des communautés hardware. Temps : 20-50 % (freelance).

### 6.2 Équipe élargie (phase de croissance)

| Rôle | Focus | Temps |
|---|---|---|
| Growth / Marketing | SEO, réseaux, partenariats créateurs, contenus | 50-100 % |
| Développeur Front-end | Configurateur fluide, mobile-first, accessibilité | 100 % |
| Développeur Back-end / Data | Système de prix, algorithme de compatibilité, scalabilité | 100 % |
| Support Client / Ops | Relation client, SAV, suivi commandes | 50-100 % |

**Prestataires externes :** comptabilité (mensuel), juridique (CGV/RGPD, ponctuel), design UI/UX (ponctuel), assemblage et logistique (par commande).

### 6.3 Culture et organigramme cible (N+2)

**Valeurs :** passion (on aime les PC), pragmatisme (*done > perfect*), transparence, ownership, curiosité. **Green flags :** a déjà monté un PC, suit l'actu hardware, a contribué à des projets perso/open source, autonome, communique clairement.

```
                ┌─────────────────┐
                │  FONDATEUR/CEO  │
                └────────┬────────┘
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
   ┌───────────┐   ┌───────────┐   ┌───────────┐
   │   TECH    │   │  PRODUIT  │   │  BUSINESS │
   │ • CTO     │   │ • Expert  │   │ • Growth  │
   │ • Dev × 2 │   │   hardware│   │ • Support │
   └───────────┘   └───────────┘   └───────────┘
      3 pers.         1 pers.         2 pers.
```

**Total équipe cible N+2 :** 6-7 personnes (hors prestataires).

| Rôle | Profil en un mot | Priorité |
|---|---|---|
| Fondateur | Le visionnaire pragmatique | En place |
| CTO | Le builder passionné | Critique |
| Expert hardware | L'encyclopédie vivante | Important |
| Growth | Le connecteur créatif | Phase 2 |
| Dev front / back | L'artisan de l'UX / l'architecte data | Phase 2 |
| Support | L'ambassadeur patient | Phase 2 |

---

# Partie C — Pilotage produit & agilité

## 7. Story mapping

> **Légende :** [MVP] = Sprint 1-5 · [V1] = Sprint 6-8 · [V2] = Sprint 9+
> US-040 à US-044 (configurations sauvegardées) ont été avancées de V1 vers le MVP en mai 2026.

| # | Activité | Rôle principal | Cible |
|---|---|---|---|
| 1 | Découvrir la plateforme | Visiteur | MVP |
| 2 | S'authentifier | Utilisateur | MVP |
| 3 | Configurer son PC | Utilisateur | MVP |
| 4 | Passer commande | Utilisateur | V1 |
| 5 | Gérer son compte | Utilisateur connecté | V1 |
| 6 | [Admin] Gérer la plateforme | Administrateur | MVP/V1 |

### Activité 1 — Découvrir la plateforme
- *Accéder à l'accueil :* US-001 page d'accueil claire [MVP] · US-002 présentation visuelle du configurateur [MVP] · US-003 configurations populaires [V1] · US-004 tarifs d'assemblage [V1]
- *Naviguer :* US-005 menu clair [MVP] · US-006 navigation mobile [V1] · US-007 footer légal [V1]
- *Catalogue :* US-008 liste par catégorie [MVP] · US-009 filtres marque/prix/specs [V1] · US-010 prix par composant [V1]

### Activité 2 — S'authentifier
- *Créer un compte :* US-011 email + mot de passe [MVP] · US-012 pseudo à l'inscription [MVP] · US-013 inscription Google [V1]
- *Se connecter :* US-014 email/mot de passe [MVP] · US-015 connexion par pseudo (bug fix) [MVP] · US-016 rester connecté [V1]
- *Récupérer l'accès :* US-017 email de réinitialisation [MVP] · US-018 nouveau mot de passe [MVP]
- *Se déconnecter :* US-019 déconnexion [MVP]

### Activité 3 — Configurer son PC
- *Démarrer :* US-020 accès configurateur [MVP] · US-021 voir les catégories [MVP] · US-022 usage cible [V1]
- *Sélectionner :* US-023 pagination [MVP] · US-024 recherche par nom [MVP] · US-025 specs clés [MVP] · US-026 ajouter [MVP] · US-027 retirer [MVP] · US-028 prix [V1] · US-029 filtre prix [V1] · US-030 image [V1]
- *Compatibilité :* US-031 filtrage CPU/MB/RAM [MVP] · US-032 explication du filtre [MVP] · US-033 GPU/alimentation [V1→livré] · US-034 boîtier/format MB [V1→livré] · US-035 stockage/MB [V1→livré] · US-036 analyse IA [V2] · US-037 suggestion PSU [V2]
- *Récapitulatif :* US-038 récap composants [MVP] · US-039 prix total [V1] · US-040 indicateur de complétude [MVP]
- *Sauvegarder/partager :* US-041 sauvegarder [MVP] · US-042 nommer [MVP] · US-043 accéder [MVP] · US-044 supprimer [MVP] · US-045 partager via lien [V2] · US-046 export PDF [V2]

### Activité 4 — Passer commande
- *Panier :* US-047 ajouter au panier · US-048 page panier · US-049 modifier/supprimer · US-050 panier persistant — [V1]
- *Livraison :* US-051 saisir adresse · US-052 adresses sauvegardées · US-053 option de livraison — [V1]
- *Payer :* US-054 carte via Stripe · US-055 email de confirmation — [V1] · US-056 paiement multi-fois · US-057 PayPal — [V2]
- *Suivre :* US-058 historique · US-059 statut en cours — [V1] · US-060 notifications email — [V2]

### Activité 5 — Gérer son compte
- *Profil :* US-061 page profil [MVP/hors sprint] · US-062 modifier infos [MVP/hors sprint] · US-063 modifier pseudo [V1] · US-064 changer mot de passe [V1] · US-065 avatar [V2]
- *Adresses :* US-066 ajouter · US-067 adresse par défaut — [V1]
- *Suppression :* US-068 supprimer son compte (RGPD) [V2]

### Activité 6 — [Admin] Gérer la plateforme
- *Surveiller :* US-069 dashboard stats [MVP] · US-070 graphiques d'évolution [V1]
- *Utilisateurs :* US-071 liste [MVP] · US-072 modifier rôle [MVP] · US-073 supprimer [MVP] · US-074 rechercher/filtrer [V1]
- *Produits :* US-075 liste [MVP] · US-076 modifier specs [MVP] · US-077 supprimer [MVP] · US-078 créer [MVP/livré S4] · US-079 prix [MVP/livré S4] · US-080 import CSV [V1]
- *Commandes :* US-081 liste · US-082 mise à jour statut · US-083 détail — [V1]

---

## 8. Backlog priorisé

> **Total :** 87 user stories · **Vélocité cible :** 20-25 points/sprint (projet solo) · **Vélocité réelle observée :** ~22 points/sprint sur S1→S4.
> **Statuts :** Done · Tech ready (UI prête, données absentes) · À faire.

| ID | User Story | Rôle | Priorité | Sprint | Statut | Pts |
|---|---|---|---|---|---|---|
| US-001 | Page d'accueil claire | Visiteur | Critique | 1 | Done | 5 |
| US-002 | Présentation visuelle du configurateur (CTA) | Visiteur | Haute | 2 | Done | 3 |
| US-003 | Configurations populaires sur l'accueil | Visiteur | Moyenne | 6 | À faire | 5 |
| US-004 | Tarifs indicatifs d'assemblage | Visiteur | Haute | 5 | À faire | 2 |
| US-005 | Menu de navigation clair | Visiteur | Critique | 1 | Done | 3 |
| US-006 | Site responsive mobile complet | Visiteur | Haute | 5 | À faire | 8 |
| US-007 | Footer légal + liens utiles | Visiteur | Moyenne | 5 | À faire | 2 |
| US-008 | Catalogue par catégorie | Visiteur | Critique | 1 | Done | 3 |
| US-009 | Filtres marque/prix/specs | Visiteur | Haute | 6 | À faire | 5 |
| US-010 | Prix dans le catalogue | Visiteur | Haute | 5 | Tech ready | 3 |
| US-011 | Inscription email + mot de passe | Visiteur | Critique | 1 | Done | 3 |
| US-012 | Pseudo à l'inscription | Visiteur | Critique | 1 | Done | 2 |
| US-013 | Inscription via Google (OAuth) | Visiteur | Moyenne | 7 | À faire | 5 |
| US-014 | Connexion email + mot de passe | Utilisateur | Critique | 1 | Done | 2 |
| US-015 | Connexion par pseudo (bug fix) | Utilisateur | Critique | 2 | Done | 3 |
| US-016 | Rester connecté (remember me) | Utilisateur | Haute | 5 | À faire | 2 |
| US-017 | Email de réinitialisation mot de passe | Utilisateur | Critique | 1 | Done | 2 |
| US-018 | Nouveau mot de passe via lien | Utilisateur | Critique | 1 | Done | 2 |
| US-019 | Déconnexion | Utilisateur | Critique | 1 | Done | 1 |
| US-020 | Accès configurateur | Utilisateur | Critique | 1 | Done | 1 |
| US-021 | Voir les catégories de composants | Utilisateur | Critique | 1 | Done | 2 |
| US-022 | Choisir un usage cible | Utilisateur | Moyenne | 6 | À faire | 8 |
| US-023 | Pagination des composants | Utilisateur | Critique | 1 | Done | 3 |
| US-024 | Recherche par nom | Utilisateur | Critique | 1 | Done | 2 |
| US-025 | Specs techniques clés | Utilisateur | Critique | 1 | Done | 2 |
| US-026 | Sélectionner un composant | Utilisateur | Critique | 1 | Done | 2 |
| US-027 | Retirer un composant | Utilisateur | Critique | 1 | Done | 1 |
| US-028 | Prix du composant (configurateur) | Utilisateur | Haute | 5 | Tech ready | 3 |
| US-029 | Filtre par fourchette de prix | Utilisateur | Haute | 6 | À faire | 3 |
| US-030 | Image du composant | Utilisateur | Haute | 5 | À faire | 2 |
| US-031 | Compatibilité CPU/MB/RAM | Utilisateur | Critique | 1 | Done | 8 |
| US-032 | Explication du filtre de compatibilité | Utilisateur | Haute | 1 | Done | 2 |
| US-033 | Compatibilité GPU/Alimentation (TDP) | Utilisateur | Haute | 3 | Done | 5 |
| US-034 | Compatibilité Boîtier/Format MB | Utilisateur | Haute | 3 | Done | 3 |
| US-035 | Compatibilité Stockage/MB (M.2/SATA) | Utilisateur | Haute | 3 | Done | 3 |
| US-036 | Analyse IA de la configuration | Utilisateur | Basse | 9 | À faire | 13 |
| US-037 | Suggestion automatique de PSU | Utilisateur | Basse | 9 | À faire | 8 |
| US-038 | Récapitulatif de configuration | Utilisateur | Critique | 1 | Done | 2 |
| US-039 | Prix total de la configuration | Utilisateur | Haute | 5 | Tech ready | 2 |
| US-040 | Indicateur de complétude | Utilisateur | Haute | 5 | Done | 3 |
| US-041 | Sauvegarder une configuration | Utilisateur | Haute | 5 | Done | 5 |
| US-042 | Nommer une configuration | Utilisateur | Haute | 5 | Done | 2 |
| US-043 | Accéder à ses configurations | Utilisateur | Haute | 5 | Done | 3 |
| US-044 | Supprimer une configuration | Utilisateur | Moyenne | 5 | Done | 1 |
| US-045 | Partager via un lien unique | Utilisateur | Moyenne | 8 | À faire | 5 |
| US-046 | Exporter en PDF | Utilisateur | Basse | 9 | À faire | 5 |
| US-047 | Ajouter au panier | Utilisateur | Haute | 6 | À faire | 5 |
| US-048 | Page panier | Utilisateur | Haute | 6 | À faire | 3 |
| US-049 | Modifier/supprimer articles panier | Utilisateur | Haute | 6 | À faire | 3 |
| US-050 | Panier persistant | Utilisateur | Haute | 6 | À faire | 3 |
| US-051 | Adresse de livraison | Utilisateur | Haute | 7 | À faire | 3 |
| US-052 | Adresses sauvegardées au checkout | Utilisateur | Haute | 7 | À faire | 2 |
| US-053 | Option de livraison | Utilisateur | Moyenne | 7 | À faire | 3 |
| US-054 | Paiement Stripe | Utilisateur | Haute | 7 | À faire | 8 |
| US-055 | Email de confirmation de commande | Utilisateur | Haute | 7 | À faire | 3 |
| US-056 | Paiement en plusieurs fois | Utilisateur | Basse | 10 | À faire | 5 |
| US-057 | Paiement PayPal | Utilisateur | Basse | 10 | À faire | 5 |
| US-058 | Historique des commandes | Utilisateur | Haute | 8 | À faire | 3 |
| US-059 | Statut d'une commande en cours | Utilisateur | Haute | 8 | À faire | 3 |
| US-060 | Notifications email de statut | Utilisateur | Moyenne | 9 | À faire | 5 |
| US-061 | Page de profil | Utilisateur | Haute | 5 | Done (hors sprint) | 3 |
| US-062 | Modifier infos personnelles | Utilisateur | Haute | 5 | Done (hors sprint) | 2 |
| US-063 | Modifier son pseudo | Utilisateur | Haute | 5 | À faire | 2 |
| US-064 | Changer son mot de passe | Utilisateur | Haute | 5 | À faire | 2 |
| US-065 | Photo de profil (avatar) | Utilisateur | Basse | 9 | À faire | 5 |
| US-066 | Ajouter des adresses | Utilisateur | Haute | 6 | À faire | 3 |
| US-067 | Adresse par défaut | Utilisateur | Haute | 6 | À faire | 2 |
| US-068 | Supprimer son compte (RGPD) | Utilisateur | Moyenne | 9 | À faire | 5 |
| US-069 | Dashboard admin (stats) | Admin | Critique | 1 | Done | 5 |
| US-070 | Graphiques d'évolution | Admin | Moyenne | 6 | À faire | 5 |
| US-071 | Liste des utilisateurs | Admin | Critique | 1 | Done | 3 |
| US-072 | Modifier le rôle d'un utilisateur | Admin | Critique | 1 | Done | 2 |
| US-073 | Supprimer un utilisateur | Admin | Critique | 1 | Done | 2 |
| US-074 | Rechercher/filtrer les utilisateurs | Admin | Haute | 5 | À faire | 3 |
| US-075 | Liste des produits | Admin | Critique | 1 | Done | 3 |
| US-076 | Modifier un produit | Admin | Critique | 1 | Done | 5 |
| US-077 | Supprimer un produit | Admin | Critique | 1 | Done | 2 |
| US-078 | Créer un produit | Admin | Haute | 4 | Done | 5 |
| US-079 | Définir/modifier les prix | Admin | Haute | 4 | Done | 3 |
| US-080 | Import CSV de produits | Admin | Moyenne | 8 | À faire | 8 |
| US-081 | Liste des commandes | Admin | Haute | 7 | À faire | 3 |
| US-082 | Mettre à jour le statut d'une commande | Admin | Haute | 7 | À faire | 3 |
| US-083 | Détail d'une commande | Admin | Haute | 7 | À faire | 2 |
| US-084 | Notifications toast globales | Utilisateur | Haute | 2 | Done | 3 |
| US-085 | Page 404 personnalisée | Visiteur | Moyenne | 4 | Done (hors sprint) | 2 |
| US-086 | Tests unitaires utils/services | Dev | Haute | 3 | Done (27 tests) | 8 |
| US-087 | Tests d'intégration flux critiques | Dev | Haute | 4 | Done (15 tests) | 13 |

### Récapitulatif par statut (au 1ᵉʳ juin 2026)

| Statut | Nombre | Points |
|---|---|---|
| Done | 45 | ~137 |
| Tech ready (données prix absentes) | 3 | ~8 |
| À faire | 39 | ~188 |
| **Total** | **87** | **~333** |

### Synthèse par sprint

| Sprint | Période | Points | Statut | Objectif |
|---|---|---|---|---|
| Sprint 1 | Jan–Mar 2026 | ~57 | ✅ | Fondations : auth + configurateur + admin |
| Sprint 2 | 17 avril 2026 | ~12 | ✅ | Fix login + toasts + tuyauterie prix |
| Sprint 3 | 17-20 avril 2026 | ~19 | ✅ | Compatibilité complète + Vitest |
| Sprint 4 | 20 avril 2026 | ~21 | ✅ | Admin création/prix + tests intégration |
| Hors sprint | avril 2026 | ~12 | ✅ | Profil, 404, fiche produit |
| Mai 2026 | 22-29 mai 2026 | ~16 | ✅ | Aeris Dark + ordre verrouillé + configs sauvegardées |
| Sprint 5 (reste) | juin 2026 | ~26 | 🔄 | Prix UI + responsive + assemblage + admin search |
| Sprint 6 | juin-juillet 2026 | ~42 | À faire | Panier + catalogue + adresses |
| Sprint 7 | juillet 2026 | ~31 | À faire | Tunnel de commande + Stripe |
| Sprint 8 | août 2026 | ~18 | À faire | Suivi commande + partage + import CSV |
| Sprint 9+ (V2) | sept 2026+ | ~54 | À faire | IA, paiement avancé, RGPD |

---

## 9. User Stories formatées (avec critères d'acceptation)

> Détail des user stories de priorité **Critique** et **Haute**. Les critères d'acceptation (CA) sont les conditions vérifiables en recette. La *Definition of Done* (DoD) liste les conditions de clôture.

### US-001 — Page d'accueil avec présentation de PC Aeris
**En tant que** visiteur, **je veux** une page d'accueil claire présentant PC Aeris, **afin de** comprendre l'offre avant de m'inscrire ou de configurer.
**CA :** charge < 3 s · proposition de valeur visible above the fold · CTA « Configurer mon PC » fonctionnel · titre + sous-titre + lien configurateur · navigation fonctionnelle.
**DoD :** mergé sur `develop` · rendu Chrome/Firefox/Safari · responsive 375px & 768px · zéro erreur console.
**Points :** 5 · **Priorité :** Critique · **Sprint :** 1 · **Statut :** Done.

### US-002 — Hero banner avec CTA vers le configurateur
**En tant que** visiteur, **je veux** une bannière hero mettant en avant le configurateur, **afin d'**être incité à démarrer dès la première visite.
**CA :** HeroBanner en haut de page · titre + sous-titre + bouton CTA · CTA → /configurateur · visuel distinct · image optimisée (WebP/SVG < 200 ko).
**DoD :** mergé · design cohérent avec le design system · responsive · Lighthouse > 80.
**Points :** 3 · **Priorité :** Haute · **Sprint :** 2 · **Statut :** Done.

### US-005 — Menu de navigation principal
**En tant que** visiteur, **je veux** un menu clair et accessible, **afin d'**accéder rapidement aux sections.
**CA :** logo cliquable (→ /) · liens Accueil / Configurateur / [Compte ou Connexion] · pseudo + accès profil si connecté · lien Admin si rôle admin · menu sticky · hamburger sur mobile.
**DoD :** mergé · responsive (hamburger fonctionnel) · navigation clavier.
**Points :** 3 · **Priorité :** Critique · **Sprint :** 1 · **Statut :** Done.

### US-006 — Responsive mobile complet
**En tant que** visiteur, **je veux** utiliser le site sur smartphone, **afin de** configurer ou consulter mes commandes en mobilité.
**CA :** toutes les pages utilisables dès 375px · configurateur utilisable sur mobile · formulaires auth utilisables · tableaux admin adaptés (vue carte) · aucun contenu tronqué · zones de touch ≥ 44×44px.
**DoD :** testé iOS Safari & Android Chrome · breakpoints 375/414/768px · Lighthouse Mobile > 70 · aucun scroll horizontal parasite.
**Points :** 8 · **Priorité :** Haute · **Sprint :** 5 · **Statut :** À faire.

### US-011 — Inscription avec email et mot de passe
**En tant que** visiteur, **je veux** créer un compte (email + mot de passe), **afin d'**accéder aux fonctionnalités personnalisées.
**CA :** formulaire email/pseudo/prénom/nom/mot de passe/confirmation · email validé (format + unicité) · pseudo validé (≥ 3 car., alphanumérique + tirets) · mot de passe ≥ 8 car. · message de succès · message d'erreur explicite · connexion automatique après inscription.
**DoD :** mergé · cas nominaux & erreurs validés · responsive · persistance Supabase (table `profiles`).
**Points :** 3 · **Priorité :** Critique · **Sprint :** 1 · **Statut :** Done.

### US-014 — Connexion avec email et mot de passe
**En tant qu'**utilisateur inscrit, **je veux** me connecter (email + mot de passe), **afin d'**accéder à mon espace.
**CA :** champ identifiant + mot de passe · connexion email OK · message d'erreur générique si identifiants faux · redirection accueil (ou admin) · lien « Mot de passe oublié ? » · lien inscription.
**DoD :** mergé · tests nominaux & erreurs · responsive · session Supabase Auth.
**Points :** 2 · **Priorité :** Critique · **Sprint :** 1 · **Statut :** Done.

### US-015 — Connexion par pseudo (correction de bug)
**En tant qu'**utilisateur inscrit, **je veux** me connecter avec mon pseudo, **afin d'**avoir une alternative à l'email.
**CA :** le champ identifiant accepte email **ou** pseudo · résolution pseudo → email via `profiles` avant Supabase Auth · pseudo inexistant → message clair · même session/redirection que l'email · logique dynamique (plus de hardcode).
**DoD :** bug résolu et vérifié · code reviewé · aucune régression sur la connexion email.
**Note technique :** corrige une erreur hardcodée dans `authService.signIn`.
**Points :** 3 · **Priorité :** Critique · **Sprint :** 2 · **Statut :** Done.

### US-017 — Réinitialisation de mot de passe par email
**En tant qu'**utilisateur ayant oublié son mot de passe, **je veux** recevoir un email de réinitialisation, **afin de** récupérer l'accès.
**CA :** page « Mot de passe oublié » (champ email + bouton) · email envoyé si l'adresse existe · message neutre sinon (pas de fuite d'info) · message de confirmation · lien → /reset-password avec token valide.
**DoD :** mergé · envoi/réception testés · responsive.
**Points :** 2 · **Priorité :** Critique · **Sprint :** 1 · **Statut :** Done.

### US-018 — Définition d'un nouveau mot de passe
**En tant qu'**utilisateur ayant cliqué sur le lien, **je veux** définir un nouveau mot de passe, **afin de** restaurer l'accès.
**CA :** deux champs (nouveau + confirmation) · règles de validation (≥ 8 car.) · champs identiques · message de succès · redirection connexion · token invalide/expiré → message explicite.
**DoD :** mergé · flux complet testé (email → lien → reset → connexion) · responsive.
**Points :** 2 · **Priorité :** Critique · **Sprint :** 1 · **Statut :** Done.

### US-023 — Pagination dans le configurateur
**En tant qu'**utilisateur, **je veux** parcourir les composants avec pagination, **afin de** voir toutes les options sans saturer la page.
**CA :** 24 éléments/page · boutons Précédent/Suivant · nombre total affiché · reset à 0 au changement de catégorie/filtre · état de chargement (spinner).
**DoD :** mergé · testé avec données réelles · responsive.
**Points :** 3 · **Priorité :** Critique · **Sprint :** 1 · **Statut :** Done.

### US-024 — Recherche de composant par nom
**En tant qu'**utilisateur, **je veux** rechercher un composant par nom, **afin de** trouver rapidement un produit connu.
**CA :** champ de recherche en haut de liste · insensible casse/accents · temps réel (debounce 300 ms) · message « Aucun composant trouvé » · pagination réinitialisée · compatible avec les filtres de compatibilité actifs.
**DoD :** mergé · testé requêtes vides/courtes/longues · responsive.
**Points :** 2 · **Priorité :** Critique · **Sprint :** 1 · **Statut :** Done.

### US-025 — Affichage des caractéristiques techniques clés
**En tant qu'**utilisateur, **je veux** voir les specs clés dans la liste, **afin de** comparer sans ouvrir une fiche.
**CA :** specs clés par catégorie (ex. CPU → socket, cores, boost) · format lisible · « — » si valeur manquante · fabricant + nom affichés · indication si déjà sélectionné.
**DoD :** mergé · testé sur toutes les catégories · responsive.
**Points :** 2 · **Priorité :** Critique · **Sprint :** 1 · **Statut :** Done.

### US-031 — Filtrage automatique par compatibilité CPU/Carte mère/RAM
**En tant qu'**utilisateur, **je veux** que les composants incompatibles soient filtrés, **afin de** ne pas pouvoir sélectionner des pièces incompatibles.
**CA :** CPU sélectionné → cartes mères même socket · carte mère → CPU socket correspondant · carte mère → RAM type compatible (DDR4/DDR5) · CPU → ventirads compatibles socket · filtre désactivé sans composant de référence · message si aucun composant compatible.
**DoD :** mergé · testé configs réelles (LGA1700, AM5) · testé cas limites.
**Points :** 8 · **Priorité :** Critique · **Sprint :** 1 · **Statut :** Done.

### US-032 — Explication du filtre de compatibilité actif
**En tant qu'**utilisateur, **je veux** voir pourquoi un filtre est actif, **afin de** comprendre les contraintes de ma configuration.
**CA :** bandeau/badge quand un filtre est actif · raison indiquée (ex. « Filtré par socket LGA1700 ») · message dans la catégorie concernée · message si liste filtrée vide.
**DoD :** mergé · UX testée (message compréhensible) · responsive.
**Points :** 2 · **Priorité :** Haute · **Sprint :** 1 · **Statut :** Done.

### US-033 — Compatibilité GPU / Alimentation
**En tant qu'**utilisateur, **je veux** que la compatibilité GPU/PSU soit vérifiée, **afin d'**éviter un PSU insuffisant.
**CA :** PSU affichés ≥ (TDP GPU + TDP CPU + marge 20 %) · raison affichée · message si aucun PSU adéquat · filtre bidirectionnel.
**DoD :** mergé · calcul validé (entry/mid/high-end) · tests unitaires sur le calcul de consommation.
**Note technique :** `wattage >= ceil((tdp_cpu + tdp_gpu + 100) * 1.2)` — 20 % de headroom + buffer système 100 W.
**Points :** 5 · **Priorité :** Haute · **Sprint :** 3 · **Statut :** Done.

### US-034 — Compatibilité Boîtier / Format carte mère
**En tant qu'**utilisateur, **je veux** que la compatibilité boîtier/format soit vérifiée, **afin d'**éviter une carte mère qui ne rentre pas.
**CA :** carte mère ATX → boîtiers supportant ATX · boîtier mATX → cartes mères mATX & Mini-ITX · raison affichée · filtre bidirectionnel.
**DoD :** mergé · testé ATX/mATX/Mini-ITX · tests unitaires sur la logique de form factor.
**Note technique :** `pc_case` filtré par `supported_mobo_form_factors @> [form_factor_mobo]` (array containment).
**Points :** 3 · **Priorité :** Haute · **Sprint :** 3 · **Statut :** Done.

### US-035 — Compatibilité Stockage / Connectique carte mère
**En tant qu'**utilisateur, **je veux** que la compatibilité stockage/carte mère soit vérifiée, **afin de** m'assurer que mes disques sont supportés.
**CA :** SSD M.2 NVMe → cartes mères avec slot M.2 disponible · disque SATA → cartes mères avec ports SATA · raison affichée · filtre bidirectionnel.
**DoD :** mergé · testé NVMe & SATA · tests unitaires.
**Points :** 3 · **Priorité :** Haute · **Sprint :** 3 · **Statut :** Done.

### US-038 — Récapitulatif de configuration
**En tant qu'**utilisateur, **je veux** un récapitulatif de mes composants, **afin d'**avoir une vue d'ensemble.
**CA :** panneau récap toutes catégories (ou « Non sélectionné ») · suppression par ligne · bouton « Réinitialiser » · récap visible en permanence · mise à jour temps réel.
**DoD :** mergé · testé config complète & partielle · responsive.
**Points :** 2 · **Priorité :** Critique · **Sprint :** 1 · **Statut :** Done.

### US-039 — Prix total de la configuration
**En tant qu'**utilisateur, **je veux** voir le prix total, **afin de** savoir combien coûteront les composants.
**CA :** prix total dans le récap · somme des prix unitaires · composant sans prix → non compté + mention « prix non disponible » · format euros (« 1 249,99 € ») · mise à jour temps réel.
**DoD :** mergé · prérequis US-079 (prix en BDD) · testé configs complètes & partielles.
**Points :** 2 · **Priorité :** Haute · **Sprint :** 5 · **Statut :** Tech ready (UI à faire, données dépendantes des credentials API).

### US-041 — Sauvegarde de configuration
**En tant qu'**utilisateur connecté, **je veux** sauvegarder ma configuration, **afin de** la retrouver à ma prochaine visite.
**CA :** bouton « Sauvegarder » · modal de nommage · sauvegarde liée au compte · toast de confirmation · invitation à se connecter sinon · jusqu'à 10 configurations.
**DoD :** mergé · migration Supabase (`saved_configurations`) · testé connecté & non connecté · toast fonctionnel.
**Points :** 5 · **Priorité :** Haute · **Sprint :** 5 · **Statut :** Done (mai 2026).

### US-047 — Ajout de la configuration au panier
**En tant qu'**utilisateur, **je veux** ajouter ma configuration au panier, **afin de** procéder à la commande.
**CA :** bouton « Ajouter au panier » dans le récap · actif si ≥ 1 composant · notification/toast après ajout · badge panier mis à jour · invitation à se connecter sinon.
**DoD :** mergé · store Zustand panier + persistance localStorage · responsive · badge fonctionnel.
**Points :** 5 · **Priorité :** Haute · **Sprint :** 6 · **Statut :** À faire.

### US-048 — Page panier
**En tant qu'**utilisateur, **je veux** voir le contenu de mon panier, **afin de** vérifier ma commande avant paiement.
**CA :** liste composants (nom, catégorie, prix) · sous-total + livraison + total · suppression individuelle · bouton « Continuer mes achats » · bouton « Passer commande » (si connecté) · état panier vide.
**DoD :** mergé · testé panier vide & rempli · responsive.
**Points :** 3 · **Priorité :** Haute · **Sprint :** 6 · **Statut :** À faire.

### US-054 — Paiement par carte bancaire via Stripe
**En tant qu'**utilisateur, **je veux** payer par carte de façon sécurisée, **afin de** finaliser mon achat.
**CA :** Stripe Elements/Payment Element · paiement sécurisé (PCI-DSS via Stripe) · Visa/Mastercard/Amex · message clair si refus · succès → commande créée + page de confirmation · email de confirmation (US-055) · mode test OK.
**DoD :** intégration testée en sandbox · webhook Stripe configuré · migration `orders` · mergé · aucune donnée carte stockée côté serveur.
**Note technique :** Edge Function Supabase pour créer le Payment Intent (clés secrètes jamais exposées côté client).
**Points :** 8 · **Priorité :** Haute · **Sprint :** 7 · **Statut :** À faire.

### US-055 — Email de confirmation de commande
**En tant qu'**utilisateur ayant commandé, **je veux** recevoir un email de confirmation, **afin d'**avoir la preuve de mon achat.
**CA :** envoi automatique après paiement · contenu (n° commande, composants, total, adresse) · envoyé à l'email du compte · format HTML · expéditeur no-reply.
**DoD :** template créé & validé · envoi déclenché par le webhook Stripe · testé en sandbox.
**Points :** 3 · **Priorité :** Haute · **Sprint :** 7 · **Statut :** À faire.

### US-061 — Page de profil utilisateur
**En tant qu'**utilisateur connecté, **je veux** accéder à ma page de profil, **afin de** voir et modifier mes infos.
**CA :** /profile affiche prénom/nom/pseudo/email/téléphone · page protégée (redirige vers /signin) · formulaire d'édition (US-062) · date d'inscription en lecture seule · liens vers Mes configurations & Mes commandes.
**DoD :** composant réel (remplace le TODO) · mergé · responsive.
**Points :** 3 · **Priorité :** Haute · **Sprint :** 5 · **Statut :** Done (avril 2026, hors sprint).

### US-062 — Modification des informations personnelles
**En tant qu'**utilisateur connecté, **je veux** modifier prénom/nom/téléphone, **afin de** maintenir mes infos à jour.
**CA :** champs éditables · téléphone validé · bouton « Enregistrer » · toast de succès · message si erreur serveur · email non modifiable directement.
**DoD :** mergé · `updateProfile` fonctionnel · données mises à jour (`profiles`) · responsive.
**Points :** 2 · **Priorité :** Haute · **Sprint :** 5 · **Statut :** Done (avril 2026, hors sprint).

### US-069 — Dashboard admin
**En tant qu'**administrateur, **je veux** un tableau de bord avec les stats clés, **afin de** suivre l'activité.
**CA :** nombre d'utilisateurs · nombre de produits · nombre de commandes (si dispo) · stats chargées depuis Supabase (pas de hardcode) · état de chargement · accès restreint au rôle admin.
**DoD :** mergé · ProtectedRoute `requiredRole="admin"` · testé compte admin & user.
**Points :** 5 · **Priorité :** Critique · **Sprint :** 1 · **Statut :** Done.

### US-076 — Modification d'un produit existant
**En tant qu'**administrateur, **je veux** modifier infos et specs d'un produit, **afin de** maintenir le catalogue à jour.
**CA :** bouton « Modifier » par ligne · édition des infos générales · édition des specs selon catégorie · specs typées (texte/nombre/booléen/tableau/JSONB) · sauvegarde en table produits + specs · toast de confirmation.
**DoD :** mergé · testé toutes catégories · mise à jour en base vérifiée.
**Points :** 5 · **Priorité :** Critique · **Sprint :** 1 · **Statut :** Done.

### US-078 — Création d'un nouveau produit depuis l'admin
**En tant qu'**administrateur, **je veux** créer un produit depuis l'interface, **afin d'**enrichir le catalogue sans script.
**CA :** bouton « Nouveau produit » · formulaire (catégorie, nom, fabricant, série, année, image) · champs de specs dynamiques selon catégorie · création en table `products` + table de specs dédiée · toast de confirmation · liste rafraîchie.
**DoD :** mergé · testé ≥ 3 catégories · données créées vérifiées · aucune régression sur l'édition.
**Points :** 5 · **Priorité :** Haute · **Sprint :** 4 · **Statut :** Done.

### US-079 — Gestion des prix des produits
**En tant qu'**administrateur, **je veux** définir/modifier le prix de chaque produit, **afin que** les utilisateurs voient les tarifs.
**CA :** champ « Prix (€) » à l'édition · présent aussi à la création (US-078) · stocké en entier (centimes) · prix nullable · format « 1 249,99 € » dans configurateur et back-office.
**DoD :** migration Supabase (colonne prix) · mergé · prix affiché dans le configurateur (US-028, 039) · testé avec/sans centimes.
**Points :** 3 · **Priorité :** Haute · **Sprint :** 4 · **Statut :** Done.

### US-084 — Notifications toast globales
**En tant qu'**utilisateur, **je veux** des toasts pour les actions importantes, **afin d'**être informé sans bloquer mon flux.
**CA :** composant Toast global · types success/error/info/warning · affichage haut-droite, auto-dismiss 4 s · fermeture manuelle · empilement · utilisés sur les actions clés.
**DoD :** composant créé · store Zustand/Context · intégré aux actions critiques · responsive · accessible (`role="alert"`).
**Points :** 3 · **Priorité :** Haute · **Sprint :** 2 · **Statut :** Done.

### US-086 — Tests unitaires sur les utils et services critiques
**En tant que** développeur, **je veux** une couverture de tests unitaires sur les fonctions critiques, **afin d'**éviter les régressions.
**CA :** Vitest configuré · `utils/compatibility.ts` couvert · `authService` testé (mock Supabase) · couverture ≥ 60 % sur utils/services · tests verts en CI.
**DoD :** Vitest + Testing Library · ≥ 15 tests · CI verte sur les PR · README mis à jour.
**Points :** 8 · **Priorité :** Haute · **Sprint :** 3 · **Statut :** Done (27 tests).

---

## 10. Périmètre du MVP

> **Cible MVP initiale :** Sprint 4 (fin mai 2026) · **Cible révisée :** fin Sprint 5 (juin 2026), décalée par le bloqueur prix (credentials API non obtenus).
> **Objectif :** un produit utilisable et démontrable pour valider les hypothèses commerciales et satisfaire les exigences M2.

### 10.1 Définition

Le MVP de PC Aeris est la version minimale permettant à un utilisateur de :
1. S'inscrire et se connecter.
2. Configurer un PC complet avec vérification de compatibilité complète.
3. Voir les prix des composants et le total de sa configuration.
4. Permettre à l'administrateur de gérer le catalogue (CRUD complet avec prix).

Le MVP **exclut volontairement** le tunnel de commande et le paiement : la valeur à valider est l'expérience de configuration, pas encore le flux e-commerce complet.

### 10.2 Ce qui EST dans le MVP

- **Authentification complète et sans bug** — socle de la persistance des données utilisateur.
- **Design system cohérent** — 17 composants UI, pages auth avec design réel, navigation cohérente.
- **Configurateur avec compatibilité complète** — 8 catégories, CPU/MB/RAM/Ventirad + GPU/PSU + Boîtier/Format + Stockage/Connectique, récapitulatif, recherche, pagination, ordre verrouillé (zéro impasse).
- **Prix des produits** — colonnes en base + édition manuelle admin présentes ; *affichage UI dépendant des credentials API (reliquat).*
- **Notifications toast globales.**
- **Interface admin CRUD produits complète** — création, édition, suppression, prix, CRUD utilisateurs, dashboard.
- **Page 404 et gestion d'erreurs de base.**
- **Configurations sauvegardées (US-040 à 044)** — *avancées de V1 en MVP* (mai 2026), effort raisonnable (1 table + 1 service + 1 modal), forte valeur de démonstration.

### 10.3 Ce qui N'EST PAS dans le MVP

- **Panier et tunnel de commande** — 3-4 sprints ; la valeur MVP est dans la configuration.
- **Intégration Stripe** — webhooks, edge functions, PCI-DSS : à faire proprement en V1.
- **Responsive mobile complet** — transversal et chronophage ; MVP cible d'abord le desktop.
- **Profil complet (commandes, adresses)** — lié au tunnel de commande.
- **OAuth Google** — la connexion email suffit pour le MVP.
- **Filtres avancés et catalogue public** — amélioration d'expérience, pas un prérequis.
- **IA de recommandation** — feature différenciante de V2.

### 10.4 Critères de succès du MVP

**Fonctionnels :** créer un compte et se connecter sans bug · configurer un PC complet en ne voyant que des combinaisons compatibles · voir le prix total · gérer les produits/prix côté admin · zéro bug bloquant sur le parcours principal.
**Qualité :** zéro erreur console sur le parcours principal · pages < 3 s · feedback visuel sur toutes les actions importantes · déployé en production sur Vercel.
**Validation M2 :** story map ✓ · backlog priorisé ✓ · revue Sprint 1 ✓ · revues Sprints 2-5 ✓ · README à jour ✓.

### 10.5 Hypothèses et risques

| # | Hypothèse | Risque si fausse | Mitigation |
|---|---|---|---|
| H1 | Les utilisateurs veulent configurer eux-mêmes | Pas d'usage du configurateur | Mesurer visites & temps passé |
| H2 | La compatibilité auto est la feature différenciante clé | Indifférence | Onboarding pour valider le cas d'usage |
| H3 | Les prix affichés sont compétitifs vs Amazon/LDLC | Achats ailleurs | Surveiller concurrents, ajuster la marge |
| H4 | Les early adopters M2 sont représentatifs | Biais de sélection | Tester avec profils moins techniques |

| # | Risque technique | Prob. | Impact | Mitigation |
|---|---|---|---|---|
| R1 | Base produits incomplète (specs/prix) | Haute | Haute | Audit avant MVP, prix prioritaires |
| R2 | Règles de compatibilité incomplètes | Moyenne | Haute | Tester configs réelles connues |
| R3 | Performance > 1000 produits | Faible | Moyenne | Index Supabase + pagination |
| R4 | Limites Supabase Free Tier | Faible | Basse | Surveiller l'usage, passer Pro si besoin |

| # | Risque projet (solo) | Prob. | Impact | Mitigation |
|---|---|---|---|---|
| R5 | Scope creep avant le MVP | Haute | Haute | Respecter le périmètre MVP |
| R6 | Dette technique (0 test) | Haute | Moyenne | Sprint 3 dédié aux tests |
| R7 | Vendor lock-in Supabase | Faible | Haute | Couche service abstraite (en place) |

---

## 11. Sprint 1 — Revue de sprint

> **Période :** janvier – mars 2026 (sprint long de mise en place) · **Équipe :** Quentin Geoffroy (développeur solo) · **Date de revue :** 27 mars 2026.
> Les revues des Sprints 2, 3 et 4 sont consolidées en section 12.

### 11.1 Objectif

Poser les fondations complètes : infrastructure (Vite + React 19 + TypeScript + Supabase + Vercel), authentification complète, design system, configurateur avec compatibilité partielle, interface d'administration. Ce sprint correspond à une phase de mise en place rétroactivement structurée dans un cadre agile.

### 11.2 Vélocité

| Métrique | Valeur |
|---|---|
| Stories planifiées | 25 |
| Stories livrées (Done) | 22 |
| Stories partielles | 2 |
| Stories avec bug | 1 |
| Points livrés (Done) | ~57 |
| Points livrés (Done + partiel) | ~65 |
| Taux de complétion | 88 % |

### 11.3 Ce qui a été livré

**Infrastructure & CI/CD :** Vite + React 19 + TypeScript, SCSS + design tokens, Supabase (PostgreSQL + Auth), Zustand, React Router v6, déploiement Vercel (preview + prod), GitHub Actions (lint + build), ESLint + TypeScript strict.

**Schéma de base de données (12 tables) :** `profiles`, `products` + tables de specs par catégorie (`cpu_specs`, `motherboard_specs`, `ram_specs`, `gpu_specs`, `storage_specs`, `psu_specs`, `pc_case_specs`, `cpu_cooler_specs`).

**Authentification (US-011, 014, 017, 018, 019) :** inscription (validation email + pseudo, création profil, connexion auto), connexion email, reset de mot de passe, déconnexion. *Connexion par pseudo : bug identifié (erreur hardcodée) → corrigé en Sprint 2.*

**Design system (~17 composants) :** Alert, Avatar, Badge, Button, Card, Checkbox, Divider, Form, Input, Modal, ProtectedRoute, Radio, Select, Spinner, Table, Textarea, Toggle, HeroBanner. Page de démo `/components` (dev only).

**Configurateur (US-020 à 027, 031, 032, 038) :** sélection par catégorie, pagination (24/page), recherche par nom, specs clés, sélection/désélection, récapitulatif, réinitialisation, compatibilité CPU↔MB / MB→RAM / CPU→Ventirad. *Compatibilité GPU/PSU, Boîtier/MB, Stockage/MB : absente → livrée en Sprint 3.*

**Administration (US-069 à 077) :** dashboard stats, liste/édition rôle/suppression utilisateurs, liste/édition/suppression produits. *Création produit & gestion prix : absentes → livrées en Sprint 4.*

**Scripts d'import :** `import-buildcores.mjs`, `fetch-images-bestbuy.mjs` — peuplement initial du catalogue.

### 11.4 Ce qui n'a pas été livré

- **Bug — connexion par pseudo (US-015) :** résolution pseudo → email non implémentée → corrigé S2.
- **Création de produit admin (US-078) :** non priorisée (script d'import couvrait le besoin) → livrée S4.
- **Prix des produits (US-079) :** pas de colonne prix → migration S4.
- **Tests (US-086, 087) :** 0 % de couverture → S3 (27 tests) + S4 (15 tests).
- **Page profil (US-061) :** route en TODO → livrée hors sprint (avril).

### 11.5 Rétrospective

**Ce qui a bien marché :** architecture solide (services séparés, TypeScript strict, abstraction Supabase) ; design system cohérent investi tôt ; configurateur fonctionnel rapidement sur de vraies données ; CI/CD opérationnel (itérations rapides) ; scripts d'import (peuplement rapide).

**Ce qui peut être amélioré :** 0 test = dette technique majeure (→ Vitest S3) ; design/UX non défini (→ travail design S2) ; pas de feedback utilisateur (→ toasts S2) ; bus factor / documentation (→ docs agile).

### 11.6 Objectifs Sprint 2 (définis en revue)

Corriger les bugs critiques et améliorer la qualité de l'expérience : US-015 (bug pseudo), US-084 (toasts), US-002 (hero banner), US-085 (404), refactorisation accueil, responsive partiel auth/home. **~16 points.** *(Ces objectifs ont été tenus — cf. section 12.)*

### 11.7 Métriques projet à fin Sprint 1

| Métrique | Valeur |
|---|---|
| Lignes de code (TS/TSX) | ~4 500 |
| Composants React | ~35 |
| Routes | 10 |
| Tables Supabase | 12 |
| Produits en base | plusieurs milliers (import BuildCores) |
| Couverture de tests | 0 % (→ 67 tests à fin mai) |

---

## 12. Revues consolidées Sprints 2-4 & mise à jour Roadmap / Trello

### 12.1 Revues Sprints 2, 3, 4 (17-20 avril 2026)

**Sprint 2 — UX et tuyauterie prix (~12 pts).** US-015 (connexion pseudo, fix), US-084 (toasts globaux : store Zustand, 4 variantes, auto-dismiss 4 s), US-002 (hero banner), refactorisation accueil, scaffolding multi-sources prix (Amazon/Rakuten/Cdiscount/eBay : table `products` enrichie + 4 scripts de fetch). **Données prix absentes** — credentials API non obtenus.

**Sprint 3 — Compatibilité et tests (~19 pts).** US-033 (GPU/PSU : `wattage >= ceil((tdp_cpu + tdp_gpu + 100) × 1.2)`), US-034 (boîtier/format : array containment), US-035 (stockage M.2/SATA), US-086 (Vitest + 27 tests : compatibilité 20 + auth 7).

**Sprint 4 — Admin et tests d'intégration (~21 pts).** US-078 (création produit, specs dynamiques), US-079 (édition prix inline), US-087 (15 tests d'intégration : auth 6 + admin 4 + configurator 5).

| Sprint | Points | Stories | Durée |
|---|---|---|---|
| Sprint 2 | ~12 | 5 | 1 jour |
| Sprint 3 | ~19 | 4 | 3 jours |
| Sprint 4 | ~21 | 3 | 1 jour |
| **Total S2-S4** | **~52** | **12** | **~5 jours** |

**Couverture de tests :** 42 tests à fin S4 (27 unitaires + 15 intégration) → **67 tests** à fin mai après les travaux configurator + saved configs. 0 régression sur S1→S4.

**Rétrospective consolidée.** *Bien marché :* sprints courts et ciblés (vélocité instantanée élevée), tests dès S3, architecture services/compatibilité indépendante. *À améliorer :* dépendance aux credentials externes mal anticipée (prévoir un plan B dès la planification), absence de phase design dédiée (polish visuel rattrapé en mai), documentation agile en retard (corrigée par les documents consolidés).

### 12.2 Roadmap mise à jour (sprints à venir)

**Sprint 5 (reste) — juin 2026 — clôture MVP (~26 pts) :** US-006 (responsive, 8), US-010/028/039 (prix UI, 8 — *bloqueur credentials API*), US-030 (images, 2), US-004 (tarifs assemblage, 2), US-016 (remember me, 2), US-063/064 (profil pseudo/mot de passe, 4), US-074 (recherche utilisateurs admin, 3).

**Sprint 6 — juin-juillet 2026 — Panier & catalogue (~42 pts) :** US-003, 009, 022, 029, 047-050, 066-067, 070.

**Sprint 7 — juillet 2026 — Tunnel de commande & Stripe (~31 pts) :** US-013, 051-055, 081-083. *Prérequis : Edge Function Payment Intent, table `orders`, webhook Stripe, compte Stripe vérifié.*

**Sprint 8 — août 2026 — Suivi & lancement V1 (~18 pts) :** US-007, 045, 058-059, 080, tests E2E Playwright. **🚀 Lancement V1 publique fin août.**

**V2 — septembre 2026+ (~54 pts) :** responsive complet, notifications email (US-060), export PDF (US-046), suppression compte RGPD (US-068), IA de recommandation (US-036), suggestion PSU (US-037), paiement multi-fois (US-056), PayPal (US-057), avatar (US-065).

**Principes de gestion de la roadmap :** (1) le MVP ne bouge pas ; (2) la dette technique est payée avant d'avancer ; (3) design avant développement ; (4) les bugs critiques sont prioritaires sur les nouvelles features.

### 12.3 Tableau Trello (Kanban à jour — 1ᵉʳ juin 2026)

Le suivi opérationnel est tenu sur un board Trello à quatre colonnes. État courant :

| 📋 BACKLOG (V1 / V2) | 🎯 À FAIRE (Sprint 5) | 🔧 EN COURS / BLOQUÉ | ✅ DONE |
|---|---|---|---|
| US-003 Configs populaires | US-006 Responsive mobile | US-010 Prix catalogue *(bloqué : API)* | US-001/002/005/008 Découverte |
| US-009 Filtres catalogue | US-030 Images composants | US-028 Prix configurateur *(bloqué : API)* | US-011/012/014/015/017/018/019 Auth |
| US-022 Usage cible | US-004 Tarifs assemblage | US-039 Prix total *(bloqué : API)* | US-020-027, 031, 032, 038 Configurateur |
| US-029 Filtre prix | US-016 Remember me | | US-033/034/035 Compatibilité avancée |
| US-047-050 Panier | US-063 Modifier pseudo | | US-040-044 Configurations sauvegardées |
| US-051-055 Checkout + Stripe | US-064 Changer mot de passe | | US-061/062 Profil · US-085 404 |
| US-058/059 Suivi commande | US-074 Recherche utilisateurs | | US-069/071/072/073 Admin users |
| US-066/067 Adresses | | | US-075/076/077/078/079 Admin produits |
| US-070 Graphiques admin | | | US-084 Toasts · US-086/087 Tests |
| US-080 Import CSV | | | |
| US-013 OAuth · US-045 Partage | | | |
| US-036/037 IA · US-046 Export PDF | | | |
| US-056/057 Paiement · US-060 Notifs | | | |
| US-065 Avatar · US-068 RGPD | | | |

**Règles du board :** une carte = une user story (label priorité Critique/Haute/Moyenne/Basse + points). Une carte passe en *Done* uniquement quand sa Definition of Done est validée. Les cartes *Bloqué* portent une étiquette rouge précisant le bloqueur (ici : credentials API prix). Le board reflète le backlog de la section 8 ; il sert de support visuel à la revue de sprint lors de l'entrevue M2.

---

# Conclusion

PC Aeris part d'un constat simple et largement partagé : en 2026, **acheter un PC adapté à ses besoins reste un parcours du combattant**. Compatibilité, prix, expertise — trois questions auxquelles le marché n'apporte aujourd'hui aucune réponse simple, laissant l'acheteur seul face à la complexité. Le projet répond à ce problème par une plateforme qui prend ces trois questions en charge : un **configurateur à compatibilité garantie**, une **transparence radicale des prix** inspirée de StockX, et des **parcours adaptés à chaque profil**. Ce positionnement — *expertise + simplicité* — occupe un quadrant que ni les revendeurs techniques ni la grande distribution n'adressent.

**Sur le plan stratégique**, le dossier démontre la solidité de l'opportunité : un marché français d'environ 4 milliards d'euros par an, un segment gaming/workstation en croissance de 8 à 10 %, un modèle économique *asset-light* fondé sur des offres de montage à prix fixe (composants à prix coûtant) complété par des services, et des projections financières volontairement prudentes, avec montée en charge (~86 K€ à ~500 K€ de CA sur trois ans). L'étude de marché (SWOT, PESTEL, 5 forces de Porter) confirme un environnement favorable et une concurrence intense mais absente du créneau du sur-mesure simplifié.

**Sur le plan de l'exécution**, l'essentiel est déjà fait, et fait sérieusement. Le **MVP est fonctionnellement complet** : authentification robuste, configurateur couvrant les 8 catégories de composants avec ordre verrouillé et compatibilité vérifiée, configurations sauvegardées, back-office d'administration complet, identité visuelle conforme RGAA AA, et **67 tests automatisés** garantissant la non-régression. La méthode agile a été tenue de bout en bout — story map, backlog priorisé (87 user stories), user stories formatées, revues de sprint — et le travail est déployé en continu, en production. Le seul reliquat, l'affichage des prix, dépend de credentials API externes et non du produit lui-même : le code est prêt à les recevoir.

**Sur le plan des perspectives**, la trajectoire est claire et documentée sprint par sprint : clôture du MVP en juin 2026, **lancement de la V1 publique fin août** (panier, tunnel de commande, paiement Stripe, suivi des commandes), puis une V2 à partir de septembre portée par l'IA de recommandation et l'ouverture internationale. Pour franchir ces étapes, trois leviers sont identifiés : un amorçage de 35 000 €, une centaine de beta-testeurs sur les segments cibles, et des partenariats avec des créateurs de contenu.

En synthèse, PC Aeris n'est ni une idée sur le papier ni un prototype : c'est **un produit qui existe, un modèle qui tient, et une feuille de route qui s'exécute**. La vision reste la boussole du projet — *permettre à chacun d'obtenir le PC parfait pour ses besoins, sans stress, sans erreur, au juste prix* — et tout, du cadrage stratégique à la livraison technique, a été aligné pour la rendre atteignable.

---

*Rapport de projet — PC Aeris — Quentin Geoffroy — Juin 2026. Document consolidé à partir des sources internes : PITCH, BUSINESS_MODEL, ETUDE_MARCHE, BUSINESS_PLAN, ROADMAP_ORGANISATION, EQUIPE_IDEALE et docs/agile (story-map, backlog, user-stories, mvp-scope, roadmap, revues de sprint).*
