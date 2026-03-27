# Story Map — PC Aeris

> **Dernière mise à jour :** 27 mars 2026
> **Projet :** PC Aeris — Configurateur PC sur mesure
> **Légende :** [MVP] = Sprint 1-4 | [V1] = Sprint 5-8 | [V2] = Sprint 9+

---

## Vue d'ensemble des activités

| # | Activité | Rôle principal | Swimlane cible |
|---|---|---|---|
| 1 | Découvrir la plateforme | Visiteur | MVP |
| 2 | S'authentifier | Utilisateur | MVP |
| 3 | Configurer son PC | Utilisateur | MVP |
| 4 | Passer commande | Utilisateur | V1 |
| 5 | Gérer son compte | Utilisateur connecté | V1 |
| 6 | [Admin] Gérer la plateforme | Administrateur | MVP/V1 |

---

## Activité 1 : Découvrir la plateforme

### Tâche 1.1 : Accéder à la page d'accueil
- [MVP] US-001 : En tant que visiteur, je veux accéder à une page d'accueil claire afin de comprendre ce que propose PC Aeris
- [MVP] US-002 : En tant que visiteur, je veux voir une présentation visuelle du configurateur afin d'être incité à l'essayer
- [V1] US-003 : En tant que visiteur, je veux voir des exemples de configurations populaires afin de m'inspirer avant de démarrer
- [V1] US-004 : En tant que visiteur, je veux voir les tarifs indicatifs d'assemblage afin d'évaluer si le service correspond à mon budget

### Tâche 1.2 : Naviguer dans le site
- [MVP] US-005 : En tant que visiteur, je veux un menu de navigation clair afin d'accéder rapidement aux différentes sections du site
- [V1] US-006 : En tant que visiteur, je veux naviguer depuis un smartphone afin d'utiliser le site en mobilité
- [V1] US-007 : En tant que visiteur, je veux un footer avec les informations légales et les liens utiles afin de trouver les informations de contact et CGV

### Tâche 1.3 : Consulter le catalogue de composants
- [MVP] US-008 : En tant que visiteur, je veux voir la liste des composants disponibles par catégorie afin d'explorer les produits avant de configurer
- [V1] US-009 : En tant que visiteur, je veux filtrer les composants par marque, prix et caractéristiques afin de trouver rapidement les produits qui m'intéressent
- [V1] US-010 : En tant que visiteur, je veux voir le prix de chaque composant afin d'évaluer le budget nécessaire

---

## Activité 2 : S'authentifier

### Tâche 2.1 : Créer un compte
- [MVP] US-011 : En tant que visiteur, je veux créer un compte avec mon email et un mot de passe afin d'accéder aux fonctionnalités personnalisées
- [MVP] US-012 : En tant que visiteur, je veux choisir un pseudo lors de l'inscription afin de personnaliser mon profil
- [V1] US-013 : En tant que visiteur, je veux m'inscrire via Google afin de créer un compte plus rapidement sans saisir mes informations

### Tâche 2.2 : Se connecter
- [MVP] US-014 : En tant qu'utilisateur, je veux me connecter avec mon email et mot de passe afin d'accéder à mon espace personnel
- [MVP] US-015 : En tant qu'utilisateur, je veux me connecter avec mon pseudo afin d'avoir une alternative à l'email (correction bug)
- [V1] US-016 : En tant qu'utilisateur, je veux rester connecté entre les sessions afin de ne pas avoir à me reconnecter à chaque visite

### Tâche 2.3 : Récupérer son accès
- [MVP] US-017 : En tant qu'utilisateur, je veux recevoir un email de réinitialisation de mot de passe afin de récupérer l'accès à mon compte si je l'ai oublié
- [MVP] US-018 : En tant qu'utilisateur, je veux définir un nouveau mot de passe via le lien reçu par email afin de restaurer l'accès à mon compte

### Tâche 2.4 : Se déconnecter
- [MVP] US-019 : En tant qu'utilisateur connecté, je veux me déconnecter afin de sécuriser mon compte sur un appareil partagé

---

## Activité 3 : Configurer son PC

### Tâche 3.1 : Démarrer une configuration
- [MVP] US-020 : En tant qu'utilisateur, je veux accéder au configurateur PC afin de commencer à choisir mes composants
- [MVP] US-021 : En tant qu'utilisateur, je veux voir toutes les catégories de composants disponibles (CPU, GPU, RAM, etc.) afin de savoir quoi sélectionner pour un PC complet
- [V1] US-022 : En tant qu'utilisateur, je veux choisir un usage cible (Gaming, Bureautique, Création) afin d'obtenir des suggestions de composants adaptées

### Tâche 3.2 : Sélectionner des composants
- [MVP] US-023 : En tant qu'utilisateur, je veux parcourir les composants d'une catégorie avec pagination afin de voir toutes les options disponibles
- [MVP] US-024 : En tant qu'utilisateur, je veux rechercher un composant par nom afin de trouver rapidement un produit spécifique
- [MVP] US-025 : En tant qu'utilisateur, je veux voir les caractéristiques techniques clés d'un composant afin de comparer les options
- [MVP] US-026 : En tant qu'utilisateur, je veux sélectionner un composant pour l'ajouter à ma configuration afin de composer mon PC
- [MVP] US-027 : En tant qu'utilisateur, je veux retirer un composant de ma configuration afin de le remplacer par un autre choix
- [V1] US-028 : En tant qu'utilisateur, je veux voir le prix de chaque composant afin d'évaluer le coût total de ma configuration
- [V1] US-029 : En tant qu'utilisateur, je veux filtrer les composants par fourchette de prix afin de rester dans mon budget
- [V1] US-030 : En tant qu'utilisateur, je veux voir une image du composant afin de visualiser le produit que je sélectionne

### Tâche 3.3 : Vérifier la compatibilité
- [MVP] US-031 : En tant qu'utilisateur, je veux que le configurateur filtre automatiquement les composants incompatibles (CPU/Carte mère, RAM) afin de ne sélectionner que des pièces compatibles
- [MVP] US-032 : En tant qu'utilisateur, je veux voir pourquoi un filtre de compatibilité est actif afin de comprendre les contraintes de ma configuration
- [V1] US-033 : En tant qu'utilisateur, je veux que la compatibilité GPU/Alimentation soit vérifiée afin d'éviter de choisir un PSU insuffisant
- [V1] US-034 : En tant qu'utilisateur, je veux que la compatibilité Boîtier/Format carte mère soit vérifiée afin d'éviter des problèmes d'installation
- [V1] US-035 : En tant qu'utilisateur, je veux que la compatibilité Stockage/Carte mère (M.2 vs SATA) soit vérifiée afin de m'assurer que mes disques sont supportés
- [V2] US-036 : En tant qu'utilisateur, je veux recevoir une analyse IA de ma configuration afin d'obtenir des recommandations personnalisées sur les points forts et faiblesses
- [V2] US-037 : En tant qu'utilisateur, je veux que le configurateur me suggère automatiquement un PSU adapté à la consommation totale estimée afin de ne pas sous-dimensionner mon alimentation

### Tâche 3.4 : Voir le récapitulatif de configuration
- [MVP] US-038 : En tant qu'utilisateur, je veux voir un récapitulatif de tous mes composants sélectionnés afin d'avoir une vue d'ensemble de ma configuration
- [V1] US-039 : En tant qu'utilisateur, je veux voir le prix total de ma configuration afin de savoir combien coûteront les composants
- [V1] US-040 : En tant qu'utilisateur, je veux voir un indicateur de complétude de ma configuration afin de savoir s'il me manque des composants essentiels

### Tâche 3.5 : Sauvegarder et partager une configuration
- [V1] US-041 : En tant qu'utilisateur connecté, je veux sauvegarder ma configuration afin de la retrouver lors de ma prochaine visite
- [V1] US-042 : En tant qu'utilisateur connecté, je veux nommer ma configuration sauvegardée afin de l'identifier facilement parmi plusieurs sauvegardes
- [V1] US-043 : En tant qu'utilisateur connecté, je veux accéder à mes configurations sauvegardées afin de les reprendre ou les modifier
- [V1] US-044 : En tant qu'utilisateur connecté, je veux supprimer une configuration sauvegardée afin de faire de la place dans mes sauvegardes
- [V2] US-045 : En tant qu'utilisateur, je veux partager ma configuration via un lien unique afin de la montrer à des amis ou demander un avis
- [V2] US-046 : En tant qu'utilisateur, je veux exporter ma configuration en PDF afin de l'avoir en format imprimable

---

## Activité 4 : Passer commande

### Tâche 4.1 : Gérer le panier
- [V1] US-047 : En tant qu'utilisateur, je veux ajouter ma configuration au panier afin de procéder à la commande
- [V1] US-048 : En tant qu'utilisateur, je veux voir le contenu de mon panier avec le détail des composants et des prix afin de vérifier ma commande avant de payer
- [V1] US-049 : En tant qu'utilisateur, je veux modifier la quantité ou supprimer des articles de mon panier afin d'ajuster ma commande
- [V1] US-050 : En tant qu'utilisateur, je veux que mon panier soit persistant entre les sessions afin de ne pas perdre mes articles si je quitte le site

### Tâche 4.2 : Saisir les informations de livraison
- [V1] US-051 : En tant qu'utilisateur, je veux saisir mon adresse de livraison afin que mon assemblage soit expédié au bon endroit
- [V1] US-052 : En tant qu'utilisateur, je veux choisir parmi mes adresses sauvegardées afin de ne pas ressaisir mes informations à chaque commande
- [V1] US-053 : En tant qu'utilisateur, je veux choisir une option de livraison (standard, express) afin d'adapter la livraison à mes besoins

### Tâche 4.3 : Payer
- [V1] US-054 : En tant qu'utilisateur, je veux payer ma commande par carte bancaire via Stripe afin de finaliser mon achat de façon sécurisée
- [V1] US-055 : En tant qu'utilisateur, je veux recevoir un email de confirmation de commande afin d'avoir la preuve de mon achat
- [V2] US-056 : En tant qu'utilisateur, je veux payer en plusieurs fois afin de financer l'achat d'une configuration haut de gamme
- [V2] US-057 : En tant qu'utilisateur, je veux payer via PayPal afin d'avoir une alternative à la carte bancaire

### Tâche 4.4 : Suivre sa commande
- [V1] US-058 : En tant qu'utilisateur, je veux accéder à l'historique de mes commandes afin de voir mes achats passés
- [V1] US-059 : En tant qu'utilisateur, je veux voir le statut de ma commande en cours afin de savoir où en est l'assemblage et la livraison
- [V2] US-060 : En tant qu'utilisateur, je veux recevoir des notifications par email à chaque changement de statut de commande afin d'être informé de l'avancement

---

## Activité 5 : Gérer son compte

### Tâche 5.1 : Consulter et modifier son profil
- [V1] US-061 : En tant qu'utilisateur connecté, je veux accéder à ma page de profil afin de voir et modifier mes informations personnelles
- [V1] US-062 : En tant qu'utilisateur connecté, je veux modifier mon prénom, nom et numéro de téléphone afin de maintenir mes informations à jour
- [V1] US-063 : En tant qu'utilisateur connecté, je veux modifier mon pseudo afin de personnaliser mon identifiant public
- [V1] US-064 : En tant qu'utilisateur connecté, je veux changer mon mot de passe depuis mon profil afin de sécuriser mon compte
- [V2] US-065 : En tant qu'utilisateur connecté, je veux uploader une photo de profil afin de personnaliser mon avatar

### Tâche 5.2 : Gérer ses adresses
- [V1] US-066 : En tant qu'utilisateur connecté, je veux ajouter des adresses de livraison à mon profil afin de les réutiliser lors de mes commandes
- [V1] US-067 : En tant qu'utilisateur connecté, je veux définir une adresse par défaut afin de gagner du temps lors du tunnel de commande

### Tâche 5.3 : Supprimer son compte
- [V2] US-068 : En tant qu'utilisateur connecté, je veux supprimer mon compte afin d'exercer mon droit à l'effacement des données (RGPD)

---

## Activité 6 : [Admin] Gérer la plateforme

### Tâche 6.1 : Surveiller l'activité
- [MVP] US-069 : En tant qu'administrateur, je veux voir un tableau de bord avec les statistiques clés (utilisateurs, produits, commandes) afin de suivre l'activité de la plateforme
- [V1] US-070 : En tant qu'administrateur, je veux voir des graphiques d'évolution des inscriptions et des commandes afin d'analyser les tendances

### Tâche 6.2 : Gérer les utilisateurs
- [MVP] US-071 : En tant qu'administrateur, je veux voir la liste de tous les utilisateurs avec leur rôle et leur date d'inscription afin d'avoir une vue d'ensemble
- [MVP] US-072 : En tant qu'administrateur, je veux modifier le rôle d'un utilisateur (user/admin) afin de gérer les droits d'accès
- [MVP] US-073 : En tant qu'administrateur, je veux supprimer un compte utilisateur afin de modérer la plateforme
- [V1] US-074 : En tant qu'administrateur, je veux rechercher et filtrer les utilisateurs afin de trouver rapidement un compte spécifique

### Tâche 6.3 : Gérer les produits
- [MVP] US-075 : En tant qu'administrateur, je veux voir la liste de tous les produits avec leur catégorie afin d'avoir une vue d'ensemble du catalogue
- [MVP] US-076 : En tant qu'administrateur, je veux modifier les informations et les specs techniques d'un produit existant afin de maintenir le catalogue à jour
- [MVP] US-077 : En tant qu'administrateur, je veux supprimer un produit afin de retirer du catalogue les composants obsolètes
- [V1] US-078 : En tant qu'administrateur, je veux créer un nouveau produit avec toutes ses specs techniques afin d'enrichir le catalogue sans passer par des scripts
- [V1] US-079 : En tant qu'administrateur, je veux définir le prix de chaque produit afin que les utilisateurs voient les tarifs dans le configurateur
- [V1] US-080 : En tant qu'administrateur, je veux importer des produits en masse depuis un fichier CSV afin d'enrichir rapidement le catalogue

### Tâche 6.4 : Gérer les commandes
- [V1] US-081 : En tant qu'administrateur, je veux voir la liste de toutes les commandes avec leur statut afin de suivre l'activité commerciale
- [V1] US-082 : En tant qu'administrateur, je veux mettre à jour le statut d'une commande (En attente, En assemblage, Expédiée, Livrée) afin de tenir le client informé
- [V1] US-083 : En tant qu'administrateur, je veux voir le détail d'une commande (composants, prix, adresse) afin de préparer l'assemblage

---

## Récapitulatif par swimlane

### MVP (Sprint 1-4)
US-001, US-002, US-005, US-008, US-011, US-012, US-014, US-015, US-017, US-018, US-019, US-020, US-021, US-023, US-024, US-025, US-026, US-027, US-031, US-032, US-038, US-069, US-071, US-072, US-073, US-075, US-076, US-077

### V1 (Sprint 5-8)
US-003, US-004, US-006, US-007, US-009, US-010, US-013, US-016, US-022, US-028, US-029, US-030, US-033, US-034, US-035, US-039, US-040, US-041, US-042, US-043, US-044, US-047, US-048, US-049, US-050, US-051, US-052, US-053, US-054, US-055, US-058, US-059, US-061, US-062, US-063, US-064, US-066, US-067, US-070, US-074, US-078, US-079, US-080, US-081, US-082, US-083

### V2 (Sprint 9+)
US-036, US-037, US-045, US-046, US-056, US-057, US-060, US-065, US-068
