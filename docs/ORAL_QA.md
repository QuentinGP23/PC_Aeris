# Oral PFE — Questions / Réponses préparées

> Préparé le 19 juin 2026. Réponses **ancrées sur le projet réel** (code en production, 79 tests).
> Organisé selon les axes du barème : **Technique /20** · **Compétences (RNCP 34758 — Bloc 3)** · **Changement d'échelle** · **Produit / Business** · **Questions difficiles**.
> Principe : répondre court, factuel, et **assumer les limites** (un jury valorise l'honnêteté plus que la survente).

---

## 0. Pitch de cadrage (à avoir en tête)

**Stack** : React 19 + TypeScript + Vite + SCSS + Zustand (front) · Supabase Postgres + Auth + RLS + Edge Functions (back) · Vercel (déploiement continu) · CI GitHub (lint + build + 79 tests).
**Ce qui est livré** : configurateur avec moteur de compatibilité temps réel, catalogue, questionnaire→configs prêtes, panier→devis PDF→suivi de commande, carnet d'adresses, prix neuf (scrapés) + occasion (estimée), back-office admin, refonte visuelle + accessibilité.

---

## 1. TECHNIQUE (/20)

**Q. Décris ton architecture en 1 minute.**
Front React/TypeScript (Vite) déployé sur Vercel. Back-end = Supabase : Postgres pour les données, Auth pour les comptes, RLS pour la sécurité au niveau ligne, Edge Functions pour la logique serveur (ex. génération/envoi de devis). Pas de back-end maison à maintenir : c'est un choix *asset-light* côté infra qui me permet, seul, de couvrir tout le périmètre. État applicatif géré avec Zustand (configurateur, panier).

**Q. Pourquoi ce stack plutôt qu'un autre ?**
React/TS pour l'écosystème et la sûreté de typage ; Vite pour la vitesse de dev. Supabase parce qu'il me donne Postgres + Auth + sécurité RLS + fonctions serveur dans un seul service géré — en solo, je ne pouvais pas me permettre de maintenir une infra séparée. Vercel pour le déploiement continu à chaque push. Ce sont des choix orientés *vélocité d'un développeur seul* sans sacrifier la robustesse.

**Q. Comment marche le moteur de compatibilité ?**
À chaque sélection, je construis dynamiquement un filtre appliqué **côté SQL** (jointures `inner` PostgREST sur les tables de specs) : socket CPU↔carte mère, type de RAM (DDR4/DDR5), format boîtier↔carte mère, hauteur du ventirad, wattage de l'alim vs conso estimée. Les composants incompatibles **disparaissent** avant même que l'utilisateur se pose la question. L'ordre de sélection est verrouillé (CPU → carte mère → boîtier → RAM → GPU → …) pour que chaque filtre ait les pré-requis nécessaires, et une **cascade d'invalidation** retire automatiquement les choix devenus incompatibles.

**Q. Pourquoi filtrer côté SQL et pas côté client ?**
Parce que passer 1000+ identifiants dans une requête `.in()` faisait exploser la longueur d'URL de PostgREST (plantage au-delà de ~200 UUID). En poussant le filtre dans une jointure SQL, c'est la base qui filtre : robuste, rapide, et ça passe à l'échelle du catalogue (25 000 produits).

**Q. Et les prix ? C'est une vraie API ?**
Non, et c'est un choix assumé. Les API officielles (Amazon, eBay…) sont payantes ou exigent une validation de compte que je n'ai pas voulu engager au stade MVP. J'ai donc construit un **scraping multi-sources** : LDLC et Alternate.fr, les deux marchands FR qui exposent leurs prix dans le HTML servi. Pour chaque produit, j'interroge les deux **en parallèle** → fourchette **neuf** réelle (min/moyen/max multi-marchands). Le prix **occasion** est *estimé par décote* (catégorie + âge), clairement labellisé « estimé ». Garde-fous : délai minimum, coupe-circuit anti-blocage, matching strict (token-modèle + capacité totale + variantes Ti/XT) pour éviter les faux appariements.

**Q. La couverture prix est faible. Pourquoi ?**
Honnêtement : le scraping gratuit est lent (poli, ~1,5 s/produit) et **partiel** — il ne tarife que ce que LDLC/Alternate vendent réellement, surtout le récent. Le reste reste masqué, ce qui est cohérent (on ne vend pas de l'obsolète). C'est un socle qui se complète passe après passe ; à terme, soit on industrialise le scraping, soit on bascule sur une API payante quand le volume le justifie.

**Q. Comment tu garantis la qualité / non-régression ?**
79 tests automatisés (Vitest) sur la logique critique : moteur de compatibilité, ordre de sélection/cascade, modèle de prix (décote), services (auth, admin, configs). CI GitHub qui lance lint + typecheck + build + tests à chaque PR. ESLint strict (zéro warning toléré). TypeScript strict.

**Q. La sécurité ?**
Authentification Supabase + **RLS** (Row Level Security) : chaque utilisateur ne voit/modifie que ses données (ses configs, ses commandes), l'admin a un rôle dédié. La clé *service-role* (qui bypass RLS) n'est utilisée que dans des **scripts locaux** (scraping), jamais exposée au client. Pas de secret commité dans le repo. Les routes admin sont protégées côté front (rôle) et côté données (RLS).

**Q. Accessibilité ?**
Audit de contraste WCAG : tout le texte ≥ AA (4.5:1), vérifié au calcul de ratio. Remplacement de tous les emojis par un système d'icônes cohérent (Phosphor), avec `aria-label` sur les boutons d'action.

**Q. Performance / dette technique ?**
Build OK, mais le bundle dépasse 500 ko (warning Vite) à cause du PDF (jsPDF/html2canvas) — piste d'optim : code-splitting / import dynamique. J'ai fait une passe de nettoyage du code mort (composants/exports inutilisés supprimés, ~1900 lignes). C'est documenté et assumé comme dette à traiter en V1.

**Q. Démo live qui plante — tu fais quoi ?**
J'ai le site en prod (`pc-aeris.vercel.app`) + des captures de secours. Le déploiement est continu, donc ce que je montre = la branche `main`.

---

## 2. COMPÉTENCES / GESTION DE PROJET (RNCP 34758 — Bloc 3)

**Q. Comment as-tu organisé le projet (méthode) ?**
Agile, en sprints, avec un **backlog de 91 user stories** priorisées (Critique → Basse), une **story map** par activité/release, et une **Definition of Done** factorisée (DoD commune + spécificités par US). Tout est tracé sur GitHub : une branche par fonctionnalité, PR vers `develop`, puis `develop` → `main`. Chaque livraison est un incrément déployé.

**Q. Comment tu pilotes la livraison, seul ?**
Workflow Git discipliné : feature branch → PR (CI verte obligatoire : lint/build/tests) → merge `develop` → `main` → déploiement Vercel. Je ne merge jamais une PR rouge. Le périmètre MVP a été défini explicitement (doc `mvp-scope`) pour éviter le *scope creep* ; ce qui sort du MVP part en roadmap V1/V2.

**Q. Comment tu as géré les priorités / arbitrages ?**
Exemple concret : pour les prix, j'ai d'abord visé les API officielles, qui ont échoué (payantes/gatées). Plutôt que de bloquer le projet, j'ai **arbitré** vers une solution scraping — moins parfaite mais livrable — en assumant une couverture partielle. C'est un arbitrage *valeur livrée vs perfection*.

**Q. Management agile — mais tu es seul ?**
Aujourd'hui solo, donc j'applique la méthode à moi-même (sprints, revues, backlog). La compétence « management agile » se démontre dans la **structure** (rituels, traçabilité, DoD) prête à accueillir une équipe. La simulation d'équipe (cf. changement d'échelle) montre comment je passe de 1 à 6-7 personnes avec les mêmes rituels.

**Q. Qu'est-ce que tu aurais fait différemment ?**
Attaquer la question des prix plus tôt (j'ai perdu du temps sur les API avant de pivoter au scraping). Et mettre en place les tests E2E (Playwright) dès le configurateur plutôt qu'en V1.

---

## 3. CHANGEMENT D'ÉCHELLE (exigé RNCP)

**Q. Comment le projet passe à l'échelle techniquement ?**
Le front est statique sur CDN Vercel (scale automatique). Supabase Postgres monte en charge verticalement puis via read-replicas. Le point chaud, c'est la **donnée prix** : le scraping gratuit ne passe pas à l'échelle → à fort volume, on bascule sur une API payante ou un service de scraping managé (proxys résidentiels). Le catalogue (25k produits) et le moteur de compatibilité (filtre SQL) sont déjà dimensionnés.

**Q. L'équipe cible ?**
De 1 à ~6-7 : un **CTO/Lead dev** (passionné hardware), 2-3 devs, un **expert hardware** à temps partiel (BDD composants + règles de compat — c'est de la veille permanente), un **growth** et un **support**. Recrutement séquencé : CTO d'abord (V1), puis growth/support en phase de croissance. Rémunération modérée + equity pour les profils clés.

**Q. Build vs buy à l'échelle ?**
*Build* : le moteur de compatibilité et l'UX (c'est le cœur différenciant). *Buy* : paiement (Stripe), emails (service transactionnel), et à terme la donnée prix (API). On ne réinvente pas ce qui est commodité.

**Q. Budget pour scaler ?**
Amorçage 35 K€ pour 6-12 mois (dev 15k, marketing 10k, infra 3k, juridique 2k, trésorerie 5k). À l'échelle 12 mois suivante, ordre de grandeur ~320 K€ (équipe + acquisition), couvert par CA + levée/prêts. Sources : apport, love money, prêt d'honneur, BPI, concours.

**Q. Et la logistique d'assemblage si les volumes explosent ?**
Modèle *asset-light* : pas de stock. À faible volume, assemblage interne/partenaire local. À l'échelle, partenariats d'assembleurs régionaux pour tenir les délais sans immobiliser de capital. C'est la contrainte n°1 du passage à l'échelle côté opérations.

---

## 4. PRODUIT / MARCHÉ / BUSINESS

**Q. Différence concrète avec LDLC ?**
LDLC est un revendeur : il vend tout à tout le monde, affiche un prix, et exige que le client maîtrise la compatibilité. Aeris est une plateforme de **conseil** : on filtre par profil, on garantit la compatibilité, et on affiche une **fourchette de marché** (neuf + occasion) que personne n'affiche en France.

**Q. Le marché ? (chiffres sourcés)**
Marché FR du jeu vidéo : 5,7 Mds € en 2024 (SELL). Ventes PC gaming FR : +9,1 % (SELL 2024). Marché mondial du PC gaming : ~62 Mds $, CAGR ~13,5 % (Grand View Research).

**Q. Modèle économique ?**
Mix : commission PC assemblé (15-20 %), configuration composants (8-12 %), affiliation (3-7 %), service d'assemblage (79/129/199 €), garantie étendue, abonnement Pro (futur). Les **services** (marges élevées) compensent les marges faibles du hardware.

**Q. Projections ?**
Hypothèses prudentes : 10 → 25 → 50 commandes/mois sur 3 ans, panier ~1 200-1 300 € → CA 144 K€ / 375 K€ / 780 K€. Croissance par SEO intentionniste, partenariats YouTube tech, bouche-à-oreille (NPS cible > 40).

**Q. Qui finance la marge ? (question du jury sur le rapport)**
Le client paie le **juste prix marché** des composants (transparence) ; la marge vient du **montage/services** et du sourcing au meilleur prix, pas d'un surcoût caché sur les pièces.

---

## 5. QUESTIONS DIFFICILES / HONNÊTETÉ

**Q. Tu es seul, comment je sais que tu vas tenir ?**
La preuve est dans le code : MVP en production, 79 tests, déploiement continu, doc à jour. J'ai livré seul un périmètre large. La priorité n°1 dès la V1, c'est recruter un CTO.

**Q. Si Amazon copie demain ?**
Amazon est un marketplace de volume, pas de conseil personnalisé. Copier Aeris demanderait de construire une vraie expertise hardware et de renoncer à leur modèle — difficile culturellement. L'avance reste défendable 18-24 mois si on exécute.

**Q. Ton plus gros risque ?**
La notoriété zéro au lancement (marketing = plus gros poste). Mitigation : SEO faible-CAC, partenariats créateurs, bouche-à-oreille beta-testeurs.

**Q. Le scraping, c'est légal ?**
Zone grise : je reste en **faible volume**, poli (délai, User-Agent honnête, pas de contournement anti-bot), sur des **données publiques** (prix affichés), pour un usage projet. À l'échelle commerciale, on basculera sur des sources contractuelles (API/affiliation) pour être carré juridiquement.

**Q. Pourquoi pas de B2B (ticket plus élevé) ?**
Choix volontaire : le B2B exige commercial dédié, achats, logistique différente. On reste focalisé B2C sur-mesure + viralité. Un canal Pro pourra s'ouvrir en V2 si les volumes le justifient.

**Q. L'IA dans tout ça ?**
Aujourd'hui, l'« intelligence » c'est surtout le moteur de règles de compatibilité (déterministe, fiable). L'IA générative arrive en V2 pour la **recommandation** (analyser une config et suggérer des ajustements). Je ne survends pas : je n'ai pas mis d'IA là où des règles suffisent et sont plus fiables.

---

## Antisèche chiffres (à mémoriser)

- **79** tests · **25 423** composants en base · **8** catégories · **91** user stories
- Marché FR jeu vidéo **5,7 Mds €** (SELL 2024) · PC gaming FR **+9,1 %** · mondial **~62 Mds $ / +13,5 %** (Grand View)
- Panier **600-3 000 €** · projections CA **144 / 375 / 780 K€** · ask **35 K€**
- Marges : assemblé **15-20 %** · config **8-12 %** · assemblage **79/129/199 €**
- Prix : **neuf scrapé** (LDLC + Alternate.fr) · **occasion estimée** (décote)
