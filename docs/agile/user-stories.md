# User Stories détaillées — PC Aeris

> **Scope :** User stories de priorité Critique et Haute
> **Dernière mise à jour :** 27 mars 2026
> **Convention :** Les critères d'acceptation (CA) sont les conditions vérifiables en recette

---

## Activité 1 — Découvrir la plateforme

---

### US-001 : Page d'accueil avec présentation de PC Aeris
**En tant que** visiteur
**Je veux** accéder à une page d'accueil claire qui présente PC Aeris
**Afin de** comprendre ce que propose le service avant de m'inscrire ou de configurer un PC

**Critères d'acceptation :**
- [ ] CA1 : La page d'accueil charge en moins de 3 secondes
- [ ] CA2 : La valeur proposition principale est visible sans scrolling (above the fold)
- [ ] CA3 : Un call-to-action "Configurer mon PC" est visible et fonctionnel
- [ ] CA4 : La page présente au minimum : titre, sous-titre, et lien vers le configurateur
- [ ] CA5 : La navigation est fonctionnelle (header avec liens vers les sections principales)

**Definition of Done :**
- [ ] Code reviewé et mergé sur develop
- [ ] Rendu correct sur Chrome, Firefox, Safari
- [ ] Responsive vérifié sur mobile (375px) et tablette (768px)
- [ ] Aucune erreur console

**Points :** 5 | **Priorité :** Critique | **Sprint :** 1 | **Statut :** Done (partiel — contenu placeholder)

---

### US-002 : Hero banner avec call-to-action vers le configurateur
**En tant que** visiteur
**Je veux** voir une bannière hero visuelle mettant en avant le configurateur
**Afin d'** être incité à démarrer une configuration dès ma première visite

**Critères d'acceptation :**
- [ ] CA1 : Un composant HeroBanner est affiché en haut de la page d'accueil
- [ ] CA2 : La bannière contient un titre accrocheur, un sous-titre descriptif et un bouton CTA
- [ ] CA3 : Le CTA redirige vers /configurateur
- [ ] CA4 : La bannière est visuellement distincte du reste de la page (fond, typographie)
- [ ] CA5 : L'image/visuel de fond est optimisé (format WebP ou SVG, < 200ko)

**Definition of Done :**
- [ ] Code reviewé et mergé sur develop
- [ ] Design validé (cohérent avec le design system)
- [ ] Responsive vérifié sur mobile, tablette et desktop
- [ ] Performance Lighthouse > 80

**Points :** 3 | **Priorité :** Haute | **Sprint :** 2

---

### US-005 : Menu de navigation principal
**En tant que** visiteur
**Je veux** un menu de navigation clair et accessible
**Afin d'** accéder rapidement aux différentes sections du site

**Critères d'acceptation :**
- [ ] CA1 : Le header contient un logo PC Aeris cliquable (redirige vers /)
- [ ] CA2 : Les liens de navigation principaux sont : Accueil, Configurateur, [Mon compte / Connexion]
- [ ] CA3 : Si l'utilisateur est connecté, le menu affiche son pseudo et un accès au profil
- [ ] CA4 : Si l'utilisateur est admin, un lien "Admin" est visible dans la navigation
- [ ] CA5 : Le menu est sticky (reste visible lors du scroll)
- [ ] CA6 : Sur mobile, la navigation passe en menu hamburger

**Definition of Done :**
- [ ] Code reviewé et mergé sur develop
- [ ] Responsive mobile vérifié (menu hamburger fonctionnel)
- [ ] Accessibilité : navigation au clavier fonctionnelle

**Points :** 3 | **Priorité :** Critique | **Sprint :** 1 | **Statut :** Done (partiel — pas de menu hamburger mobile)

---

### US-006 : Responsive mobile complet
**En tant que** visiteur
**Je veux** utiliser le site depuis un smartphone
**Afin de** configurer mon PC ou consulter mes commandes en mobilité

**Critères d'acceptation :**
- [ ] CA1 : Toutes les pages sont utilisables sur un écran de 375px de large minimum
- [ ] CA2 : Le configurateur est utilisable sur mobile (sélection de composants, navigation par catégorie)
- [ ] CA3 : Les formulaires d'authentification sont utilisables sur mobile (inputs suffisamment grands, pas de zoom forcé)
- [ ] CA4 : Les tableaux admin s'adaptent ou passent en vue carte sur mobile
- [ ] CA5 : Aucun contenu n'est tronqué ou inaccessible sur mobile
- [ ] CA6 : Les boutons ont une zone de touch d'au moins 44x44px

**Definition of Done :**
- [ ] Testé sur iOS Safari et Android Chrome
- [ ] Testé aux breakpoints 375px, 414px, 768px
- [ ] Lighthouse Mobile Performance > 70
- [ ] Aucun scroll horizontal parasite

**Points :** 8 | **Priorité :** Haute | **Sprint :** 5

---

## Activité 2 — S'authentifier

---

### US-011 : Inscription avec email et mot de passe
**En tant que** visiteur
**Je veux** créer un compte avec mon adresse email et un mot de passe
**Afin d'** accéder aux fonctionnalités personnalisées (sauvegarde de configurations, commandes)

**Critères d'acceptation :**
- [ ] CA1 : Le formulaire d'inscription contient : email, pseudo, prénom, nom, mot de passe, confirmation mot de passe
- [ ] CA2 : L'email est validé côté client (format) et côté serveur (unicité)
- [ ] CA3 : Le pseudo est validé (min 3 caractères, uniquement alphanumériques et tirets)
- [ ] CA4 : Le mot de passe doit contenir au moins 8 caractères
- [ ] CA5 : Un message de succès est affiché après inscription réussie
- [ ] CA6 : En cas d'erreur (email déjà utilisé, etc.), un message explicite est affiché
- [ ] CA7 : L'utilisateur est automatiquement connecté après inscription

**Definition of Done :**
- [ ] Code reviewé et mergé
- [ ] Tests sur cas nominaux et cas d'erreur validés manuellement
- [ ] Responsive vérifié
- [ ] Données persistées correctement dans Supabase (table profiles)

**Points :** 3 | **Priorité :** Critique | **Sprint :** 1 | **Statut :** Done

---

### US-014 : Connexion avec email et mot de passe
**En tant qu'** utilisateur inscrit
**Je veux** me connecter avec mon email et mon mot de passe
**Afin d'** accéder à mon espace personnel

**Critères d'acceptation :**
- [ ] CA1 : Le formulaire contient un champ email/identifiant et un champ mot de passe
- [ ] CA2 : La connexion par email fonctionne correctement
- [ ] CA3 : Un message d'erreur générique est affiché si les identifiants sont incorrects (ne pas indiquer si c'est l'email ou le mot de passe qui est faux)
- [ ] CA4 : Après connexion réussie, l'utilisateur est redirigé vers la page d'accueil (ou la page admin si rôle admin)
- [ ] CA5 : Un lien "Mot de passe oublié ?" est présent et fonctionnel
- [ ] CA6 : Un lien vers la page d'inscription est présent

**Definition of Done :**
- [ ] Code reviewé et mergé
- [ ] Tests manuels sur nominaux et erreurs
- [ ] Responsive vérifié
- [ ] Session correctement stockée dans Supabase Auth

**Points :** 2 | **Priorité :** Critique | **Sprint :** 1 | **Statut :** Done

---

### US-015 : Connexion par pseudo (correction bug)
**En tant qu'** utilisateur inscrit
**Je veux** me connecter avec mon pseudo au lieu de mon email
**Afin d'** avoir une alternative pratique à la connexion par email

**Critères d'acceptation :**
- [ ] CA1 : Le champ identifiant accepte aussi bien un email qu'un pseudo
- [ ] CA2 : Si un pseudo est saisi, le service résout l'email correspondant via la table profiles avant d'appeler Supabase Auth
- [ ] CA3 : Un pseudo inexistant retourne un message d'erreur clair ("Identifiant ou mot de passe incorrect")
- [ ] CA4 : La connexion par pseudo fonctionne exactement comme la connexion par email (même session, même redirection)
- [ ] CA5 : Le comportement n'est plus hardcodé — la logique est dynamique

**Definition of Done :**
- [ ] Bug résolu et vérifié manuellement
- [ ] Code reviewé
- [ ] Aucune régression sur la connexion par email

**Notes techniques :** La logique actuelle dans authService.signIn retourne une erreur hardcodée pour la connexion par pseudo. Il faut implémenter la résolution pseudo → email via une requête Supabase sur la table profiles.

**Points :** 3 | **Priorité :** Critique | **Sprint :** 2 | **Statut :** Bug

---

### US-017 : Réinitialisation de mot de passe par email
**En tant qu'** utilisateur ayant oublié son mot de passe
**Je veux** recevoir un email de réinitialisation
**Afin de** récupérer l'accès à mon compte

**Critères d'acceptation :**
- [ ] CA1 : La page "Mot de passe oublié" contient un champ email et un bouton d'envoi
- [ ] CA2 : Un email de réinitialisation est envoyé si l'adresse existe dans le système
- [ ] CA3 : Si l'email n'existe pas, un message neutre est affiché (ne pas révéler si l'email est enregistré)
- [ ] CA4 : Un message de confirmation est affiché après soumission
- [ ] CA5 : Le lien dans l'email redirige vers la page /reset-password avec un token valide

**Definition of Done :**
- [ ] Code reviewé
- [ ] Email de reset testé manuellement (envoi et réception)
- [ ] Responsive vérifié

**Points :** 2 | **Priorité :** Critique | **Sprint :** 1 | **Statut :** Done

---

### US-018 : Définition d'un nouveau mot de passe
**En tant qu'** utilisateur ayant cliqué sur le lien de reset
**Je veux** définir un nouveau mot de passe
**Afin de** restaurer l'accès à mon compte

**Critères d'acceptation :**
- [ ] CA1 : La page de reset affiche deux champs : nouveau mot de passe et confirmation
- [ ] CA2 : Le nouveau mot de passe doit respecter les règles de validation (min 8 caractères)
- [ ] CA3 : Les deux champs doivent être identiques (validation côté client)
- [ ] CA4 : Un message de succès est affiché après le changement réussi
- [ ] CA5 : L'utilisateur est redirigé vers la page de connexion après succès
- [ ] CA6 : Un token invalide ou expiré affiche un message d'erreur explicite

**Definition of Done :**
- [ ] Code reviewé
- [ ] Flux complet testé (email → lien → reset → connexion)
- [ ] Responsive vérifié

**Points :** 2 | **Priorité :** Critique | **Sprint :** 1 | **Statut :** Done

---

## Activité 3 — Configurer son PC

---

### US-023 : Pagination dans le configurateur
**En tant qu'** utilisateur
**Je veux** parcourir les composants d'une catégorie avec pagination
**Afin de** voir toutes les options disponibles sans saturer la page

**Critères d'acceptation :**
- [ ] CA1 : Les composants sont affichés par pages de 24 éléments
- [ ] CA2 : Des boutons "Précédent" et "Suivant" permettent de naviguer entre les pages
- [ ] CA3 : Le nombre total de résultats est affiché ("X composants trouvés")
- [ ] CA4 : La pagination se remet à 0 quand l'utilisateur change de catégorie ou de filtre de recherche
- [ ] CA5 : Le chargement des pages est indiqué par un état de chargement (spinner)

**Definition of Done :**
- [ ] Code reviewé
- [ ] Testé avec des données réelles en base
- [ ] Responsive vérifié

**Points :** 3 | **Priorité :** Critique | **Sprint :** 1 | **Statut :** Done

---

### US-024 : Recherche de composant par nom
**En tant qu'** utilisateur
**Je veux** rechercher un composant par son nom dans le configurateur
**Afin de** trouver rapidement un produit spécifique que je connais déjà

**Critères d'acceptation :**
- [ ] CA1 : Un champ de recherche est présent en haut de la liste des composants
- [ ] CA2 : La recherche est insensible à la casse et aux accents
- [ ] CA3 : La recherche se déclenche en temps réel (debounce de 300ms)
- [ ] CA4 : Si aucun résultat, un message "Aucun composant trouvé" est affiché
- [ ] CA5 : La pagination est réinitialisée lors d'une nouvelle recherche
- [ ] CA6 : La recherche est compatible avec les filtres de compatibilité actifs

**Definition of Done :**
- [ ] Code reviewé
- [ ] Testé avec des requêtes vides, courtes et longues
- [ ] Responsive vérifié

**Points :** 2 | **Priorité :** Critique | **Sprint :** 1 | **Statut :** Done

---

### US-025 : Affichage des caractéristiques techniques clés
**En tant qu'** utilisateur
**Je veux** voir les caractéristiques techniques clés d'un composant dans la liste
**Afin de** comparer rapidement les options sans ouvrir une page détail

**Critères d'acceptation :**
- [ ] CA1 : Chaque carte composant affiche les specs clés définies par catégorie (ex : CPU → socket, cores, fréquence boost)
- [ ] CA2 : Les specs sont formatées lisiblement (ex : "16 cores", "5.2 GHz", "DDR5")
- [ ] CA3 : Les valeurs manquantes affichent "—" plutôt qu'une erreur
- [ ] CA4 : La carte indique le fabricant et le nom du produit
- [ ] CA5 : La carte indique clairement si le composant est déjà sélectionné dans la configuration

**Definition of Done :**
- [ ] Code reviewé
- [ ] Testé sur toutes les catégories de composants
- [ ] Responsive vérifié

**Points :** 2 | **Priorité :** Critique | **Sprint :** 1 | **Statut :** Done

---

### US-031 : Filtrage automatique par compatibilité CPU/Carte mère/RAM
**En tant qu'** utilisateur
**Je veux** que les composants incompatibles soient automatiquement filtrés
**Afin de** ne pas pouvoir sélectionner des pièces qui ne fonctionneront pas ensemble

**Critères d'acceptation :**
- [ ] CA1 : Si un CPU est sélectionné, seules les cartes mères avec le même socket sont proposées
- [ ] CA2 : Si une carte mère est sélectionnée, seuls les CPU avec le socket correspondant sont proposés
- [ ] CA3 : Si une carte mère est sélectionnée, seules les RAM avec le type compatible (DDR4/DDR5) sont proposées
- [ ] CA4 : Si un CPU est sélectionné, seuls les ventirad compatibles avec son socket sont proposés
- [ ] CA5 : Le filtre de compatibilité est désactivé si aucun composant de référence n'est sélectionné
- [ ] CA6 : Si aucun composant compatible n'existe, un message explicatif est affiché

**Definition of Done :**
- [ ] Code reviewé
- [ ] Testé avec des configurations réelles (Intel LGA1700, AMD AM5)
- [ ] Testé avec des cas limites (pas de composant de référence)

**Points :** 8 | **Priorité :** Critique | **Sprint :** 1 | **Statut :** Done

---

### US-032 : Explication du filtre de compatibilité actif
**En tant qu'** utilisateur
**Je veux** voir pourquoi un filtre de compatibilité est actif
**Afin de** comprendre les contraintes de ma configuration actuelle

**Critères d'acceptation :**
- [ ] CA1 : Quand un filtre de compatibilité est actif, un bandeau ou badge l'indique clairement
- [ ] CA2 : Le message indique la raison du filtre (ex : "Filtré par socket LGA1700")
- [ ] CA3 : Le message est affiché dans la section de la catégorie concernée
- [ ] CA4 : Si la liste filtrée est vide, le message indique qu'aucun composant compatible n'est disponible

**Definition of Done :**
- [ ] Code reviewé
- [ ] UX testée avec un utilisateur (message compréhensible)
- [ ] Responsive vérifié

**Points :** 2 | **Priorité :** Haute | **Sprint :** 1 | **Statut :** Done

---

### US-033 : Compatibilité GPU / Alimentation
**En tant qu'** utilisateur
**Je veux** que le configurateur vérifie la compatibilité entre le GPU et l'alimentation
**Afin d'** éviter de choisir un PSU insuffisant pour mon GPU

**Critères d'acceptation :**
- [ ] CA1 : Si un GPU est sélectionné, les PSU affichés sont ceux dont la puissance est supérieure ou égale à (TDP GPU + TDP CPU + marge de 20%)
- [ ] CA2 : La raison du filtre est affichée (ex : "Filtré : puissance minimale recommandée 650W")
- [ ] CA3 : Si aucun PSU de la base ne répond aux critères, un message explicite est affiché
- [ ] CA4 : Le filtre fonctionne dans les deux sens (GPU filtré si PSU sélectionné en premier)

**Definition of Done :**
- [ ] Code reviewé
- [ ] Logique de calcul validée avec plusieurs cas (GPU entry level, mid-range, high-end)
- [ ] Tests unitaires sur la fonction de calcul de consommation

**Notes techniques :** Nécessite d'ajouter le champ `tdp_watts` dans les specs GPU et PSU. La logique est à implémenter dans `/src/utils/compatibility.ts`.

**Points :** 5 | **Priorité :** Haute | **Sprint :** 3

---

### US-034 : Compatibilité Boîtier / Format carte mère
**En tant qu'** utilisateur
**Je veux** que la compatibilité entre le boîtier et le format de la carte mère soit vérifiée
**Afin d'** éviter de choisir une carte mère qui ne rentre pas dans le boîtier

**Critères d'acceptation :**
- [ ] CA1 : Si une carte mère ATX est sélectionnée, seuls les boîtiers supportant ATX sont proposés
- [ ] CA2 : Si un boîtier mATX est sélectionné, seules les cartes mères mATX et Mini-ITX sont proposées
- [ ] CA3 : La raison du filtre est affichée (ex : "Filtré : format ATX requis")
- [ ] CA4 : Le filtre fonctionne dans les deux sens

**Definition of Done :**
- [ ] Code reviewé
- [ ] Testé avec les formats ATX, mATX, Mini-ITX
- [ ] Tests unitaires sur la logique de compatibilité form factor

**Points :** 3 | **Priorité :** Haute | **Sprint :** 3

---

### US-035 : Compatibilité Stockage / Connectique carte mère
**En tant qu'** utilisateur
**Je veux** que la compatibilité entre le stockage et la carte mère soit vérifiée
**Afin de** m'assurer que mes disques sont supportés par la carte mère choisie

**Critères d'acceptation :**
- [ ] CA1 : Si un SSD M.2 NVMe est sélectionné, seules les cartes mères avec un slot M.2 disponible sont proposées
- [ ] CA2 : Si un disque SATA est sélectionné, seules les cartes mères avec des ports SATA sont proposées
- [ ] CA3 : La raison du filtre est affichée
- [ ] CA4 : Le filtre fonctionne dans les deux sens

**Definition of Done :**
- [ ] Code reviewé
- [ ] Testé avec SSD NVMe et HDD SATA
- [ ] Tests unitaires sur la logique

**Points :** 3 | **Priorité :** Haute | **Sprint :** 3

---

### US-038 : Récapitulatif de configuration
**En tant qu'** utilisateur
**Je veux** voir un récapitulatif de tous mes composants sélectionnés
**Afin d'** avoir une vue d'ensemble de ma configuration en cours

**Critères d'acceptation :**
- [ ] CA1 : Un panneau récapitulatif affiche toutes les catégories avec leur composant sélectionné (ou "Non sélectionné")
- [ ] CA2 : Chaque ligne du récapitulatif permet de supprimer le composant sélectionné
- [ ] CA3 : Un bouton "Réinitialiser" permet de vider toute la configuration
- [ ] CA4 : Le récapitulatif est visible en permanence (sidebar ou section dédiée) sans quitter le configurateur
- [ ] CA5 : Le récapitulatif se met à jour en temps réel lors de la sélection ou suppression d'un composant

**Definition of Done :**
- [ ] Code reviewé
- [ ] Testé avec une configuration complète et partielle
- [ ] Responsive vérifié

**Points :** 2 | **Priorité :** Critique | **Sprint :** 1 | **Statut :** Done

---

### US-039 : Prix total de la configuration
**En tant qu'** utilisateur
**Je veux** voir le prix total de ma configuration
**Afin de** savoir combien coûteront les composants sélectionnés

**Critères d'acceptation :**
- [ ] CA1 : Le prix total est affiché dans le récapitulatif de configuration
- [ ] CA2 : Le prix total est la somme des prix unitaires de chaque composant sélectionné
- [ ] CA3 : Si un composant n'a pas de prix défini, il n'est pas comptabilisé et une mention "prix non disponible" est affichée
- [ ] CA4 : Le format de prix est en euros (ex : "1 249,99 €")
- [ ] CA5 : Le prix se met à jour en temps réel lors de l'ajout ou suppression d'un composant

**Definition of Done :**
- [ ] Code reviewé
- [ ] Nécessite US-079 (prix en BDD) comme prérequis
- [ ] Testé avec des configurations complètes et partielles

**Points :** 2 | **Priorité :** Haute | **Sprint :** 5

---

### US-041 : Sauvegarde de configuration
**En tant qu'** utilisateur connecté
**Je veux** sauvegarder ma configuration PC
**Afin de** la retrouver lors de ma prochaine visite sans avoir à tout recommencer

**Critères d'acceptation :**
- [ ] CA1 : Un bouton "Sauvegarder ma configuration" est visible dans le configurateur
- [ ] CA2 : Cliquer sur ce bouton ouvre un modal demandant un nom pour la configuration
- [ ] CA3 : La configuration est sauvegardée en base de données liée au compte utilisateur
- [ ] CA4 : Un toast de confirmation est affiché après la sauvegarde réussie
- [ ] CA5 : Si l'utilisateur n'est pas connecté, il est invité à se connecter
- [ ] CA6 : Un utilisateur peut sauvegarder jusqu'à 10 configurations

**Definition of Done :**
- [ ] Code reviewé
- [ ] Migration Supabase créée (table `saved_configurations`)
- [ ] Testé avec compte connecté et non connecté
- [ ] Toast de confirmation fonctionnel (US-084 prérequis recommandé)

**Points :** 5 | **Priorité :** Haute | **Sprint :** 5

---

## Activité 4 — Passer commande

---

### US-047 : Ajout de la configuration au panier
**En tant qu'** utilisateur
**Je veux** ajouter ma configuration au panier
**Afin de** procéder à la commande une fois satisfait de mes choix

**Critères d'acceptation :**
- [ ] CA1 : Un bouton "Ajouter au panier" est visible dans le récapitulatif de configuration
- [ ] CA2 : Le bouton n'est actif que si au moins un composant est sélectionné
- [ ] CA3 : Après ajout, l'utilisateur est redirigé ou notifié (toast) que les articles ont été ajoutés au panier
- [ ] CA4 : Un badge sur l'icône panier dans le header se met à jour avec le nombre d'articles
- [ ] CA5 : Si l'utilisateur n'est pas connecté, il est invité à se connecter avant de pouvoir ajouter au panier

**Definition of Done :**
- [ ] Code reviewé
- [ ] Zustand store panier créé avec persistance localStorage
- [ ] Responsive vérifié
- [ ] Badge panier dans le header fonctionnel

**Points :** 5 | **Priorité :** Haute | **Sprint :** 6

---

### US-048 : Page panier
**En tant qu'** utilisateur
**Je veux** voir le contenu de mon panier avec le détail des composants et des prix
**Afin de** vérifier ma commande avant de passer au paiement

**Critères d'acceptation :**
- [ ] CA1 : La page panier liste tous les composants avec nom, catégorie, prix unitaire
- [ ] CA2 : Le sous-total, les frais de livraison estimés et le total sont affichés
- [ ] CA3 : Chaque composant peut être supprimé individuellement
- [ ] CA4 : Un bouton "Continuer mes achats" redirige vers le configurateur
- [ ] CA5 : Un bouton "Passer commande" redirige vers le tunnel de commande (si connecté)
- [ ] CA6 : Si le panier est vide, un message et un lien vers le configurateur sont affichés

**Definition of Done :**
- [ ] Code reviewé
- [ ] Testé avec un panier vide et un panier rempli
- [ ] Responsive vérifié

**Points :** 3 | **Priorité :** Haute | **Sprint :** 6

---

### US-054 : Paiement par carte bancaire via Stripe
**En tant qu'** utilisateur
**Je veux** payer ma commande par carte bancaire de façon sécurisée
**Afin de** finaliser mon achat

**Critères d'acceptation :**
- [ ] CA1 : Le formulaire de paiement Stripe est intégré (Stripe Elements ou Payment Element)
- [ ] CA2 : Le paiement est sécurisé (PCI-DSS compliant via Stripe)
- [ ] CA3 : Les principales cartes bancaires sont acceptées (Visa, Mastercard, American Express)
- [ ] CA4 : En cas de paiement refusé, un message d'erreur clair est affiché
- [ ] CA5 : En cas de succès, la commande est créée en base et l'utilisateur est redirigé vers une page de confirmation
- [ ] CA6 : Un email de confirmation est envoyé automatiquement après le paiement (US-055)
- [ ] CA7 : Le mode test Stripe fonctionne avec les cartes de test officielles

**Definition of Done :**
- [ ] Intégration Stripe testée en mode sandbox
- [ ] Webhook Stripe configuré pour confirmer le paiement
- [ ] Migration Supabase créée (table `orders`)
- [ ] Code reviewé
- [ ] Aucune donnée de carte stockée côté serveur

**Notes techniques :** Nécessite la création d'une Supabase Edge Function pour créer le Payment Intent Stripe (les clés secrètes Stripe ne doivent jamais être exposées côté client).

**Points :** 8 | **Priorité :** Haute | **Sprint :** 7

---

### US-055 : Email de confirmation de commande
**En tant qu'** utilisateur ayant passé commande
**Je veux** recevoir un email de confirmation
**Afin d'** avoir la preuve de mon achat et le récapitulatif de ma commande

**Critères d'acceptation :**
- [ ] CA1 : Un email est envoyé automatiquement après la confirmation du paiement Stripe
- [ ] CA2 : L'email contient : numéro de commande, liste des composants, prix total, adresse de livraison
- [ ] CA3 : L'email est envoyé à l'adresse du compte utilisateur
- [ ] CA4 : L'email est correctement formaté en HTML (pas de texte brut uniquement)
- [ ] CA5 : L'email est envoyé depuis une adresse no-reply@pcaeris.fr (ou équivalent)

**Definition of Done :**
- [ ] Template email créé et validé
- [ ] Envoi automatique déclenché par le webhook Stripe
- [ ] Testé en sandbox (email réellement reçu)

**Points :** 3 | **Priorité :** Haute | **Sprint :** 7

---

## Activité 5 — Gérer son compte

---

### US-061 : Page de profil utilisateur
**En tant qu'** utilisateur connecté
**Je veux** accéder à ma page de profil
**Afin de** voir et modifier mes informations personnelles

**Critères d'acceptation :**
- [ ] CA1 : La page /profile affiche les informations de l'utilisateur (prénom, nom, pseudo, email, téléphone)
- [ ] CA2 : La page est protégée et redirige vers /signin si l'utilisateur n'est pas connecté
- [ ] CA3 : Un formulaire d'édition permet de modifier les informations (US-062)
- [ ] CA4 : La date d'inscription est affichée en lecture seule
- [ ] CA5 : Des liens vers les sections Mes configurations et Mes commandes sont présents

**Definition of Done :**
- [ ] Le TODO dans App.tsx est remplacé par le vrai composant
- [ ] Code reviewé
- [ ] Responsive vérifié

**Notes techniques :** La route /profile retourne actuellement `<div>Page Profil (TODO)</div>`. Il faut créer la page `/src/pages/Profile/Profile.tsx`.

**Points :** 3 | **Priorité :** Haute | **Sprint :** 5

---

### US-062 : Modification des informations personnelles
**En tant qu'** utilisateur connecté
**Je veux** modifier mon prénom, nom et numéro de téléphone
**Afin de** maintenir mes informations personnelles à jour

**Critères d'acceptation :**
- [ ] CA1 : Les champs prénom, nom et téléphone sont éditables
- [ ] CA2 : Le numéro de téléphone est validé (format international ou français)
- [ ] CA3 : Un bouton "Enregistrer" soumet les modifications
- [ ] CA4 : Un toast de succès est affiché après enregistrement
- [ ] CA5 : En cas d'erreur serveur, un message est affiché
- [ ] CA6 : L'email n'est pas modifiable directement (nécessite une procédure séparée)

**Definition of Done :**
- [ ] Code reviewé
- [ ] updateProfile dans authService.ts fonctionnel
- [ ] Données mises à jour dans la table profiles Supabase
- [ ] Responsive vérifié

**Points :** 2 | **Priorité :** Haute | **Sprint :** 5

---

## Activité 6 — [Admin] Gérer la plateforme

---

### US-069 : Dashboard admin
**En tant qu'** administrateur
**Je veux** voir un tableau de bord avec les statistiques clés de la plateforme
**Afin de** suivre l'activité en un coup d'oeil

**Critères d'acceptation :**
- [ ] CA1 : Le dashboard affiche le nombre total d'utilisateurs inscrits
- [ ] CA2 : Le dashboard affiche le nombre total de produits dans le catalogue
- [ ] CA3 : Le dashboard affiche le nombre de commandes (quand disponible)
- [ ] CA4 : Les stats sont chargées depuis Supabase (pas de données hardcodées)
- [ ] CA5 : Un état de chargement est affiché pendant la récupération des données
- [ ] CA6 : L'accès au dashboard est restreint aux utilisateurs avec le rôle "admin"

**Definition of Done :**
- [ ] Code reviewé
- [ ] ProtectedRoute avec requiredRole="admin" en place
- [ ] Testé avec un compte admin et un compte user

**Points :** 5 | **Priorité :** Critique | **Sprint :** 1 | **Statut :** Done

---

### US-076 : Modification d'un produit existant
**En tant qu'** administrateur
**Je veux** modifier les informations et les specs techniques d'un produit
**Afin de** maintenir le catalogue à jour avec les bonnes informations

**Critères d'acceptation :**
- [ ] CA1 : Un bouton "Modifier" sur chaque ligne du tableau produits ouvre un formulaire d'édition
- [ ] CA2 : Le formulaire permet de modifier les informations générales (nom, fabricant, série, année)
- [ ] CA3 : Le formulaire permet de modifier toutes les specs techniques selon la catégorie du produit
- [ ] CA4 : Les specs sont typées correctement (texte, nombre, booléen, tableau, JSONB)
- [ ] CA5 : Les modifications sont sauvegardées dans la table produits et la table specs correspondante
- [ ] CA6 : Un toast de confirmation est affiché après sauvegarde

**Definition of Done :**
- [ ] Code reviewé
- [ ] Testé sur toutes les catégories de produits
- [ ] Données réellement mises à jour en base vérifiées

**Points :** 5 | **Priorité :** Critique | **Sprint :** 1 | **Statut :** Done

---

### US-078 : Création d'un nouveau produit depuis l'admin
**En tant qu'** administrateur
**Je veux** créer un nouveau produit directement depuis l'interface admin
**Afin d'** enrichir le catalogue sans dépendre des scripts d'import

**Critères d'acceptation :**
- [ ] CA1 : Un bouton "Nouveau produit" est présent sur la page admin Produits
- [ ] CA2 : Cliquer ouvre un formulaire de création avec les champs : catégorie, nom, fabricant, série, année, image URL
- [ ] CA3 : Après sélection de la catégorie, les champs de specs correspondants s'affichent dynamiquement
- [ ] CA4 : Le produit est créé dans la table `products` et les specs dans la table dédiée (`cpu_specs`, etc.)
- [ ] CA5 : Un toast de confirmation est affiché après création
- [ ] CA6 : La liste des produits se rafraîchit automatiquement après la création

**Definition of Done :**
- [ ] Code reviewé
- [ ] Testé sur au moins 3 catégories différentes
- [ ] Données créées en base vérifiées
- [ ] Aucune régression sur l'édition de produits existants

**Notes techniques :** L'interface admin actuelle permet seulement l'édition et la suppression. La création est manquante. Le formulaire peut réutiliser les composants de formulaire existants et le SPECS_SCHEMA déjà défini dans Products.tsx.

**Points :** 5 | **Priorité :** Haute | **Sprint :** 4

---

### US-079 : Gestion des prix des produits
**En tant qu'** administrateur
**Je veux** définir et modifier le prix de chaque produit
**Afin que** les utilisateurs voient les tarifs réels dans le configurateur

**Critères d'acceptation :**
- [ ] CA1 : Un champ "Prix (€)" est ajouté au formulaire d'édition de produit
- [ ] CA2 : Le champ prix est également présent lors de la création d'un produit (US-078)
- [ ] CA3 : Le prix est stocké en centimes d'euro (entier) dans la base de données pour éviter les problèmes de virgule flottante
- [ ] CA4 : Le prix peut être nul (produit sans prix affiché)
- [ ] CA5 : Les prix sont affichés en format "1 249,99 €" dans le configurateur et le backoffice

**Definition of Done :**
- [ ] Migration Supabase ajoutant la colonne `price_cents INTEGER` dans la table `products`
- [ ] Code reviewé
- [ ] Prix affiché correctement dans le configurateur (US-028, US-039)
- [ ] Testé avec des prix avec et sans centimes

**Notes techniques :** La table `products` n'a pas de colonne prix. Une migration Supabase est nécessaire.

**Points :** 3 | **Priorité :** Haute | **Sprint :** 4

---

### US-084 : Notifications toast globales
**En tant qu'** utilisateur
**Je veux** voir des notifications toast pour les actions importantes (succès, erreur, info)
**Afin d'** être informé du résultat de mes actions sans bloquer mon flux de travail

**Critères d'acceptation :**
- [ ] CA1 : Un composant Toast est disponible globalement dans l'application
- [ ] CA2 : Les types de toast supportés sont : success (vert), error (rouge), info (bleu), warning (orange)
- [ ] CA3 : Les toasts s'affichent en haut à droite de l'écran et disparaissent après 4 secondes
- [ ] CA4 : L'utilisateur peut fermer un toast manuellement
- [ ] CA5 : Plusieurs toasts peuvent être empilés
- [ ] CA6 : Les toasts sont utilisés après toutes les actions importantes : connexion, déconnexion, sauvegarde, erreur...

**Definition of Done :**
- [ ] Composant Toast créé dans le design system
- [ ] Store Zustand ou Context pour la gestion des toasts
- [ ] Intégré dans les actions critiques existantes (auth, config save, admin actions)
- [ ] Responsive vérifié
- [ ] Accessible (role="alert")

**Notes techniques :** Peut utiliser une librairie légère (react-hot-toast, sonner) ou une implémentation custom cohérente avec le design system existant.

**Points :** 3 | **Priorité :** Haute | **Sprint :** 2

---

### US-086 : Tests unitaires sur les utils et services critiques
**En tant que** développeur
**Je veux** avoir une couverture de tests unitaires sur les fonctions critiques
**Afin d'** éviter les régressions lors des évolutions du code

**Critères d'acceptation :**
- [ ] CA1 : La configuration Vitest est mise en place
- [ ] CA2 : Les fonctions de compatibilité dans `/src/utils/compatibility.ts` sont couvertes par des tests
- [ ] CA3 : Les fonctions du authService sont testées (mock Supabase)
- [ ] CA4 : La couverture de code atteint au moins 60% sur les fichiers utils et services
- [ ] CA5 : Les tests passent dans le pipeline CI/CD (GitHub Actions)

**Definition of Done :**
- [ ] Vitest + Testing Library configurés
- [ ] Au moins 15 tests unitaires écrits
- [ ] CI passe sur toutes les PRs
- [ ] README mis à jour avec les instructions de test

**Points :** 8 | **Priorité :** Haute | **Sprint :** 3
