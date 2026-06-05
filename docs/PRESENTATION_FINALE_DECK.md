---
marp: true
theme: default
class: invert
paginate: true
size: 16:9
header: 'PC Aeris — Pitch M2'
footer: '© 2026 Quentin Guichard'
style: |
  /* — Aeris Dark theme — */
  section {
    background: #04040A;
    color: #F0F0FA;
    font-family: 'Inter', -apple-system, sans-serif;
    padding: 60px 80px;
  }
  section.invert {
    background: #04040A;
    color: #F0F0FA;
  }
  h1, h2, h3 {
    font-family: 'Space Grotesk', -apple-system, sans-serif;
    color: #F0F0FA;
    letter-spacing: -0.03em;
  }
  h1 { font-size: 60px; line-height: 1.1; }
  h2 { font-size: 44px; line-height: 1.15; }
  h3 { font-size: 28px; }
  p, li { font-size: 22px; line-height: 1.55; color: #B5B5C8; }
  strong { color: #F0F0FA; font-weight: 600; }
  em { color: #6366F1; font-style: normal; font-weight: 500; }
  a { color: #6366F1; }
  code { background: #09090F; color: #B5B5C8; padding: 2px 6px; border-radius: 4px; }
  blockquote {
    border-left: 3px solid #6366F1;
    padding-left: 20px;
    margin-left: 0;
    color: #B5B5C8;
    font-style: italic;
  }
  table { font-size: 20px; border-collapse: collapse; margin-top: 20px; }
  th, td { padding: 10px 14px; border-bottom: 1px solid rgba(255,255,255,0.08); text-align: left; }
  th { color: #8E8EA8; font-weight: 500; font-size: 16px; text-transform: uppercase; letter-spacing: 0.08em; }
  header, footer { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #6E6E80; }
  section::after { color: #6E6E80; font-family: 'JetBrains Mono', monospace; font-size: 14px; }
  .eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    color: #6366F1;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    margin-bottom: 16px;
  }
  .big-stat {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 96px;
    font-weight: 700;
    color: #F0F0FA;
    letter-spacing: -0.04em;
    line-height: 1;
    margin: 30px 0 10px;
  }
  .stat-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 16px;
    color: #8E8EA8;
    letter-spacing: 0.06em;
  }
  .cover h1 { font-size: 96px; }
  .cover { background: linear-gradient(180deg, #04040A 0%, #0a0a1a 100%); }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 32px; margin-top: 40px; }
  .card {
    background: #09090F;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    padding: 28px;
  }
  .card h3 { font-size: 22px; margin-bottom: 12px; }
  .card .ico { font-size: 36px; margin-bottom: 12px; display: block; }
  .closing h1 { font-size: 64px; max-width: 1100px; line-height: 1.2; }
---

<!-- _class: invert cover -->

<div class="eyebrow">PITCH M2 · 2026</div>

# PC Aeris

## Le PC sur-mesure, enfin accessible à tous.

<br>

**Quentin Guichard** — Fondateur

<!--
[30 sec]
Bonjour. Je vais vous présenter PC Aeris, une plateforme qui répond à un problème vécu par des millions de Français : acheter un PC adapté à ses besoins reste, en 2026, un parcours du combattant. En 20 minutes, je vais vous montrer pourquoi on s'attaque à ce marché, comment on apporte une solution différente, où en est le produit aujourd'hui, et ce qu'on cherche pour la suite.
-->

---

<div class="eyebrow">01 / LE PROBLÈME</div>

# Acheter un PC en 2026
# reste un *parcours du combattant*.

<br>

> "Cette carte graphique est-elle compatible avec ma carte mère ?"
> "Mon alimentation va-t-elle suffire ?"
> "Est-ce que je paie le juste prix ?"

**Résultat documenté :** la majorité des acheteurs **abandonnent** ou **passent des heures** pour finalement faire un mauvais choix.

<!--
[1 min 30]
Imaginons que vous voulez un PC pour jouer ou pour travailler en montage vidéo. Vous allez sur LDLC, sur Materiel.net, sur Amazon. Vous tombez sur des centaines de produits, du jargon — socket AM5, DDR5, M.2 NVMe Gen 4. Vous vous demandez : ces composants sont-ils compatibles entre eux ? Mon alimentation va-t-elle suffire pour ma carte graphique ? Est-ce que je paie le juste prix ?

Résultat documenté : la majorité des acheteurs abandonnent leur projet, ou passent des heures de recherche pour finalement faire un mauvais choix. C'est le problème central qu'on adresse.
-->

---

<div class="eyebrow">02 / TROIS FRUSTRATIONS</div>

# Trois questions, *zéro réponse simple*.

<div class="grid-3">

<div class="card">
<span class="ico">⚙️</span>
<h3>Compatibilité</h3>
<p>Cette CG est-elle compatible avec ma carte mère ? Mon ventirad rentre-t-il dans ce boîtier ?</p>
</div>

<div class="card">
<span class="ico">💰</span>
<h3>Prix</h3>
<p>Est-ce le juste prix ou je me fais avoir ? Combien ça vaut sur le marché de l'occasion ?</p>
</div>

<div class="card">
<span class="ico">🎓</span>
<h3>Expertise</h3>
<p>Comment je choisis sans avoir passé 10 ans à monter des PC ?</p>
</div>

</div>

<!--
[1 min]
Trois grandes questions reviennent à chaque achat. Compatibilité, prix, expertise.

Aujourd'hui, ces trois questions exigent du client qu'il devienne expert lui-même. Notre conviction, c'est qu'on doit prendre ces trois questions en charge pour lui.
-->

---

<div class="eyebrow">03 / NOTRE RÉPONSE</div>

# *Vous nous dites* ce que vous voulez faire.
# *Nous nous occupons* du reste.

<br>

| Vous              | →   | Configurateur Aeris        | →   | Résultat                  |
|-------------------|-----|----------------------------|-----|---------------------------|
| Usage             |     | IA + règles de compatibilité |   | Config validée            |
| Budget            |     | Transparence prix multi-sources |  | Devis fourchette         |
| Préférences       |     | Parcours adapté au profil     |  | PC livré ou à monter      |

<br>

**Trois piliers techniques** : moteur de compatibilité · transparence prix style StockX · parcours par profil.

<!--
[1 min]
La promesse de PC Aeris tient en une phrase. Concrètement, ça se traduit par trois piliers techniques :
- Un moteur de compatibilité qui filtre automatiquement les composants incompatibles avant même qu'on ait à se poser la question.
- Un système de transparence des prix inspiré de StockX : fourchettes basse-moyenne-haute, neuf comme occasion, mises à jour en continu.
- Des parcours adaptés à chaque profil — du débutant qui veut un PC clé en main au connaisseur qui veut tout ajuster lui-même.
-->

---

<div class="eyebrow">04 / TROIS PROFILS</div>

# Une plateforme, *trois portes d'entrée*.

<div class="grid-3">

<div class="card">
<span class="ico">🎯</span>
<h3>Débutants</h3>
<p><strong>Questionnaire guidé</strong> : usage, budget, préférences.</p>
<p>→ Configuration recommandée clé en main.</p>
</div>

<div class="card">
<span class="ico">⚙️</span>
<h3>Connaisseurs</h3>
<p><strong>Configurateur libre</strong> avec compatibilité en temps réel.</p>
<p>→ Liberté totale + filets de sécurité.</p>
</div>

<div class="card">
<span class="ico">🚀</span>
<h3>Pressés</h3>
<p><strong>PC pré-assemblés</strong> testés et validés.</p>
<p>→ Plug & play, livré sous 5 jours.</p>
</div>

</div>

<br>

> Trois portes, une même promesse : **zéro erreur, juste prix**.

<!--
[1 min]
On ne croit pas qu'un seul parcours marche pour tout le monde. Quelqu'un qui achète son premier PC gaming n'a pas les mêmes attentes qu'un monteur freelance qui upgrade pour la 5e fois.

Donc on propose trois portes d'entrée. Pour le débutant : un questionnaire qui débouche sur 2-3 configurations recommandées. Pour le connaisseur : un configurateur où il choisit composant par composant, mais où chaque sélection met à jour la liste des composants restants compatibles. Et pour les pressés : des configurations déjà assemblées et testées, prêtes à être livrées.
-->

---

<div class="eyebrow">05 / DIFFÉRENCIATEUR</div>

# La transparence radicale des prix.
# *Inspirée de StockX*, appliquée au hardware.

<br>

```
┌──────────────────────────────────────────┐
│   RTX 4070 Ti SUPER                      │
│                                          │
│   Prix BAS du marché :       789 €       │
│   Prix MOYEN :               845 €       │  ← affichage central
│   Prix HAUT :                920 €       │
│                                          │
│   Neuf + occasion · MAJ : il y a 2h      │
└──────────────────────────────────────────┘
```

**Chez les concurrents** : un seul prix, celui du revendeur. Aucune référence marché.
**Chez Aeris** : fourchette agrégée Amazon + Rakuten + Cdiscount + eBay. *Aucun concurrent francophone ne le fait.*

<!--
[1 min 30]
C'est probablement notre différenciation la plus forte commercialement. Aujourd'hui, sur les sites concurrents, vous voyez un seul prix. Celui du revendeur. Et vous n'avez aucune idée s'il est cher, bon marché, ou dans la moyenne du marché.

Nous, pour chaque composant, on agrège plusieurs sources et on affiche trois indicateurs. Le client voit instantanément si ce qu'on lui propose est compétitif. À la fin de sa configuration, il a une fourchette de prix réaliste, pas un tarif fixe artificiel.

Cette transparence n'existe chez aucun concurrent francophone aujourd'hui. C'est une barrière à l'entrée parce que c'est complexe à intégrer techniquement.
-->

---

<div class="eyebrow">06 / DÉMO</div>

# Le produit, *aujourd'hui*.

<br>

**En production. Code réel. Utilisable maintenant.**

→ Démo live (5 minutes) : `pc-aeris.vercel.app`

- Configurateur avec ordre verrouillé CPU → MOBO → boîtier → RAM → GPU
- Filtres de compatibilité en temps réel (socket, format, hauteur cooler...)
- Sauvegarde de configurations (compte utilisateur)
- Back-office admin complet (CRUD + édition prix)

<br>

> *"Pas une maquette, pas un prototype Figma. Du code en production, déployé en continu sur Vercel."*

<!--
[3 min — démo live ou enregistrée]
Plutôt que de continuer à en parler, regardons-le.

[démo] Voici la page d'accueil. On entre dans le configurateur. L'ordre des composants est verrouillé dans la logique de montage : CPU d'abord, puis carte mère filtrée automatiquement sur le bon socket, puis le boîtier en fonction du format de la carte mère, et ainsi de suite. Si je sélectionne un boîtier ITX, les cartes mères ATX disparaissent immédiatement.

J'ai aussi un indicateur de complétude — quand les 8 composants sont sélectionnés, j'ai un badge ✓ Configuration complète. Et je peux sauvegarder ma configuration pour la retrouver plus tard ou la modifier.

Côté admin, on a un back-office complet pour gérer le catalogue, les utilisateurs, les produits, leurs prix. Tout est déployé en continu sur Vercel.
-->

---

<div class="eyebrow">07 / MARCHÉ</div>

<div class="big-stat">~4 Mds €</div>
<div class="stat-label">MARCHÉ DU PC EN FRANCE / AN</div>

<br>

<div class="big-stat" style="font-size: 64px; color: #6366F1;">+8 à 10 %</div>
<div class="stat-label">CROISSANCE SEGMENT GAMING & WORKSTATION</div>

<br>

**La part du sur-mesure est en croissance — et peu d'acteurs sont spécialisés** sur le créneau du *sur-mesure simplifié*.

<!--
[1 min]
Quelques chiffres pour cadrer. Le marché du PC en France pèse environ 4 milliards d'euros par an. Le segment gaming et workstation, qui est notre cœur de cible, croît de 8 à 10 % par an. La part du sur-mesure, elle, augmente — parce que les acheteurs deviennent plus exigeants, plus informés, et veulent un produit qui leur ressemble.

Et surtout, peu d'acteurs sont spécialisés sur le sur-mesure simplifié. Les revendeurs traditionnels parlent technique. Amazon parle prix. Personne ne parle simplicité.
-->

---

<div class="eyebrow">08 / CIBLE</div>

# Cinq segments, *un point commun* : sur-mesure sans complexité.

<br>

| Segment | Profil | Panier moyen | Volume |
|---|---|---|---|
| 🎮 **Gamers débutants** | 16-30 ans, premier PC gaming | 800 – 1 500 € | Élevé |
| 🎮 **Gamers confirmés** | 20-40 ans, upgrade régulier | 1 500 – 3 000 € | Moyen |
| 🎨 **Créatifs / Freelances** | Monteurs, graphistes, devs | 1 200 – 2 500 € | Moyen |
| 🎓 **Étudiants tech** | Écoles d'ingé, info | 600 – 1 200 € | Élevé |
| 💼 **Pros individuels** | Indépendants, consultants | 1 000 – 2 500 € | Moyen |

<br>

**Pas de B2B grand compte.** PC Aeris vend du sur-mesure unique, pas du volume standardisé.

<!--
[1 min 30]
On a identifié cinq segments avec leurs paniers moyens et leur volume potentiel. Les paniers moyens sont tous entre 600 et 3 000 € — un terrain où le client est prêt à payer un peu plus pour la qualité du conseil et la garantie de compatibilité.

Point important : on ne fait pas de vente aux entreprises ni aux collectivités. PC Aeris vend du sur-mesure unique. Un client peut commander plusieurs PC — un pour lui, un pour son enfant — mais chaque machine est personnalisée.
-->

---

<div class="eyebrow">09 / POSITIONNEMENT</div>

# Le *quadrant inexploité*.

<br>

```
                EXPERTISE
                    ▲
                    │
        LDLC        │       ★ PC AERIS
     Materiel.net   │
                    │
   ─────────────────┼─────────────────► SIMPLICITÉ
                    │
       TopAchat     │     PC pré-montés
                    │     (grande distrib)
                    │
```

**LDLC / Materiel.net** : experts mais techniques, faits pour connaisseurs.
**Pré-montés grande distrib** : simples mais sans conseil.
**Amazon** : ni l'un ni l'autre, juste un marketplace.

**PC Aeris : expertise + simplicité.** Ce vide est exploitable parce qu'il est *difficile à construire*.

<!--
[1 min 30]
Quand on positionne les acteurs du marché sur deux axes — expertise et simplicité — le quadrant haut-droite est vide.

LDLC et Materiel.net offrent de l'expertise, mais leur interface est technique. Les pré-montés de la grande distribution sont simples mais ne conseillent pas. Amazon ne conseille pas non plus, c'est une jungle.

PC Aeris se positionne expertise + simplicité. Et ce vide est exploitable parce que c'est un travail de produit difficile : il faut combiner data hardware, IA de compatibilité, design UX, et transparence prix. Pas un truc qu'un revendeur peut sortir en 3 mois.
-->

---

<div class="eyebrow">10 / MODÈLE ÉCONOMIQUE</div>

# Comment on gagne de l'argent.

<br>

| Source | Marge / Prix |
|---|---|
| **PC assemblé clé en main** | 15 – 20 % |
| **Configuration (composants)** | 8 – 12 % |
| **Affiliation partenaires** | 3 – 7 % |
| **Service d'assemblage** | 79 € / 129 € / 199 € |
| **Garantie étendue** | 30 – 80 € |
| **Abonnement Pro (futur)** | 5 – 10 € / mois |

<br>

> Modèle **asset-light** : *pas de stock*, pas de BFR élevé. Mix services / hardware pour absorber les marges faibles du composant.

<!--
[1 min 30]
Le modèle économique combine plusieurs sources. La plus importante : la commission sur les PC assemblés clé en main, entre 15 et 20 % de marge. Sur les configurations 8 à 12 %. Sur l'affiliation 3 à 7 %.

À ça s'ajoutent des revenus complémentaires : un service d'assemblage facturé entre 79 et 199 € selon le niveau de finition. Une garantie étendue. Et à terme un abonnement Pro pour les utilisateurs intensifs.

Le modèle est volontairement asset-light : on ne tient pas de stock. C'est une force pour le besoin en fonds de roulement.
-->

---

<div class="eyebrow">11 / PROJECTIONS</div>

# Hypothèses *prudentes*, croissance par bouche-à-oreille.

<br>

| Année | Commandes / mois | Panier moyen | CA annuel | Marge brute |
|---|---|---|---|---|
| **N+1** | ~6 (montée) | 1 200 € | **~86 K€** | 10 – 13 K€ |
| **N+2** | ~16 | 1 250 € | **~240 K€** | 29 – 36 K€ |
| **N+3** | ~32 | 1 300 € | **~500 K€** | 60 – 75 K€ |

<br>

**Hypothèses délibérément basses** pour une marque sans notoriété initiale. Croissance conditionnée à :
- **SEO** sur requêtes intentionnistes (CAC faible)
- **Partenariats** créateurs YouTube tech/gaming (effet de levier)
- **Bouche-à-oreille** des beta-testeurs (objectif NPS > 40)

<!--
[1 min 30]
Voici nos projections. Ce sont des hypothèses délibérément prudentes, avec une montée en charge. Année 1 de lancement : environ 6 commandes par mois en moyenne, puis 16 la seconde année, 32 la troisième. Panier moyen entre 1 200 et 1 300 €.

Ça nous met à environ 86 K€ la première année, 240 K€ la seconde, 500 K€ la troisième. La marge brute, c'est l'offre de montage — environ 10 % du chiffre d'affaires, les composants étant à prix coûtant.

Pour atteindre ces chiffres, on mise sur le bouche-à-oreille, le SEO sur des requêtes très intentionnistes, et des partenariats avec des créateurs YouTube.
-->

---

<div class="eyebrow">12 / ÉTAT D'AVANCEMENT</div>

<div class="big-stat" style="color: #6366F1;">95 %</div>
<div class="stat-label">MVP LIVRÉ AU 29 MAI 2026</div>

<br>

**Le produit existe vraiment** — code déployé, 67 tests automatisés, documentation à jour.

- **Sprint 1** (jan-mars) : fondations · auth · configurateur · admin · design system
- **Sprints 2-4** (avril) : compat complète · admin CRUD · tests
- **Mai** : refonte Aeris Dark + ordre verrouillé + configs sauvegardées

**5 % restant** : affichage UI des prix (UI prête, bloqué sur credentials API en cours).

<!--
[1 min 30]
Aujourd'hui, le produit existe vraiment. Pas une slide, pas un rendu Figma — du code déployé qui marche.

Sprint 1, de janvier à mars, on a posé les fondations. Sprints 2-3-4 en avril, sur 4 jours intensifs, on a complété les règles de compatibilité et écrit les premiers tests automatisés. En mai, refonte visuelle complète en thème sombre + bloc configurations sauvegardées avec migration BDD et sécurité fine.

Il reste 5 % : l'affichage des prix dans l'UI. Le code est prêt, on attend des credentials API auprès d'Amazon Partenaires et de Rakuten.
-->

---

<div class="eyebrow">13 / ROADMAP</div>

# *Juin → août 2026* : V1 publique.

<br>

| Phase | Période | Contenu |
|---|---|---|
| **MVP clos** | Juin 2026 | Prix UI · Responsive · Tarifs home |
| **V1 publique** | Juil–Août 2026 | Panier · Stripe · Emails · Historique cmd · Partage configs · Tests E2E |
| **V2** | Sept 2026+ | IA recommandation · OAuth Google · Paiement multi-fois · App mobile · Multi-langue |

<br>

> Backlog public, sprint par sprint, traçable sur GitHub.

<!--
[1 min 30]
La roadmap publique. Juin 2026, on ferme le MVP. Juillet et août, on livre la V1 publique avec le panier, le tunnel de commande complet, l'intégration Stripe pour le paiement carte, les emails transactionnels, l'historique de commande, le partage de configuration par lien unique, et les tests end-to-end Playwright.

À partir de septembre, V2 : l'IA de recommandation, le paiement en plusieurs fois, l'OAuth Google, et progressivement le multi-langue pour l'expansion européenne.
-->

---

<div class="eyebrow">14 / ÉQUIPE</div>

# Aujourd'hui : *1 fondateur-développeur*.
# Demain : *6-7 personnes*.

<br>

```
              ┌─────────────────┐
              │  FONDATEUR/CEO  │   ← Aujourd'hui : Quentin Guichard
              └────────┬────────┘
                       │
         ┌─────────────┼─────────────┐
         ▼             ▼             ▼
    ┌─────────┐   ┌──────────┐  ┌──────────┐
    │  TECH   │   │ PRODUIT  │  │ BUSINESS │
    │ CTO + 2 │   │ Expert HW│  │ Growth + │
    │ devs    │   │ partiel  │  │ Support  │
    └─────────┘   └──────────┘  └──────────┘
```

**Prochains recrutements critiques** :
1. **CTO / Lead Dev** passionné hardware (V1 publique)
2. **Expert hardware** temps partiel (BDD composants, règles compat)
3. **Growth marketing** + **Support client** (phase croissance N+2)

<!--
[1 min 30]
Aujourd'hui, le projet est porté en solo. J'ai assumé la stratégie, le produit, le développement, le design, l'infra, la documentation. C'est volontaire : avant de recruter, je voulais valider que je pouvais livrer un MVP fonctionnel et défendable.

À l'horizon de la V1 publique, il me faudra un CTO ou Lead Dev — quelqu'un de passionné par le hardware autant que par le code. Un expert hardware à temps partiel. Et progressivement un Growth marketing ainsi qu'un support client.

La rémunération est modérée au lancement, compensée par de l'equity pour les profils clés.
-->

---

<div class="eyebrow">15 / L'ASK</div>

# Ce dont on a *besoin maintenant*.

<div class="grid-3">

<div class="card">
<span class="ico">💰</span>
<h3>35 000 €</h3>
<p><strong>Amorçage 6-12 mois</strong></p>
<p>Dev 15k · Marketing 10k · Infra 3k · Juridique 2k · Trésorerie 5k</p>
</div>

<div class="card">
<span class="ico">👥</span>
<h3>100 beta-testeurs</h3>
<p><strong>Gamers, créatifs, étudiants</strong></p>
<p>Retours UX, témoignages, NPS avant la V1</p>
</div>

<div class="card">
<span class="ico">🤝</span>
<h3>Partenariats</h3>
<p><strong>YouTube tech / gaming</strong></p>
<p>Co-création de configurations recommandées + trafic + crédibilité</p>
</div>

</div>

<br>

**Sources de financement envisagées** : apport perso · love money · prêt d'honneur Réseau Entreprendre / Initiative France · BPI France · concours startups.

<!--
[1 min 30]
Concrètement, ce qu'on cherche, ce sont trois choses.

Premièrement, un amorçage de 35 000 euros pour les 6 à 12 prochains mois. Les sources envisagées : apport personnel, love money, prêt d'honneur, BPI France, concours startups.

Deuxièmement, 100 beta-testeurs sur les segments cibles pour itérer sur l'UX et collecter des témoignages.

Troisièmement, des partenariats avec des créateurs YouTube pour co-créer des configurations recommandées et générer du trafic.
-->

---

<!-- _class: invert closing -->

<div class="eyebrow">FIN · MERCI</div>

# Permettre à chacun d'obtenir
# *le PC parfait* pour ses besoins
# — sans stress, sans erreur, au juste prix.

<br>
<br>

**Démo** → `pc-aeris.vercel.app`
**Contact** → quentgeoffpit000@gmail.com

<br>

*Questions ?*

<!--
[45 sec]
Pour conclure. La vision de PC Aeris, c'est de rendre l'achat de PC sur-mesure aussi simple qu'une commande sur Doctolib. Pas plus compliqué que ça. Et on est convaincu qu'on a la combinaison technique, design et économique pour y arriver.

Le produit existe. Le modèle est défini. La roadmap est lisible. Il reste à exécuter — et c'est exactement là que j'ai besoin de vous.

Merci. Je suis maintenant à votre disposition pour les questions.
-->
