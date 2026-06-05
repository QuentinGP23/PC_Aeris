# Présentation finale — PC Aeris

> **Format :** script de présentation client/investisseur
> **Durée cible :** 18-22 minutes (1 min par slide + buffer Q/R)
> **Audience :** jury M2 dans le rôle de potentiels clients, investisseurs, partenaires
> **Angle :** projet produit, pas démo technique. Chaque affirmation est sourcée dans les docs produit.
> **Date de mise à jour :** 29 mai 2026

---

## Comment lire ce document

Chaque section ci-dessous correspond à **une slide de la présentation**. Pour chaque slide :

- **Titre slide** : ce qui s'affiche en grand
- **Visuel** : ce qu'on montre (graphique, capture, schéma, mockup)
- **Script** : ce qu'on dit à voix haute (à mémoriser dans les grandes lignes, pas mot pour mot)
- **Source** : doc projet d'où vient l'argument, pour répondre aux questions

Le tout fait ~16 slides pour 18-22 minutes de pitch, avec respiration pour les questions.

---

## SLIDE 1 — Couverture

**Titre slide**
```
PC Aeris
Le PC sur-mesure, enfin accessible à tous.

Quentin Guichard — M2 — 2026
```

**Visuel** : fond Aeris Dark, logo, baseline, photo de configuration PC en arrière-plan flouté.

**Script (30 sec)**
> "Bonjour. Je vais vous présenter PC Aeris, une plateforme qui répond à un problème vécu par des millions de Français : acheter un PC adapté à ses besoins reste, en 2026, un parcours du combattant. En 20 minutes, je vais vous montrer **pourquoi** on s'attaque à ce marché, **comment** on apporte une solution différente, **où en est** le produit aujourd'hui, et **ce qu'on cherche** pour la suite."

**Source** : PITCH.md (baseline), branding redesign Aeris Dark.

---

## SLIDE 2 — Le constat

**Titre slide**
```
Acheter un PC en 2026 :
toujours un parcours du combattant.
```

**Visuel** : 3 captures côte à côte montrant la complexité actuelle :
1. Une page LDLC avec 47 filtres techniques
2. Un tableur Excel de compatibilité fait maison
3. Un thread Reddit "Help me choose between RTX 4070 vs 4070 Super for my build"

**Script (1 min 30)**
> "Imaginons que vous voulez un PC pour jouer ou pour travailler en montage vidéo. Vous allez sur LDLC, sur Materiel.net, sur Amazon. Vous tombez sur des centaines de produits, du jargon — socket AM5, DDR5, M.2 NVMe Gen 4. Vous vous demandez : ces composants sont-ils compatibles entre eux ? Mon alimentation va-t-elle suffire pour ma carte graphique ? Est-ce que je paie le juste prix ou est-ce qu'on me prend pour une dinde ?
>
> Résultat documenté : la majorité des acheteurs abandonnent leur projet, ou passent **des heures de recherche** pour finalement faire un mauvais choix. C'est le problème central qu'on adresse."

**Source** : PITCH.md (les 3 frustrations), ETUDE_MARCHE.md (analyse SWOT — "méfiance croissante envers les PC pré-assemblés").

---

## SLIDE 3 — Les trois frustrations

**Titre slide**
```
Trois questions que tout acheteur se pose
— et auxquelles personne ne répond simplement.
```

**Visuel** : 3 cartes verticales, chacune avec une icône et une question :

```
┌───────────┐ ┌───────────┐ ┌───────────┐
│    ⚙️     │ │    💰     │ │    🎓     │
│           │ │           │ │           │
│ COMPAT.   │ │  PRIX     │ │ EXPERTISE │
│           │ │           │ │           │
│ Cette CG  │ │ Est-ce le │ │ Comment   │
│ est-elle  │ │ juste     │ │ choisir   │
│ compatible│ │ prix ?    │ │ sans tout │
│ ?         │ │           │ │ savoir ?  │
└───────────┘ └───────────┘ └───────────┘
```

**Script (1 min)**
> "Trois grandes questions reviennent à chaque achat. Compatibilité : les composants vont-ils marcher ensemble ? Prix : suis-je en train de payer le juste prix sur un marché où il fluctue chaque semaine ? Expertise : comment je choisis sans avoir passé 10 ans à monter des PC ?
>
> Aujourd'hui, ces trois questions exigent du client qu'il devienne expert lui-même. Notre conviction, c'est qu'on doit **prendre ces trois questions en charge** pour lui."

**Source** : PITCH.md (les 3 frustrations explicites).

---

## SLIDE 4 — Notre réponse

**Titre slide**
```
PC Aeris : vous nous dites ce que vous voulez faire,
nous nous occupons du reste.
```

**Visuel** : un schéma simple à 3 colonnes représentant le parcours :
```
[Vous]      →   [Configurateur Aeris]   →   [PC livré ou config validée]
USAGE           IA + règles de              ASSEMBLÉ ou COMMANDÉ
BUDGET          compatibilité +             selon le profil
PRÉFÉRENCES     transparence prix
```

**Script (1 min)**
> "La promesse de PC Aeris tient en une phrase : vous nous dites ce que vous voulez faire — gaming, montage, étude, télétravail — et nous prenons le reste en charge.
>
> Concrètement, ça se traduit par **trois piliers techniques** :
> - Un moteur de compatibilité qui filtre automatiquement les composants incompatibles avant même qu'on ait à se poser la question.
> - Un système de transparence des prix inspiré de StockX : fourchettes basse-moyenne-haute, neuf comme occasion, mises à jour en continu.
> - Des parcours adaptés à chaque profil — du débutant qui veut un PC clé en main au connaisseur qui veut tout ajuster lui-même."

**Source** : PITCH.md, BUSINESS_MODEL.md (proposition de valeur).

---

## SLIDE 5 — Trois profils, trois parcours

**Titre slide**
```
Une plateforme, trois portes d'entrée.
```

**Visuel** : tableau visuel à 3 colonnes :

| Pour les débutants | Pour les connaisseurs | Pour les pressés |
|---|---|---|
| 🎯 Questionnaire guidé | ⚙️ Configurateur libre | 🚀 PC pré-assemblés |
| (usage, budget, préférences) | (compatibilité auto en temps réel) | (testés, validés, livrés) |
| → Config recommandée | → Liberté totale + filets de sécurité | → Plug & play |

**Script (1 min)**
> "On ne croit pas qu'un seul parcours marche pour tout le monde. Quelqu'un qui achète son premier PC gaming n'a pas les mêmes attentes qu'un monteur freelance qui upgrade pour la 5e fois.
>
> Donc on propose trois portes d'entrée. Pour le débutant : un questionnaire qui débouche sur 2-3 configurations recommandées. Pour le connaisseur : un configurateur où il choisit composant par composant, mais où **chaque sélection met à jour la liste des composants restants compatibles**. Et pour les pressés : des configurations déjà assemblées et testées, prêtes à être livrées.
>
> Trois portes, une même promesse : zéro erreur, juste prix."

**Source** : PITCH.md (tableau profils), BUSINESS_MODEL.md (segments).

---

## SLIDE 6 — Le différenciateur prix

**Titre slide**
```
La transparence radicale des prix.
Inspirée de StockX, appliquée au hardware.
```

**Visuel** : mockup d'une fiche composant avec les 3 indicateurs prix :

```
┌─────────────────────────────────────┐
│   RTX 4070 Ti SUPER                 │
│                                     │
│   Prix BAS du marché :    789 €     │
│   Prix MOYEN :            845 €     │  ← (en gros et en couleur)
│   Prix HAUT :             920 €     │
│                                     │
│   Neuf + occasion. MAJ : il y a 2h. │
└─────────────────────────────────────┘
```

**Script (1 min 30)**
> "C'est probablement notre différenciation la plus forte commercialement. Aujourd'hui, sur les sites concurrents, vous voyez **un seul prix**. Celui du revendeur. Et vous n'avez aucune idée s'il est cher, bon marché, ou dans la moyenne du marché.
>
> Nous, pour chaque composant, on agrège plusieurs sources — Amazon, Rakuten, Cdiscount, eBay pour l'occasion — et on affiche trois indicateurs : prix bas, prix moyen, prix haut. Le client voit instantanément si ce qu'on lui propose est compétitif. À la fin de sa configuration, il a une **fourchette de prix réaliste**, pas un tarif fixe artificiel.
>
> Cette transparence n'existe chez aucun concurrent francophone aujourd'hui. C'est une barrière à l'entrée parce que c'est complexe à intégrer techniquement et qu'il faut maintenir les sources à jour en permanence."

**Source** : PITCH.md (section différenciation), scaffolding multi-sources prix livré en Sprint 2 (Amazon Partenaires / Rakuten / Cdiscount / eBay).

---

## SLIDE 7 — Démo produit

**Titre slide**
```
Le produit, aujourd'hui.
```

**Visuel** : 3-4 captures réelles de l'application :
1. Page d'accueil (hero + section configurateur)
2. Configurateur en action avec l'ordre verrouillé et le filtre de compatibilité actif
3. Configuration complète + fonctionnalité "Sauvegarder"
4. Espace admin (preuve que le back-office existe)

**URL démo** : https://pc-aeris.vercel.app (si déployée)

**Script (3 min — démo live ou enregistrée)**
> "Plutôt que de continuer à en parler, regardons-le.
>
> [démo] Voici la page d'accueil. On entre dans le configurateur. **L'ordre des composants est verrouillé** dans la logique de montage : CPU d'abord, puis carte mère filtrée automatiquement sur le bon socket, puis le boîtier en fonction du format de la carte mère, et ainsi de suite. **Si je sélectionne un boîtier ITX, les cartes mères ATX disparaissent immédiatement**.
>
> J'ai aussi un indicateur de complétude — quand les 8 composants sont sélectionnés, j'ai un badge ✓ Configuration complète. Et **je peux sauvegarder ma configuration** pour la retrouver plus tard ou la modifier.
>
> Côté admin, on a un back-office complet pour gérer le catalogue, les utilisateurs, les produits, leurs prix. Tout est déployé en continu sur Vercel.
>
> Ce que je vous montre, c'est **du vrai code en production** — pas une maquette, pas un prototype Figma."

**Source** : MVP livré (Sprints 1-5), PR #164 (ordre verrouillé), PR #169 (configs sauvegardées).

---

## SLIDE 8 — Le marché qu'on adresse

**Titre slide**
```
4 milliards d'euros par an en France.
+8 à 10 % de croissance sur notre segment.
```

**Visuel** : un grand chiffre central "~4 Mds €/an" et trois sous-chiffres :
- Marché PC France : ~4 Mds €/an
- Croissance gaming/workstation : +8 à 10 %/an
- Part du sur-mesure : en croissance, peu d'acteurs spécialisés

**Script (1 min)**
> "Quelques chiffres pour cadrer. Le marché du PC en France pèse environ 4 milliards d'euros par an. Le segment gaming et workstation, qui est notre cœur de cible, croît de 8 à 10 % par an. La part du sur-mesure, elle, augmente — parce que les acheteurs deviennent plus exigeants, plus informés, et veulent un produit qui leur ressemble.
>
> Et surtout, **peu d'acteurs sont spécialisés sur le sur-mesure simplifié**. Les revendeurs traditionnels parlent technique. Amazon parle prix. Personne ne parle simplicité. C'est notre créneau."

**Source** : ETUDE_MARCHE.md, BUSINESS_PLAN.md (section Marché).

---

## SLIDE 9 — Notre cible

**Titre slide**
```
5 segments, un point commun :
ils veulent du sur-mesure sans complexité.
```

**Visuel** : tableau visuel avec icônes et chiffres :

| Segment | Profil | Panier moyen | Volume potentiel |
|---|---|---|---|
| 🎮 Gamers débutants | 16-30 ans, premier PC gaming | 800 – 1 500 € | Élevé |
| 🎮 Gamers confirmés | 20-40 ans, upgrade régulier | 1 500 – 3 000 € | Moyen |
| 🎨 Créatifs / Freelances | Monteurs, graphistes, devs | 1 200 – 2 500 € | Moyen |
| 🎓 Étudiants tech | Écoles d'ingé, info | 600 – 1 200 € | Élevé |
| 💼 Pros individuels | Indépendants, consultants | 1 000 – 2 500 € | Moyen |

**Script (1 min 30)**
> "On a identifié cinq segments avec leurs paniers moyens et leur volume potentiel. Ce qui est intéressant, c'est que **les paniers moyens sont tous entre 600 et 3 000 €** — un terrain où le client est prêt à payer un peu plus pour la qualité du conseil et la garantie de compatibilité.
>
> Point important : **on ne fait pas de vente aux entreprises ni aux collectivités**. PC Aeris vend du sur-mesure unique, pas du volume standardisé. Un client peut commander plusieurs PC — un pour lui, un pour son enfant — mais chaque machine est personnalisée.
>
> Ce choix de cible nous oblige à exceller sur l'expérience individuelle plutôt que sur la massification."

**Source** : BUSINESS_MODEL.md (segments), BUSINESS_PLAN.md (cibles prioritaires).

---

## SLIDE 10 — Positionnement concurrentiel

**Titre slide**
```
Le quadrant inexploité.
```

**Visuel** : matrice 2x2 (axe vertical Expertise, axe horizontal Simplicité) avec positionnement des concurrents :

```
              EXPERTISE
                 ▲
                 │
        LDLC     │      ★ PC AERIS
     Materiel.net│
                 │
   ──────────────┼──────────────► SIMPLICITÉ
                 │
       TopAchat  │    PC pré-montés
                 │    (grande distrib)
                 │
```

**Script (1 min 30)**
> "Quand on positionne les acteurs du marché sur deux axes — expertise (à quel point on conseille) et simplicité (à quel point on est accessible) — on voit que **le quadrant haut-droite est vide**.
>
> LDLC et Materiel.net offrent de l'expertise, mais leur interface est technique, faite par et pour des connaisseurs. Les pré-montés de la grande distribution sont simples mais ne conseillent pas, ils vendent ce qu'ils ont en stock. Amazon ne conseille pas non plus, c'est une jungle.
>
> PC Aeris se positionne **expertise + simplicité**. C'est ce vide qu'on remplit. Et ce vide, il est exploitable parce que c'est un travail de produit difficile : il faut combiner data hardware, IA de compatibilité, design UX, et transparence prix. Pas un truc qu'un revendeur peut sortir en 3 mois."

**Source** : BUSINESS_PLAN.md (positionnement, matrice).

---

## SLIDE 11 — Le modèle économique

**Titre slide**
```
Comment on gagne de l'argent.
```

**Visuel** : un schéma circulaire avec les 3-4 sources de revenus :

```
       ┌─────────────────────────┐
       │  REVENUS PC AERIS       │
       │                         │
       │ • Montage à prix fixe   │ ← cœur du modèle
       │   Essentiel  79 €       │
       │   Confort   129 €       │
       │   Premium   199 €       │
       │ • Composants à coût     │   (sans marge)
       │ • Garantie / Abo (futur)│
       └─────────────────────────┘
```

**Script (1 min 30)**
> "Le modèle est simple et c'est important de bien le saisir : on ne prend pas de marge sur les composants — le client les paie au meilleur prix du marché. Ce qui nous rémunère, c'est le **montage**, vendu à prix fixe, via trois offres : Essentiel à 79 €, Confort à 129 € — la plus choisie —, et Premium à 199 € avec tuning, benchmarks et rapport de tests. Le prix total, c'est donc les composants au meilleur prix plus l'offre de montage choisie, soit environ 120 € de revenu en moyenne par commande.
>
> À ça s'ajouteront des **revenus complémentaires** : une garantie étendue optionnelle, et à terme un abonnement Pro pour les utilisateurs intensifs — alertes prix, configurations illimitées, historique.
>
> Le modèle est volontairement **asset-light** : on ne tient pas de stock. C'est une force pour le besoin en fonds de roulement, c'est une contrainte pour les délais de livraison qu'il faut maîtriser via les partenaires."

**Source** : BUSINESS_MODEL.md (sources de revenus), Sprint 5 (tarifs assemblage Essentiel/Confort/Premium).

---

## SLIDE 12 — Projections financières

**Titre slide**
```
Hypothèses prudentes, croissance par bouche-à-oreille.
```

**Visuel** : tableau de projection sur 3 ans avec un graphique en barres simple :

| Année | Commandes/mois | Panier moyen | CA annuel | Marge brute |
|---|---|---|---|---|
| N+1 | ~6 (montée) | 1 200 € | **~86 K€** | 10 – 13 K€ |
| N+2 | ~16 | 1 250 € | **~240 K€** | 29 – 36 K€ |
| N+3 | ~32 | 1 300 € | **~500 K€** | 60 – 75 K€ |

**Script (1 min 30)**
> "Voici nos projections. Ce sont des hypothèses **délibérément prudentes**, avec une montée en charge, pour une marque sans notoriété initiale. L'année 1 est une phase de lancement, autour de 6 commandes par mois en moyenne, puis 16 la seconde année et 32 la troisième. Avec un panier moyen entre 1 200 et 1 300 €.
>
> Ça nous met à environ 86 K€ de chiffre d'affaires la première année, **240 K€ la seconde, 500 K€ la troisième**. La marge brute, c'est essentiellement l'offre de montage — environ 10 % du chiffre d'affaires, les composants étant vendus à prix coûtant.
>
> Pour atteindre ces chiffres, on mise sur le **bouche-à-oreille** (taux de recommandation cible : 30 %), le **SEO** sur des requêtes très intentionnistes — 'PC gaming sur-mesure', 'configurateur compatible 2026' — et des **partenariats avec des créateurs YouTube tech/gaming**."

**Source** : BUSINESS_PLAN.md (projections financières + stratégie marketing).

---

## SLIDE 13 — État d'avancement

**Titre slide**
```
MVP livré à 95 %.
Le produit existe, en code, en production.
```

**Visuel** : timeline horizontale avec les sprints + jalons :

```
Jan-Mar 2026          Avril 2026              Mai 2026             Juin 2026
    │                     │                      │                    │
    ●─────────────────────●──────────────────────●────────────────────●
    Sprint 1              Sprints 2-3-4          Polish + Sprint 5    MVP COMPLET
    Foundations           Compat + Admin         Aeris Dark + Configs
    (57 pts)              (52 pts)               sauvegardées (16 pts)
                                                                       ▲
                                                                       │
                                                              Affichage UI prix
                                                              (bloqueur résiduel :
                                                              credentials API)
```

**Script (1 min 30)**
> "Aujourd'hui, le produit existe vraiment. Pas une slide, pas un rendu Figma — du code déployé qui marche.
>
> Sprint 1, de janvier à mars, on a posé les fondations : authentification, configurateur de base, design system. Sprints 2-3-4 en avril, sur 4 jours intensifs, on a complété les règles de compatibilité (GPU/PSU, boîtier/MOBO, stockage/MOBO) et écrit les premiers tests automatisés. En mai, on a fait deux choses : la refonte visuelle complète en thème sombre, et le bloc 'configurations sauvegardées' avec la migration de base de données et la sécurité fine.
>
> **Il reste 5 %** : c'est l'affichage des prix dans l'UI. Le code est prêt, mais on attend des credentials API auprès d'Amazon Partenaires et de Rakuten pour brancher les sources. Ce dossier est en cours et indépendant de la roadmap produit."

**Source** : docs/agile/sprint-1-review.md, sprint-2-3-4-review.md, mvp-scope.md (statut au 29 mai 2026).

---

## SLIDE 14 — Roadmap publique

**Titre slide**
```
Juin → août 2026 : V1 publique.
2027 : V2 avec IA et international.
```

**Visuel** : timeline simple sur 3 phases :

```
JUIN 2026          JUIL-AOÛT 2026          SEPT 2026 et au-delà
─────────          ────────────────        ────────────────────
MVP CLOS           V1 PUBLIQUE             V2

• Prix UI          • Panier + checkout     • IA de recommandation
• Responsive       • Stripe + emails       • OAuth Google
• Tarifs home      • Historique commandes  • Paiement multi-fois
                   • Partage configs       • Avatar / RGPD avancé
                   • Tests E2E             • App mobile
                                           • Multi-langue (EN/DE/ES)
```

**Script (1 min 30)**
> "La roadmap publique. Juin 2026, on ferme le MVP — c'est imminent. Juillet et août, on livre la V1 publique avec **le panier, le tunnel de commande complet, l'intégration Stripe** pour le paiement carte, les emails transactionnels, l'historique de commande, le partage de configuration par lien unique, et les tests end-to-end Playwright.
>
> À partir de septembre 2026, on entame la V2 : l'IA de recommandation qui analyse votre configuration et suggère des ajustements, le paiement en plusieurs fois, l'OAuth Google, et progressivement le multi-langue pour l'expansion européenne — anglais, allemand, espagnol.
>
> Cette roadmap est documentée sprint par sprint dans un backlog public que nos contributeurs et nos partenaires peuvent suivre."

**Source** : docs/agile/roadmap.md (Sprints 5-8 + V2), docs/agile/backlog.md (V2 features).

---

## SLIDE 15 — L'équipe et ce qu'on cherche

**Titre slide**
```
Aujourd'hui : 1 fondateur-développeur.
Demain : une équipe de passionnés.
```

**Visuel** : organigramme cible N+2 avec 6-7 profils :

```
              ┌─────────────────┐
              │  FONDATEUR/CEO  │   ← Aujourd'hui : moi
              └────────┬────────┘
                       │
         ┌─────────────┼─────────────┐
         ▼             ▼             ▼
    ┌─────────┐   ┌──────────┐  ┌──────────┐
    │  TECH   │   │ PRODUIT  │  │ BUSINESS │
    │         │   │          │  │          │
    │ • CTO   │   │ • Expert │  │ • Growth │
    │ • Dev × │   │   hard.  │  │ • Support│
    │   2-3   │   │          │  │          │
    └─────────┘   └──────────┘  └──────────┘
       3 pers       1 pers         2 pers
```

**Script (1 min 30)**
> "Aujourd'hui, le projet est porté en solo. J'ai assumé la stratégie, le produit, le développement, le design, l'infra, la documentation. C'est volontaire : avant de recruter, je voulais valider que je pouvais livrer un MVP fonctionnel et défendable.
>
> À l'horizon de la V1 publique, il me faudra **un CTO ou Lead Dev** — quelqu'un de passionné par le hardware autant que par le code, capable de prendre le relais technique. Un **expert hardware à temps partiel** pour maintenir la base de données composants et les règles de compatibilité, parce que c'est un travail spécialisé qui demande de la veille permanente. Et progressivement un **Growth marketing** ainsi qu'un **support client** pour la phase de croissance.
>
> La rémunération est modérée au lancement, compensée par de l'equity pour les profils clés."

**Source** : EQUIPE_IDEALE.md (organigramme, profils).

---

## SLIDE 16 — Ce qu'on demande / l'ask

**Titre slide**
```
Ce dont on a besoin maintenant.
```

**Visuel** : 3 colonnes avec des icônes :

```
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│       💰         │ │       👥         │ │       🤝         │
│                  │ │                  │ │                  │
│  35 000 €        │ │  100 beta-       │ │  Partenariats    │
│  d'amorçage      │ │  testeurs        │ │  YouTube,        │
│  (6-12 mois)     │ │                  │ │  presse tech     │
│                  │ │  Profil :        │ │                  │
│  • Dev (15k)     │ │  gamers,         │ │  Co-création de  │
│  • Marketing     │ │  créatifs,       │ │  configurations  │
│    (10k)         │ │  étudiants       │ │  recommandées    │
│  • Infra (3k)    │ │                  │ │                  │
│  • Juridique     │ │  Retour : tests  │ │  Trafic +        │
│    (2k)          │ │  utilisateurs    │ │  crédibilité     │
│  • Trésorerie    │ │  + témoignages   │ │                  │
│    (5k)          │ │                  │ │                  │
└──────────────────┘ └──────────────────┘ └──────────────────┘
```

**Script (1 min 30)**
> "Concrètement, ce qu'on cherche, ce sont trois choses.
>
> **Premièrement, un amorçage de 35 000 euros** pour les 6 à 12 prochains mois. Le détail : 15 000 sur le développement, 10 000 sur le marketing de lancement, 3 000 d'infra, 2 000 de juridique et 5 000 de trésorerie. Les sources envisagées : apport personnel, love money, prêt d'honneur Réseau Entreprendre ou Initiative France, BPI France, concours startups.
>
> **Deuxièmement, 100 beta-testeurs** sur les segments cibles — gamers, créatifs, étudiants — pour itérer sur l'UX et collecter des témoignages avant la V1 publique.
>
> **Troisièmement, des partenariats** avec des créateurs YouTube tech/gaming pour co-créer des configurations recommandées et générer du trafic. C'est le canal d'acquisition que j'ai identifié comme le plus efficace pour notre cible."

**Source** : BUSINESS_PLAN.md (besoins de financement, KPIs N+1).

---

## SLIDE 17 — Vision et closing

**Titre slide**
```
Permettre à chacun d'obtenir le PC parfait
pour ses besoins — sans stress, sans erreur,
au juste prix.
```

**Visuel** : la baseline en grand sur fond Aeris Dark + un QR code vers la démo et un email de contact.

**Script (45 sec)**
> "Pour conclure. La vision de PC Aeris, c'est de **rendre l'achat de PC sur-mesure aussi simple qu'une commande sur Doctolib**. Pas plus compliqué que ça. Et on est convaincu qu'on a la combinaison technique, design et économique pour y arriver.
>
> Le produit existe. Le modèle est défini. La roadmap est lisible. Il reste à exécuter — et c'est exactement là que j'ai besoin de vous.
>
> Merci. Je suis maintenant à votre disposition pour les questions."

**Source** : PITCH.md (vision finale).

---

## Q/R préparées (annexe pour préparer le débrief)

Voici les questions probables et les réponses préparées, sourcées dans les docs.

### "Comment vous différenciez-vous concrètement de LDLC ?"
→ Slide 10 + détail : LDLC est un revendeur, on est une plateforme de conseil. Eux vendent tout à tout le monde, nous on filtre selon le profil et l'usage. Eux affichent UN prix, on affiche une fourchette de marché. Eux exigent que le client maîtrise la compatibilité, on la garantit. (PITCH.md, BUSINESS_PLAN.md positionnement)

### "Pourquoi maintenant et pas il y a 5 ans ?"
→ Trois facteurs : 1) l'IA accessible (OpenAI etc.) rend les suggestions intelligentes possibles à coût raisonnable. 2) La méfiance croissante envers les PC pré-assemblés post-COVID. 3) La génération Z habituée au sur-mesure digital sur tous les autres marchés (vêtements, voyage, alimentation). (ETUDE_MARCHE.md SWOT)

### "Quel est votre principal risque ?"
→ Honnêtement, c'est la notoriété zéro au lancement. Le marketing est notre plus gros poste budgétaire. Mitigation : SEO sur des requêtes très intentionnistes (faible CAC), partenariats créateurs (effet de levier sur l'audience existante), bouche-à-oreille amorcé par les beta-testeurs. (BUSINESS_PLAN.md risques)

### "Vous êtes seul, comment je sais que vous allez tenir ?"
→ Le code est là, en production, déployé, testé (67 tests automatisés), documenté. C'est la preuve que je sais shipper. À partir de la V1 publique, le recrutement d'un CTO est ma priorité numéro 1. (EQUIPE_IDEALE.md, MVP Sprint 1-5)

### "Pourquoi pas vendre aux entreprises ? Le ticket moyen est plus élevé."
→ Choix volontaire. La vente B2B exigerait un commercial dédié, un service achat dédié, une logistique différente. On veut rester focalisé sur l'expérience individuelle et la viralité B2C. La V2 pourra ouvrir un canal Pro si les volumes le justifient. (BUSINESS_MODEL.md)

### "Comment vous gérez les marges faibles du hardware ?"
→ Justement, on ne se positionne pas sur le hardware nu. Les services à valeur ajoutée (assemblage 79-199€, garantie étendue, abonnement Pro à terme) ont des marges beaucoup plus élevées. C'est ce mix qui rend le modèle viable. (BUSINESS_MODEL.md)

### "Si Amazon décide de copier votre concept demain ?"
→ Amazon ne fait pas de conseil personnalisé, c'est un marketplace. Copier notre approche demanderait de construire une vraie expertise hardware et de renoncer à leur business model de volume. C'est culturellement et organisationnellement difficile pour eux. Notre avance reste défendable sur 18-24 mois si on exécute bien. (BUSINESS_MODEL.md avantages concurrentiels, ETUDE_MARCHE.md Porter)

---

## Checklist préparation slide deck

À faire avant la présentation effective :

- [ ] Adapter le contenu au template imposé par l'école (si applicable)
- [ ] Préparer 3-4 captures HD du produit en production
- [ ] Enregistrer une démo vidéo de backup (30 sec) au cas où la démo live ne fonctionne pas
- [ ] QR code vers la démo en ligne sur la slide de clôture
- [ ] Imprimer 2 exemplaires des projections financières en grand format en cas de question
- [ ] Préparer un one-pager A4 résumé à laisser à chaque membre du jury
- [ ] Vérifier que toutes les sources citées sont accessibles publiquement (docs/, PRs GitHub si demandé)
- [ ] Tester le timing sur 2 répétitions chronométrées

---

_Document de préparation — PC Aeris — 29 mai 2026_
