# Backlog Produit — PC Aeris

> **Dernière mise à jour :** 15 juin 2026
> **Total :** 91 user stories (87 initiales + 4 ajoutées en juin pour le workflow de devis)
> **Tri :** par **priorité décroissante** (Critique → Haute → Moyenne → Basse), puis par identifiant.
> **Vélocité réelle observée :** ~22 points/sprint en moyenne sur S1→S4 (projet solo).
> **Vue temporelle (par sprint) :** voir [roadmap.md](./roadmap.md).

Le backlog ci-dessous est **priorisé** : il se lit de haut en bas, du plus bloquant au plus optionnel. La priorité reflète la valeur business et le caractère bloquant pour le MVP ; le statut reflète l'état réel du code au 15 juin 2026.

---

## Légende

| Priorité | Description |
|---|---|
| **Critique** | Bloquant pour le MVP — sans cela, le produit ne fonctionne pas |
| **Haute** | Valeur business forte, à livrer en V1 |
| **Moyenne** | Améliore l'expérience, peut attendre V1/V2 |
| **Basse** | *Nice-to-have*, V2 ou au-delà |

| Statut | Description |
|---|---|
| **Done** | Développé et fonctionnel |
| **En cours** | En cours de développement |
| **Tech ready** | UI/code prêts, en attente de données (prix : credentials API non obtenus) |
| **À faire** | Pas encore développé |

---

## Backlog priorisé

### 🔴 Priorité Critique (26 stories — 100 % livrées)

| ID | User Story | Activité | Rôle | Sprint | Statut | Pts |
|---|---|---|---|---|---|---|
| US-001 | Page d'accueil claire présentant PC Aeris | Découvrir | Visiteur | 1 | Done | 5 |
| US-005 | Menu de navigation clair | Découvrir | Visiteur | 1 | Done | 3 |
| US-008 | Liste des composants par catégorie | Découvrir | Visiteur | 1 | Done | 3 |
| US-011 | Créer un compte (email + mot de passe) | S'authentifier | Visiteur | 1 | Done | 3 |
| US-012 | Choisir un pseudo à l'inscription | S'authentifier | Visiteur | 1 | Done | 2 |
| US-014 | Se connecter (email + mot de passe) | S'authentifier | Utilisateur | 1 | Done | 2 |
| US-015 | Se connecter avec son pseudo (fix bug) | S'authentifier | Utilisateur | 2 | Done | 3 |
| US-017 | Recevoir un email de réinitialisation | S'authentifier | Utilisateur | 1 | Done | 2 |
| US-018 | Définir un nouveau mot de passe | S'authentifier | Utilisateur | 1 | Done | 2 |
| US-019 | Se déconnecter | S'authentifier | Utilisateur | 1 | Done | 1 |
| US-020 | Accéder au configurateur | Configurer | Utilisateur | 1 | Done | 1 |
| US-021 | Voir toutes les catégories de composants | Configurer | Utilisateur | 1 | Done | 2 |
| US-023 | Parcourir les composants (pagination) | Configurer | Utilisateur | 1 | Done | 3 |
| US-024 | Rechercher un composant par nom | Configurer | Utilisateur | 1 | Done | 2 |
| US-025 | Voir les caractéristiques techniques clés | Configurer | Utilisateur | 1 | Done | 2 |
| US-026 | Sélectionner un composant | Configurer | Utilisateur | 1 | Done | 2 |
| US-027 | Retirer un composant | Configurer | Utilisateur | 1 | Done | 1 |
| US-031 | Filtrage compatibilité CPU/Carte mère/RAM | Configurer | Utilisateur | 1 | Done | 8 |
| US-038 | Récapitulatif de configuration | Configurer | Utilisateur | 1 | Done | 2 |
| US-069 | Dashboard admin (stats clés) | Admin | Admin | 1 | Done | 5 |
| US-071 | Liste des utilisateurs | Admin | Admin | 1 | Done | 3 |
| US-072 | Modifier le rôle d'un utilisateur | Admin | Admin | 1 | Done | 2 |
| US-073 | Supprimer un compte utilisateur | Admin | Admin | 1 | Done | 2 |
| US-075 | Liste des produits | Admin | Admin | 1 | Done | 3 |
| US-076 | Modifier un produit (infos + specs) | Admin | Admin | 1 | Done | 5 |
| US-077 | Supprimer un produit | Admin | Admin | 1 | Done | 2 |

### 🟠 Priorité Haute (47 stories)

| ID | User Story | Activité | Rôle | Sprint | Statut | Pts |
|---|---|---|---|---|---|---|
| US-002 | Hero banner avec CTA configurateur | Découvrir | Visiteur | 2 | Done | 3 |
| US-003 | Configurations populaires / pré-montées | Découvrir | Visiteur | 6 | Done | 5 |
| US-004 | Tarifs indicatifs d'assemblage | Découvrir | Visiteur | 5 | Done | 2 |
| US-006 | Site responsive mobile complet | Découvrir | Visiteur | 5 | En cours | 8 |
| US-009 | Filtrer le catalogue (marque, prix, specs) | Découvrir | Visiteur | 6 | À faire | 5 |
| US-010 | Prix de chaque composant au catalogue | Découvrir | Visiteur | 5 | Tech ready | 3 |
| US-016 | Rester connecté entre sessions | S'authentifier | Utilisateur | 5 | À faire | 2 |
| US-028 | Prix de chaque composant au configurateur | Configurer | Utilisateur | 5 | Tech ready | 3 |
| US-030 | Image du composant dans la liste | Configurer | Utilisateur | 5 | À faire | 2 |
| US-032 | Explication du filtre de compatibilité actif | Configurer | Utilisateur | 1 | Done | 2 |
| US-033 | Compatibilité GPU / Alimentation (TDP) | Configurer | Utilisateur | 3 | Done | 5 |
| US-034 | Compatibilité Boîtier / Format carte mère | Configurer | Utilisateur | 3 | Done | 3 |
| US-035 | Compatibilité Stockage / Carte mère (M.2/SATA) | Configurer | Utilisateur | 3 | Done | 3 |
| US-039 | Prix total de la configuration | Configurer | Utilisateur | 5 | Tech ready | 2 |
| US-040 | Indicateur de complétude | Configurer | Utilisateur | Mai | Done | 3 |
| US-041 | Sauvegarder une configuration | Configurer | Utilisateur | Mai | Done | 5 |
| US-042 | Nommer une configuration sauvegardée | Configurer | Utilisateur | Mai | Done | 2 |
| US-043 | Accéder à ses configurations sauvegardées | Configurer | Utilisateur | Mai | Done | 3 |
| US-047 | Ajouter une configuration au panier | Commander | Utilisateur | 6 | Done | 5 |
| US-048 | Voir le contenu du panier (détail + prix) | Commander | Utilisateur | 6 | Done | 3 |
| US-049 | Modifier / supprimer des articles du panier | Commander | Utilisateur | 6 | Done | 3 |
| US-050 | Panier persistant entre sessions | Commander | Utilisateur | 6 | Done | 3 |
| US-051 | Saisir une adresse de livraison au checkout | Commander | Utilisateur | 7 | Done | 3 |
| US-052 | Choisir une adresse sauvegardée au checkout | Commander | Utilisateur | 7 | Done | 2 |
| US-054 | Paiement par carte via Stripe | Commander | Utilisateur | 7 | À faire | 8 |
| US-055 | Email de confirmation de commande | Commander | Utilisateur | 7 | À faire | 3 |
| US-058 | Historique de ses commandes | Commander | Utilisateur | 8 | Done | 3 |
| US-059 | Statut détaillé d'une commande en cours | Commander | Utilisateur | 8 | Done | 3 |
| US-061 | Page de profil utilisateur | Gérer compte | Utilisateur | 5 | Done | 3 |
| US-062 | Modifier prénom, nom, téléphone | Gérer compte | Utilisateur | 5 | Done | 2 |
| US-063 | Modifier son pseudo | Gérer compte | Utilisateur | 5 | À faire | 2 |
| US-064 | Changer son mot de passe depuis le profil | Gérer compte | Utilisateur | 5 | Done | 2 |
| US-066 | Ajouter des adresses de livraison au profil | Gérer compte | Utilisateur | 6 | Done | 3 |
| US-067 | Définir une adresse par défaut | Gérer compte | Utilisateur | 6 | Done | 2 |
| US-074 | Rechercher et filtrer les utilisateurs (admin) | Admin | Admin | 5 | À faire | 3 |
| US-078 | Créer un nouveau produit (admin) | Admin | Admin | 4 | Done | 5 |
| US-079 | Définir et modifier le prix d'un produit | Admin | Admin | 4 | Done | 3 |
| US-081 | Liste de toutes les commandes (admin) | Admin | Admin | 7 | Done | 3 |
| US-082 | Mettre à jour le statut d'une commande | Admin | Admin | 7 | Done | 3 |
| US-083 | Voir le détail d'une commande (admin) | Admin | Admin | 7 | Done | 2 |
| US-084 | Notifications toast globales | Transverse | Utilisateur | 2 | Done | 3 |
| US-086 | Tests unitaires (utils + services) | Transverse | Dev | 3 | Done | 8 |
| US-087 | Tests d'intégration (flux critiques) | Transverse | Dev | 4 | Done | 13 |
| US-088 | Demander un devis à partir du panier | Commander | Utilisateur | Juin | Done | 3 |
| US-089 | Compléter et envoyer le devis final (admin) | Admin | Admin | Juin | Done | 5 |
| US-090 | Accepter ou refuser le devis reçu | Commander | Utilisateur | Juin | Done | 3 |
| US-091 | Email automatique d'envoi du devis | Transverse | Système | Juin | Done | 3 |

### 🟡 Priorité Moyenne (12 stories)

| ID | User Story | Activité | Rôle | Sprint | Statut | Pts |
|---|---|---|---|---|---|---|
| US-007 | Footer + pages légales (CGV, mentions, RGPD) | Découvrir | Visiteur | 5 | Done | 2 |
| US-013 | S'inscrire via Google (OAuth) | S'authentifier | Visiteur | 7 | À faire | 5 |
| US-022 | Choisir un usage cible (questionnaire guidé) | Configurer | Utilisateur | 6 | Done | 8 |
| US-029 | Filtrer les composants par fourchette de prix | Configurer | Utilisateur | 6 | À faire | 3 |
| US-044 | Supprimer une configuration sauvegardée | Configurer | Utilisateur | Mai | Done | 1 |
| US-045 | Partager une configuration via un lien | Configurer | Utilisateur | 8 | À faire | 5 |
| US-053 | Choisir une option de livraison | Commander | Utilisateur | 7 | À faire | 3 |
| US-060 | Notifications email à chaque changement de statut | Commander | Utilisateur | 9 | À faire | 5 |
| US-068 | Supprimer son compte (RGPD) | Gérer compte | Utilisateur | 9 | Done | 5 |
| US-070 | Graphiques d'évolution (admin) | Admin | Admin | 6 | À faire | 5 |
| US-080 | Import CSV de produits (admin) | Admin | Admin | 8 | À faire | 8 |
| US-085 | Page 404 personnalisée | Transverse | Visiteur | 4 | Done | 2 |

### 🟢 Priorité Basse (6 stories — V2)

| ID | User Story | Activité | Rôle | Sprint | Statut | Pts |
|---|---|---|---|---|---|---|
| US-036 | Analyse IA de la configuration | Configurer | Utilisateur | 9+ | À faire | 13 |
| US-037 | Suggestion automatique de PSU | Configurer | Utilisateur | 9+ | À faire | 8 |
| US-046 | Exporter une configuration en PDF | Configurer | Utilisateur | 9+ | À faire | 5 |
| US-056 | Payer en plusieurs fois | Commander | Utilisateur | 10+ | À faire | 5 |
| US-057 | Payer via PayPal | Commander | Utilisateur | 10+ | À faire | 5 |
| US-065 | Uploader une photo de profil (avatar) | Gérer compte | Utilisateur | 9+ | À faire | 5 |

---

## Récapitulatif par statut (au 15 juin 2026)

| Statut | Nombre | Points (≈) |
|---|---|---|
| Done | 67 | ~216 |
| Tech ready (prix, en attente credentials API) | 3 | ~8 |
| En cours | 1 | ~8 |
| À faire | 20 | ~100 |
| **Total** | **91** | **~332** |

**Lecture :** **100 % des stories Critiques** et **~77 % des stories Hautes** sont livrées. Le reliquat « À faire » est concentré sur la **V2** (IA, paiements alternatifs, avatar) et sur trois chantiers V1 ciblés (Stripe, OAuth, filtres avancés). Le paiement direct Stripe (US-054) a été temporairement remplacé par un **workflow de devis** (US-088 à US-091) : le client demande un devis depuis son panier, l'administrateur le complète avec les vendeurs et prix réels, puis le client l'accepte ou le refuse en ligne.

**Note « Tech ready »** : US-010, US-028, US-039 — l'UI sait afficher des prix mais aucune donnée n'est en base. La tuyauterie multi-sources (Amazon / Rakuten / Cdiscount / eBay) est scaffoldée, en attente des credentials API.
