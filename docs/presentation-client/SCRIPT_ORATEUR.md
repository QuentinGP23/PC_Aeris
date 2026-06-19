# Script orateur — Présentation PC Aeris (investisseur / jury)

**Durée : ~20 min** = ~15 min de parole + **démo 5 min max** (slide 7). 20 slides.
Texte **à dire mot pour mot** (tu peux paraphraser, mais tout y est). Les *(indications)* en italique ne se disent pas. La pagination du deck (bas de slide) correspond aux numéros ci-dessous.

**Avant de commencer :** `index.html` en plein écran (touche **F**). Navigation **→ / ←**. Onglet **pc-aeris.vercel.app** déjà ouvert à côté, **connecté à ton compte**, configurateur vide.

> ⚠️ **Honnêteté à tenir** : prix **et** benchmarks sont réels et en base (PassMark : 733 CPU + 982 GPU ; prix neuf scrapés chez **LDLC + Alternate.fr**). Le **neuf** est réel et scrapé ; l'**occasion** est affichée mais **estimée par décote** (catégorie + ancienneté), clairement labellisée « estimée » — ce n'est pas un relevé de marché. Seule nuance restante : la **couverture prix** du catalogue est encore **partielle** (on tarife par lots, le scraping est lent et poli). Présente prix + perf/prix comme opérationnels, sans prétendre que tout le catalogue est tarifé.

> 🎯 **Ce que le jury évalue** (garde-le en tête) : le **technique** (code, archi, Git, tests, accessibilité, design system → slides 7-8) **et** le **Bloc 3 RNCP** — organisation, pilotage, management agile, recrutement, inclusion (→ slides 15-18). Les slides « Passage à l'échelle » sont là pour ça : assume-les, c'est de la matière à points.

---

## Slide 1 — Couverture *(~35 s)*

> « Bonjour, et merci de m'accueillir. Je m'appelle Quentin Geoffroy, et je vais vous présenter **PC Aeris**.
>
> PC Aeris, c'est une plateforme web avec une ambition simple à formuler, mais difficile à réaliser : rendre le **PC sur-mesure accessible à tout le monde**, et pas seulement aux initiés.
>
> Dans les vingt prochaines minutes, je vais vous montrer le problème qu'on règle, ce qui nous différencie, le produit — qui est déjà en ligne, et que je vous ferai tester en direct — la technique qui le porte, le modèle économique et sa rentabilité, puis comment on passerait à l'échelle, et enfin ce qu'on recherche. Allons-y. »

*(Transition : passer à la slide 2.)*

---

## Slide 2 — Le problème *(~1 min 10)*

> « Commençons par le problème, parce qu'il est plus profond qu'il n'y paraît.
>
> Aujourd'hui, si vous voulez acheter un PC vraiment adapté à vos besoins, vous entrez dans un véritable parcours du combattant. Il y a des dizaines de sites, des centaines de composants, et un jargon technique totalement opaque pour le commun des mortels.
>
> Et très vite, l'acheteur se retrouve seul face à trois questions qu'il est incapable de trancher : *est-ce que cette carte graphique est compatible avec cette carte mère ? Est-ce que mon alimentation est assez puissante ? Et surtout : est-ce que je paie le juste prix, ou est-ce que je me fais avoir ?*
>
> Le résultat, c'est que la grande majorité des gens **abandonnent** leur projet, ou alors y passent des heures pour, au final, faire un mauvais choix. C'est exactement cette frustration qu'on attaque de front. »

*(Transition : « Et notre réponse, elle tient d'abord dans une promesse. »)*

---

## Slide 3 — La solution *(~55 s)*

> « Notre réponse, c'est PC Aeris : une plateforme qui **démocratise le PC sur-mesure**.
>
> Notre promesse, on la résume en une phrase : *vous nous dites ce que vous voulez faire de votre PC, et nous, on s'occupe de tout le reste.*
>
> Concrètement, ça repose sur trois engagements. Un : la **compatibilité est garantie** — impossible de se tromper. Deux : les **prix sont transparents** — vous savez ce que vous payez, et pourquoi. Trois : l'expérience **s'adapte à votre niveau**, du débutant complet au passionné qui veut tout optimiser. »

*(Transition : « Voyons comment ça se traduit, selon qui vous êtes. »)*

---

## Slide 4 — Trois parcours *(~1 min 05)*

> « On a conçu trois portes d'entrée, une pour chaque profil — et les trois existent réellement dans le produit, je vous les montrerai.
>
> Pour les **débutants**, un **questionnaire** : deux ou trois questions simples — quel usage, quel niveau de performance — et la plateforme propose directement une configuration complète, optimisée et garantie compatible.
>
> Pour les **connaisseurs**, le **configurateur intelligent** : vous choisissez vos composants un par un, et à chaque étape, le système ne propose que ce qui est compatible avec vos choix précédents. Impossible d'arriver dans une impasse.
>
> Et pour les **pressés**, les **configurations prêtes à l'emploi** : des PC déjà pensés par gamme, qu'il suffit de choisir. Trois chemins, une destination : le bon PC, pour la bonne personne. »

*(Transition : « Mais comment on définit "le bon" composant ? C'est là qu'est notre première vraie différence. »)*

---

## Slide 5 — Moteur de valeur : les benchmarks *(~1 min 15) — DIFFÉRENCIATEUR*

> « Premier pilier. Une fiche technique ne vous dit pas si un composant est un **bon achat**. Deux processeurs peuvent se ressembler sur le papier et avoir un rapport qualité-prix totalement différent dans la vraie vie.
>
> Notre approche : on attribue à chaque composant un **score de performance**, basé sur les benchmarks **PassMark** — la référence mondiale — qu'on a **déjà intégrés sur nos processeurs et nos cartes graphiques**. Puis on croise ce score avec le prix réel : on obtient le **coût par point de performance**.
>
> *(Montrer le tableau — vraies données.)* Le Ryzen 5 7500F délivre 26 500 points pour 155 euros. Le 9800X3D monte à 40 000 points… mais coûte 470 euros. Résultat : le 7500F offre **deux fois plus de performance par euro**.
>
> Notre moteur ne pousse ni le plus cher, ni le moins cher : il pousse **le plus pertinent**. C'est une valeur que personne d'autre ne vous donne. »

*(Transition : « Le deuxième pilier, c'est le prix. »)*

---

## Slide 6 — La transparence des prix *(~1 min 15) — DIFFÉRENCIATEUR + JUSTIFICATION*

> « Notre deuxième différence, c'est la **transparence des prix**, inspirée de StockX, la plateforme de revente de sneakers. Là où les concurrents affichent **un seul prix** — celui du revendeur — nous affichons une **fourchette de marché** : bas, moyen, haut. Vous voyez immédiatement si une offre est compétitive.
>
> Et je veux être précis sur la méthode, parce que c'est un prix de marché, pas un prix sorti du chapeau. Un : le **neuf** est **relevé par scraping** chez plusieurs marchands français — LDLC et Alternate.fr. Deux : l'**occasion** n'est pas scrapée, elle est **estimée par décote**, selon la catégorie et l'ancienneté, et toujours affichée comme une estimation — je ne fais pas passer une estimation pour un relevé. Trois : on **agrège** tout ça en un devis pour le PC complet.
>
> *(Montrer la donnée.)* Exemple réel, déjà en base : le Ryzen 7 7700X — 275 euros en bas, 282 en moyenne, 290 en haut.
>
> Et stratégiquement, c'est une **barrière** : bâtir un scraping multi-sources fiable, c'est complexe et long. Les revendeurs classiques ne l'ont pas franchie — et **aucun concurrent francophone n'affiche cette transparence**. »

*(Si on vous demande les API : « Les API officielles, type Amazon ou eBay, sont payantes ou exigent une validation de compte ; j'ai donc fait du scraping multi-sources, en volume faible et poli, avec garde-fous anti-blocage. »)*

*(Transition : « Compatibilité, benchmarks, prix — ce n'est pas une promesse sur slide. C'est en ligne. Je vous montre. »)*

---

## Slide 7 — Le produit & DÉMO *(~30 s d'intro + 5 min de démo)*

> *(Intro, ~30 s :)* « Point essentiel : ce n'est pas une maquette, ni un prototype. C'est un produit qui **tourne en production**. Plus de 25 000 composants en base, la compatibilité sur 8 catégories, les prix, les benchmarks, et **79 tests automatisés** derrière pour la fiabilité. Le mieux, c'est de vous le montrer. »

*(Bascule sur l'onglet pc-aeris.vercel.app. Choré démo, ~5 min — garde le rythme.)*

**① Le questionnaire — « parcours débutant » (≈1 min)**
> « Je me mets à la place de quelqu'un qui n'y connaît rien. "Trouver mon PC". On me demande mon usage — disons **jouer**. Puis le niveau — **Performance**. Et instantanément, la plateforme me recommande une configuration complète, cohérente, garantie compatible. Je clique sur "Charger". »

**② Le configurateur & la compatibilité — « parcours connaisseur » (≈1 min 30)**
> « Ma config est chargée. Et voici le cœur du réacteur : la **compatibilité en temps réel**. Je change de processeur — et immédiatement, sur les cartes mères, seules celles qui ont le bon socket me sont proposées. Le système m'empêche, par construction, de faire une erreur de montage. »

**③ Le tri par performance & les prix (≈1 min)**
> « Pour choisir intelligemment : je trie les composants **par performance** — les cartes graphiques classées par score de benchmark. Ou par prix. Et sur chaque produit tarifé, la **fourchette de marché** dont je vous parlais — neuf, et occasion estimée. »

**④ Sauvegarder sa config (≈45 s)**
> « Une fois satisfait, je sauvegarde ma configuration, je lui donne un nom, et je la retrouve dans mon espace pour y revenir plus tard. Et de là, je peux générer un **devis** et suivre ma commande. »

**⑤ Les configs prêtes — « parcours pressé » (≈45 s)**
> « Et pour ceux qui ne veulent pas se poser de questions : la page "Configs prêtes". Des PC complets, par usage et par gamme, tous compatibles, chargés en un clic. »

*(Revenir au deck, slide 8.)*
> « Voilà. Tout ce que vous venez de voir est en ligne, maintenant. »

---

## Slide 8 — Sous le capot : technique & qualité *(~50 s) — TECHNIQUE*

> « Un mot sur ce qu'il y a sous le capot, parce que ça compte. Ce n'est pas un prototype jetable, ce sont de **vraies fondations**.
>
> Côté **architecture** : React 19 et TypeScript, un code typé et organisé en composants, l'état géré avec Zustand. Côté **back et données** : Supabase — une base Postgres, l'authentification, et la sécurité au niveau des lignes avec les *Row-Level Security policies*. Côté **qualité** : tout passe par Git, avec des revues, et une intégration continue qui lance le lint, le build et **79 tests automatisés** à chaque modification, avec déploiement continu sur Vercel.
>
> Et côté **expérience** : un design system maison, *Aeris Dark*, des contrastes conformes **WCAG et RGAA niveau AA**, une interface responsive. Bref : du code propre, testé, accessible et versionné. »

*(Transition : « Voilà pour le produit. Parlons maintenant du marché. »)*

---

## Slide 9 — Le marché *(~55 s)*

> « Quelques chiffres, sources à l'appui. Le marché français du jeu vidéo pèse **5,7 milliards d'euros en 2024**, selon le SELL — le syndicat des éditeurs de logiciels de loisir — et les ventes de PC gaming en France y ont progressé de **9,1 %**. À l'échelle mondiale, Grand View Research évalue le marché du PC gaming à environ **62 milliards de dollars**, avec une croissance de l'ordre de **13,5 % par an**.
>
> Nos cibles sont des particuliers et des pros individuels : les **gamers**, débutants comme confirmés ; les **créatifs et freelances** ; les **étudiants tech** et les **indépendants**. Tous ont un point commun : ils veulent du sur-mesure, **sans la complexité**. C'est le terrain qu'on occupe. »

*(Transition : « Et sur ce terrain, voici ce qui nous distingue. »)*

---

## Slide 10 — Pourquoi on se démarque *(~1 min 10) — DIFFÉRENCIATION*

> « Je vais être factuel, critère par critère. *(Parcourir le tableau.)*
>
> La compatibilité garantie ? La recommandation performance-prix ? Les prix transparents en fourchette ? Un parcours adapté au niveau ? Un vrai accompagnement ? Sur ces cinq critères, **LDLC, TopAchat, Amazon et les configurateurs de marque sont tous à la traîne** — ils en cochent un, parfois aucun. Nous, on coche les cinq.
>
> Soyons clairs : on ne fait pas la guerre des prix à Amazon, on ne la gagnerait pas. On occupe le quadrant que personne n'occupe vraiment : le croisement de **l'expertise et de la simplicité**. »

*(Transition : « Venons-en au modèle économique. »)*

---

## Slide 11 — Business model *(~1 min)*

> « Comment on gagne de l'argent — et c'est important de bien le comprendre. On ne prend **pas de marge sur les composants** : le client les paie au **meilleur prix qu'on a trouvé**. Ce qui nous rémunère, c'est le **montage**, vendu à prix fixe, en trois offres.
>
> **Essentiel**, 79 euros : montage, câble management, test de démarrage. **Confort**, 129 euros, la plus choisie : montage soigné, Windows et drivers, réglage des ventilateurs. **Premium**, 199 euros : tuning complet, benchmarks, rapport de tests livré.
>
> Donc le prix total, c'est : les composants au meilleur prix, plus l'offre de montage. Le modèle reste **asset-light**, sans stock — complété demain par la garantie étendue et un abonnement Pro. »

*(Transition : « Et est-ce que c'est rentable ? Oui, et plus vite qu'on ne le croit. »)*

---

## Slide 12 — Économie unitaire & rentabilité *(~1 min 10) — RENTABILITÉ*

> « Une commande type. Panier moyen **1 200 euros** : environ 1 080 de composants, facturés à prix coûtant, et **environ 120 euros de montage** — notre revenu. On retire ~30 euros de coûts variables. Il reste une **marge de contribution d'environ 90 euros par commande**.
>
> En face, des coûts fixes mensuels — infra, outils, marketing — autour de **1 500 euros**. Ce qui place le **seuil de rentabilité autour de 17 commandes par mois**.
>
> Sur la première année, on assume une **montée en charge** : on démarre sous le seuil — c'est sain pour une marque qui part de zéro — et on atteint l'équilibre courant année 2. Pas de stock, pas d'invendus, pas de besoin en fonds de roulement : le risque est structurellement faible. »

*(Transition : « Voici ce que ça donne en projection. »)*

---

## Slide 13 — Projections financières *(~50 s)*

> « Des projections volontairement **prudentes**, parce qu'on part d'une marque sans notoriété.
>
> En 2027, lancement : une montée en charge, autour de **6 commandes par mois** en moyenne, soit environ **86 000 euros** de chiffre d'affaires. En 2028, à mesure que le bouche-à-oreille et le référencement portent : **16 commandes mensuelles**, soit **240 000 euros**. Et en 2029, autour de **32 commandes par mois**, pour près de **500 000 euros**.
>
> Cette croissance repose sur des leviers maîtrisables : bouche-à-oreille, référencement naturel, partenariats créateurs. Des chiffres qu'on sait défendre. »

*(Transition : « Où en est-on, et où va-t-on ? »)*

---

## Slide 14 — Roadmap *(~45 s)*

> « Aujourd'hui, juin 2026, le **MVP est en production** — ce que je viens de vous montrer : configurateur, compatibilité, comptes, sauvegarde, catalogue, prix neuf et occasion.
>
> En **août**, la **V1 commerciale** : le paiement par Stripe, les emails transactionnels, des filtres avancés — sachant que le panier, le devis et le suivi de commande sont **déjà livrés**. Ensuite la **V2** : l'IA de recommandation, la connexion Google, le paiement en plusieurs fois. Puis l'expansion : mobile, abonnement Pro, international.
>
> Le message : on n'est plus au stade de l'idée, on est au stade de **l'exécution**. »

*(Transition : « Cette exécution, encore faut-il pouvoir la répliquer à grande échelle. D'abord, la méthode. »)*

---

## Slide 15 — Passage à l'échelle · Méthode *(~55 s) — BLOC 3*

> « Si le projet décolle, comment je l'organise ? Côté **méthode**, je pars sur du **Scrum hybride** : des sprints de deux semaines, avec les cérémonies classiques — planning, point quotidien, revue, rétrospective — et des outils simples : GitHub Projects pour le suivi, Notion pour la doc, Figma pour le design. Une cadence courte, pour avoir du feedback vite et réajuster le cap à chaque sprint.
>
> Et une décision structurante : le **"build versus buy"**. Ce qui fait notre différence — le configurateur, le moteur de compatibilité, le relevé de prix — on le **construit en interne**. Tout le reste, on l'**achète** : l'authentification, la base et l'hébergement chez Supabase et Vercel, le paiement chez Stripe, les emails chez Resend. On concentre l'effort interne là où se crée la valeur. »

*(Transition : « Avec cette méthode, voici comment on encaisse le volume. »)*

---

## Slide 16 — Changement d'échelle *(~50 s) — BLOC 3*

> « Passer de quelques commandes par mois à plusieurs milliers, qu'est-ce que ça change ?
>
> **Techniquement**, presque rien à réécrire : la pile est managée, on active des réplicas de lecture, du cache, et on passe le scraping des prix en file de jobs asynchrone. **Côté opérations**, on ne centralise pas le montage : on s'appuie sur un réseau d'**assembleurs partenaires régionaux** et un sourcing semi-automatisé. **Côté équipe**, on passe de une à une dizaine de personnes en pôles. Et **côté marché**, la plateforme est déjà pensée pour l'international, ce qui ouvre l'Europe et un segment Pro.
>
> Le point clé : comme le modèle est **asset-light**, sans stock à multiplier, le passage à l'échelle est avant tout **organisationnel**, pas technique. C'est un risque qu'on sait piloter. »

*(Transition : « Et cette organisation, aujourd'hui, repose sur une personne. »)*

---

## Slide 17 — Équipe cible & recrutement *(~1 min) — BLOC 3 / CRÉDIBILITÉ*

> « Aujourd'hui, l'équipe, c'est moi. Tout ce que vous avez vu, je l'ai **conçu et construit en solo** — c'est la meilleure preuve qu'on sait exécuter avec peu de moyens.
>
> Pour passer à l'échelle, j'ai déjà cadré qui je recrute, quand, et sous quel statut. *(Parcourir le tableau.)* Priorité numéro un : un **CTO / Lead Dev**, dès le premier mois, salarié avec de l'equity, pour prendre le relais technique et recruter les devs. Puis un **expert hardware** en freelance pour les données composants, un **développeur full-stack** pour la V1 et l'IA, un profil **growth / marketing**, et un **support client**. Cinq profils, échelonnés sur les six premiers mois.
>
> Et un point que je tiens à porter : l'**inclusion**. Les postes seront ouverts aux personnes en situation de handicap, avec des aménagements concrets — télétravail, matériel adapté, horaires souples. »

*(Transition : « Une équipe qu'il faut piloter et faire livrer. »)*

---

## Slide 18 — Pilotage & livraison *(~50 s) — BLOC 3*

> « Côté pilotage, trois choses. Les **parties prenantes** d'abord : les clients, que je suis en continu via le support et le suivi de commande ; les assembleurs partenaires, avec un engagement qualité revu chaque semaine ; et les investisseurs, avec un reporting mensuel.
>
> Ensuite, une **"definition of done"** claire : une fonctionnalité n'est "livrée" que si la revue de code est faite, l'intégration continue verte, les tests passants, le responsive et l'accessibilité vérifiés, le tout déployé en production et documenté.
>
> Enfin, le **lancement** : canal principal le SEO et les créateurs ; trois indicateurs suivis dès le premier jour — visiteurs, configurations créées, taux de passage au devis ; et un plan de repli — si une mise en production échoue, on revient à la version précédente sur Vercel en un clic. Chaque livraison est **mesurée**, et **réversible**. »

*(Transition : « Et très concrètement, pour enclencher tout ça : »)*

---

## Slide 19 — Besoin de financement *(~45 s)*

> « Ce qu'on recherche, c'est un amorçage de **35 000 euros**, calibré pour 6 à 12 mois et concentré là où se joue la traction.
>
> Le détail : **15 000** pour le développement — livrer la V1, le paiement, le suivi, fiabiliser. **10 000** pour le marketing de lancement — référencement, créateurs. Puis **3 000** d'infrastructure, **2 000** de juridique, et **5 000** de trésorerie. Près de **70 % de l'enveloppe va directement à la traction**.
>
> Les sources sont réalistes pour ce stade : apport personnel, love money, prêt d'honneur via Réseau Entreprendre ou Initiative France, BPI France, et concours de startups. »

*(Transition : « Pour conclure. »)*

---

## Slide 20 — Vision & ask *(~45 s)*

> « Notre vision, je la résume comme au début : permettre à chacun d'obtenir **le PC parfait pour ses besoins — sans stress, sans erreur, et au juste prix**.
>
> Trois choses à retenir. Un : c'est un **produit réel**, déjà en ligne, avec des fondations techniques solides et 79 tests. Deux : une **niche claire**, le sur-mesure simplifié, que les géants n'adressent pas. Trois : un **modèle rentable dès la petite échelle**.
>
> Ce qu'on recherche : un **amorçage de 35 000 euros**, pour livrer la V1 et aller chercher nos premiers clients. Le site est en ligne, testez-le. Je vous remercie de votre attention — et je suis à votre disposition pour vos questions. »

---

## Anticipation des questions

**Produit & technique**
- **« La compatibilité, c'est vraiment fiable ? »** → Oui : des règles métier explicites (puissance d'alim selon le TDP, format boîtier vs carte mère, connectique M.2/SATA…), couvertes par **79 tests automatisés**. Vu en direct dans la démo.
- **« Les benchmarks sont en place ? »** → Oui : scores **PassMark intégrés sur 733 processeurs et 982 cartes graphiques**, croisés au prix pour la reco performance-prix.
- **« D'où viennent les prix, quelle couverture ? »** → Le **neuf** : relevés réels par scraping chez **LDLC et Alternate.fr**, en fourchette. L'**occasion** : **estimée par décote**, clairement labellisée — pas un relevé. Couverture du catalogue **partielle**, élargie par lots (scraping lent et poli). Les API officielles (Amazon, eBay) sont payantes ou exigent une validation de compte, d'où le scraping multi-sources avec garde-fous.
- **« Pourquoi ces choix techniques (React, Supabase) ? »** → Stack moderne, typée, managée : elle me permet de livrer vite et seul, et de monter en charge sans tout réécrire (réplicas, cache, jobs async). Sécurité par RLS côté base.

**Bloc 3 — organisation & management**
- **« Quelle méthodologie de gestion de projet ? »** → Scrum hybride, sprints de 2 semaines, cérémonies planning/daily/review/rétro, outils GitHub Projects + Notion + Figma. Cadence courte pour itérer vite.
- **« Build ou buy ? »** → On construit ce qui nous différencie (configurateur, compatibilité, prix) ; on achète le reste (Supabase, Vercel, Stripe, Resend). L'effort interne va sur la valeur.
- **« Qui recrutez-vous en premier ? »** → Un **CTO / Lead Dev** dès le mois 1 (salarié + equity), puis expert hardware (freelance), dev full-stack, growth, support — échelonnés sur 6 mois. Détaillé slide 17.
- **« Comment pilotez-vous les parties prenantes / la qualité ? »** → Clients en continu, assembleurs avec SLA hebdo, investisseurs en reporting mensuel. Une *definition of done* stricte (revue + CI + tests + accessibilité + prod + doc) et un rollback Vercel en 1 clic.
- **« Et l'inclusion / un collaborateur en situation de handicap ? »** → Postes ouverts, aménagements concrets : télétravail, matériel adapté, horaires souples. L'outillage (tout en ligne, async) s'y prête.

**Business**
- **« Comment vous gagnez de l'argent ? »** → Pas de marge sur les composants : ils sont au meilleur prix. Revenu = **montage à prix fixe** (79 / 129 / 199 €), ~120 € en moyenne. Modèle asset-light, seuil ~17 commandes/mois, relayé par garantie étendue et abonnement Pro.
- **« La concurrence d'Amazon / LDLC ? »** → On ne les affronte ni sur le prix ni sur la largeur de catalogue. On se différencie par l'accompagnement, la compatibilité garantie et la transparence. Une niche qu'ils ne couvrent pas.
- **« Pourquoi seul, et pourquoi vous ? »** → J'ai déjà construit et mis en production le produit entier, seul. C'est la preuve de la capacité d'exécution. Recrutements prévus dès l'amorçage, CTO en priorité.
- **« 35 000 € pour quoi faire ? »** → Développement (15 K€), marketing (10 K€), infra (3 K€), juridique (2 K€), trésorerie (5 K€). Sources : apport perso, love money, prêt d'honneur, BPI France.
