# Business Model — PC Aeris

---

## 1. Proposition de valeur

| Segment            | Valeur délivrée                                                          |
| ------------------ | ------------------------------------------------------------------------ |
| **Débutants**      | Accès simplifié au PC sur-mesure sans connaissances techniques           |
| **Connaisseurs**   | Gain de temps grâce à l'IA de suggestion et compatibilité garantie       |
| **Professionnels** | Configurations optimisées pour des usages spécifiques (3D, montage, dev) |
| **Tous**           | Transparence des prix (fourchettes marché neuf/occasion)                 |

**Promesse centrale** : obtenir le PC parfait pour ses besoins, sans stress, sans erreur, au juste prix.

---

## 2. Segments de clientèle

**Cible exclusive : particuliers et professionnels individuels.**

PC Aeris ne vend pas en gros. Chaque configuration est unique et sur-mesure. Un client peut commander plusieurs PC, mais chaque machine est personnalisée — pas de commandes en lot standardisées.

| Segment                    | Profil                                        | Budget moyen    | Volume potentiel |
| -------------------------- | --------------------------------------------- | --------------- | ---------------- |
| Gamers débutants           | 16-30 ans, premier PC gaming                  | 800 - 1 500 €   | Élevé            |
| Gamers confirmés           | 20-40 ans, upgrade régulier                   | 1 500 - 3 000 € | Moyen            |
| Créatifs / Freelances      | Monteurs, graphistes, développeurs            | 1 200 - 2 500 € | Moyen            |
| Étudiants tech             | Écoles d'ingé, informatique                   | 600 - 1 200 €   | Élevé            |
| Professionnels individuels | Indépendants, consultants, auto-entrepreneurs | 1 000 - 2 500 € | Moyen            |

> **Note** : pas de vente aux entreprises, écoles ou collectivités. Le modèle repose sur des configurations uniques, pas sur du volume standardisé.

---

## 3. Sources de revenus

### Modèle principal : offres de montage à prix fixe

Le client paie **les composants au meilleur prix du marché** — sans marge de notre part — **plus une offre de montage à prix fixe**. C'est le montage qui constitue notre revenu, et non un pourcentage prélevé sur les composants. Prix total client = composants + offre de montage.

| Offre                          | Prix  | Inclus                                                                       |
| ------------------------------ | ----- | ---------------------------------------------------------------------------- |
| **Essentiel**                  | 79 €  | Montage, câble management de base, test POST + démarrage Windows             |
| **Confort** _(la plus choisie)_ | 129 € | + câblage premium, installation Windows + drivers, profil courbes ventilateurs |
| **Premium**                    | 199 € | + benchmarks 3DMark/Cinebench, profil XMP/EXPO, rapport de tests livré        |

> Revenu moyen par commande ≈ **120 €** (mix des trois offres).

### Revenus complémentaires (à venir)

| Source                   | Description                                                              |
| ------------------------ | ------------------------------------------------------------------------ |
| **Garantie étendue**     | Extension de garantie sur les PC assemblés                               |
| **Abonnement Pro**       | Fonctionnalités avancées (alertes prix, historiques, configs illimitées) |
| **Affiliation**          | Rémunération éventuelle sur le sourcing des composants                   |
| **Partenariats marques** | Mise en avant de produits sponsorisés (avec transparence)                |

### Projection revenus (hypothèse réaliste)

| Année | Commandes/mois | Panier moyen | CA annuel estimé |
| ----- | -------------- | ------------ | ---------------- |
| N+1   | ~6 (montée)    | 1 200 €      | ~86 000 €        |
| N+2   | ~16            | 1 250 €      | ~240 000 €       |
| N+3   | ~32            | 1 300 €      | ~500 000 €       |

_Marge brute ≈ l'offre de montage, soit ~10 % du CA (les composants sont vendus à prix coûtant)_

> **Note** : projections prudentes pour une marque sans notoriété. Croissance conditionnée au bouche-à-oreille et aux partenariats.

### Justification du panier moyen (1 200 - 1 300 €)

Le panier moyen retenu n'est pas arbitraire : c'est la **moyenne pondérée des budgets des cinq segments cibles** (§2), qui s'échelonnent de 600 € (étudiants) à 3 000 € (gamers confirmés). La valeur de 1 200-1 300 € est **volontairement conservatrice** : elle se situe dans le bas de la fourchette des segments à plus forte valeur (créatifs 1 200-2 500 €, gamers confirmés 1 500-3 000 €), faisant l'hypothèse qu'au lancement la clientèle penchera davantage vers les **débutants et étudiants** (paniers plus modestes). La légère progression d'année en année (1 200 → 1 250 → 1 300 €) traduit une montée en gamme attendue à mesure que la notoriété attire des profils plus exigeants.

---

## 4. Canaux de distribution

| Canal                       | Rôle                                                      |
| --------------------------- | --------------------------------------------------------- |
| **Site web (responsive)**   | Canal principal — configurateur, commandes, espace client |
| **Application mobile**      | Phase 2 — consultation, suivi commandes                   |
| **Réseaux sociaux**         | Acquisition, communauté, contenus éducatifs               |
| **YouTube / Twitch**        | Partenariats créateurs gaming/tech                        |
| **SEO / Content marketing** | Guides, comparatifs, tutoriels                            |
| **GEO** _(Generative Engine Optimization)_ | Être cité par les IA génératives (ChatGPT, Perplexity, Google AI Overviews) quand un utilisateur demande conseil sur sa config — canal émergent, à fort potentiel pour une cible déjà adepte des assistants IA |

---

## 5. Relation client

| Type                 | Mécanisme                                                  |
| -------------------- | ---------------------------------------------------------- |
| **Self-service**     | Configurateur autonome, FAQ, guides                        |
| **Assistance**       | Chat en ligne, support email                               |
| **Communauté**       | Forum utilisateurs, partage de configurations              |
| **Personnalisation** | Recommandations basées sur l'historique et les préférences |

---

## 6. Ressources clés

| Ressource                       | Description                                                 |
| ------------------------------- | ----------------------------------------------------------- |
| **Plateforme technique**        | Application web React/TypeScript, backend, IA de suggestion |
| **Base de données composants**  | Référentiel exhaustif avec specs, compatibilités, prix      |
| **Algorithme de compatibilité** | Moteur de règles + IA pour suggestions intelligentes        |
| **Réseau fournisseurs**         | Accès aux grossistes et marketplaces                        |
| **Équipe**                      | Développement, expertise hardware, marketing, support       |

---

## 7. Activités clés

1. **Développement produit** — amélioration continue du configurateur et de l'IA
2. **Curation données** — mise à jour des composants, prix, compatibilités
3. **Acquisition clients** — marketing digital, SEO, partenariats
4. **Gestion commandes** — sourcing, assemblage, expédition
5. **Support client** — accompagnement, SAV, garanties

---

## 8. Partenaires clés

| Partenaire                   | Rôle                                                       |
| ---------------------------- | ---------------------------------------------------------- |
| **Grossistes hardware**      | Approvisionnement composants (ex: Ingram Micro, Also)      |
| **Marketplaces**             | Comparaison prix, affiliation (Amazon, LDLC, Materiel.net) |
| **Créateurs de contenu**     | Visibilité, crédibilité (YouTubers tech/gaming)            |
| **Prestataires logistiques** | Livraison, gestion stocks                                  |
| **Assembleurs partenaires**  | Sous-traitance assemblage si besoin                        |

---

## 9. Structure de coûts

### Coûts fixes

| Poste                                  | Estimation mensuelle  |
| -------------------------------------- | --------------------- |
| Hébergement / Infra cloud              | 200 - 500 €           |
| Outils SaaS (analytics, support, etc.) | 100 - 300 €           |
| Salaires / Prestataires                | Variable selon équipe |
| Marketing récurrent                    | 500 - 2 000 €         |

### Coûts variables

| Poste                  | % du CA     |
| ---------------------- | ----------- |
| Coût des composants    | 80 - 88 %   |
| Logistique / Livraison | 2 - 4 %     |
| Frais de paiement      | 1,5 - 2,5 % |
| SAV / Retours          | 1 - 2 %     |

---

## 10. Indicateurs clés (KPIs)

| Catégorie       | KPI                                                                    |
| --------------- | ---------------------------------------------------------------------- |
| **Acquisition** | Visiteurs uniques, taux de conversion, CAC (coût d'acquisition client) |
| **Engagement**  | Configurations créées, temps passé, taux de sauvegarde                 |
| **Conversion**  | Taux commande, panier moyen, taux d'abandon                            |
| **Rétention**   | Taux de réachat, NPS (satisfaction), taux de recommandation            |
| **Financier**   | Marge brute, marge nette, LTV (valeur vie client)                      |

---

## 11. Avantages concurrentiels durables

| Avantage                | Barrière à l'entrée                            |
| ----------------------- | ---------------------------------------------- |
| **IA de compatibilité** | Temps de développement + données propriétaires |
| **Transparence prix**   | Intégration multi-sources complexe             |
| **UX simplifiée**       | Design thinking + itérations utilisateurs      |
| **Communauté**          | Effet réseau, configurations partagées         |
| **Marque de confiance** | Réputation à construire dans la durée          |

---

## 12. Risques et mitigations

| Risque                                | Impact | Mitigation                              |
| ------------------------------------- | ------ | --------------------------------------- |
| Concurrence des géants (LDLC, Amazon) | Élevé  | Différenciation UX + niche sur-mesure   |
| Ruptures de stock composants          | Moyen  | Multi-sourcing, alertes automatiques    |
| Revenu adossé au seul montage         | Moyen  | Montée en gamme des offres (Confort/Premium), revenus complémentaires (garantie, abonnement Pro) |
| Évolution technologique rapide        | Faible | **Plutôt une opportunité** : relance le besoin de conseil et d'upgrade (récurrence). Veille continue. |
| Dépendance aux partenaires            | Moyen  | Diversification fournisseurs            |

---

## Synthèse Business Model Canvas

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
│                 │                 │     CLIENT      │
│ • Plateforme    │                 │                 │
│ • BDD composants│                 │ • Self-service  │
│ • Algo IA       │                 │ • Chat/Support  │
│ • Équipe        │                 │ • Communauté    │
├─────────────────┴─────────────────┼─────────────────┤
│         STRUCTURE DE COÛTS        │     REVENUS     │
│                                   │                 │
│ • Infra technique                 │ • Montage       │
│ • Marketing                       │   79/129/199 €  │
│ • Équipe (variable)               │ • Garantie      │
│ • Composants (à prix coûtant)     │ • Abo Pro       │
│                                   │ • Affiliation   │
└───────────────────────────────────┴─────────────────┘
```

---

_Document de travail — PC Aeris — mis à jour le 15 juin 2026_
