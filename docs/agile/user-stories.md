# User Stories détaillées — PC Aeris

> **Scope :** user stories de priorité Critique et Haute.
> **Dernière mise à jour :** 15 juin 2026
> **Convention :** les critères d'acceptation (CA) sont les conditions vérifiables en recette.
> **Source de vérité des statuts :** [backlog.md](./backlog.md) — ce document détaille les CA, le backlog liste les statuts et priorités à jour.

---

## Definition of Done générique (commune à toutes les user stories)

Pour éviter la répétition, les critères suivants s'appliquent **à toutes les stories** et ne sont donc **pas répétés** dans chaque fiche. Une story n'est considérée *Done* que si, en plus de ses critères d'acceptation :

- [ ] **Code revu et mergé** sur `develop` (PR relue, CI verte)
- [ ] **Rendu correct** sur les navigateurs cibles (Chrome, Firefox, Safari)
- [ ] **Responsive vérifié** (mobile 375 px, tablette 768 px, desktop)
- [ ] **Aucune erreur** en console sur le parcours concerné
- [ ] **Respect du design system** Aeris Dark (contrastes RGAA AA)

Chaque fiche ci-dessous ne mentionne donc, sous **« DoD spécifique »**, que les conditions **propres** à la story (migration, test ciblé, dépendance, etc.). Les **stories techniques / enabler** (US-086, US-087…), dont la valeur est surtout technique, conservent une DoD spécifique détaillée.

---

## Activité 1 — Découvrir la plateforme

### US-001 : Page d'accueil avec présentation de PC Aeris
**En tant que** visiteur **je veux** une page d'accueil claire **afin de** comprendre ce que propose le service avant de m'inscrire ou de configurer.

**Critères d'acceptation :**
- [ ] CA1 : La page charge en moins de 3 secondes
- [ ] CA2 : La proposition de valeur est visible sans scroller (*above the fold*)
- [ ] CA3 : Un CTA « Configurer mon PC » est visible et fonctionnel
- [ ] CA4 : La page présente au minimum titre, sous-titre et lien vers le configurateur
- [ ] CA5 : La navigation est fonctionnelle (header avec liens principaux)

**DoD spécifique :** aucune (DoD générique suffisante).

**Points :** 5 | **Priorité :** Critique | **Sprint :** 1 | **Statut :** Done

---

### US-002 : Hero banner avec call-to-action vers le configurateur
**En tant que** visiteur **je veux** une bannière hero mettant en avant le configurateur **afin d'**être incité à démarrer dès ma première visite.

**Critères d'acceptation :**
- [ ] CA1 : Un composant HeroBanner est affiché en haut de la home
- [ ] CA2 : La bannière contient titre accrocheur, sous-titre et bouton CTA
- [ ] CA3 : Le CTA redirige vers /configurateur
- [ ] CA4 : La bannière est visuellement distincte (fond, typographie)
- [ ] CA5 : Le visuel de fond est optimisé (WebP ou SVG, < 200 ko)

**DoD spécifique :** performance Lighthouse > 80 sur la home.

**Points :** 3 | **Priorité :** Haute | **Sprint :** 2 | **Statut :** Done

---

### US-005 : Menu de navigation principal
**En tant que** visiteur **je veux** un menu de navigation clair **afin d'**accéder rapidement aux sections du site.

**Critères d'acceptation :**
- [ ] CA1 : Logo PC Aeris cliquable (redirige vers /)
- [ ] CA2 : Liens principaux : Accueil, Configurateur, [Mon compte / Connexion]
- [ ] CA3 : Si connecté, le menu affiche le pseudo et l'accès au profil
- [ ] CA4 : Si admin, un lien « Admin » est visible
- [ ] CA5 : Le menu est sticky au scroll
- [ ] CA6 : Sur mobile, passage en menu hamburger

**DoD spécifique :** navigation au clavier fonctionnelle (accessibilité).

**Points :** 3 | **Priorité :** Critique | **Sprint :** 1 | **Statut :** Done

---

### US-006 : Responsive mobile complet
**En tant que** visiteur **je veux** utiliser le site depuis un smartphone **afin de** configurer ou consulter mes commandes en mobilité.

**Critères d'acceptation :**
- [ ] CA1 : Toutes les pages utilisables dès 375 px de large
- [ ] CA2 : Le configurateur est utilisable sur mobile
- [ ] CA3 : Les formulaires d'auth sont utilisables (inputs assez grands, pas de zoom forcé)
- [ ] CA4 : Les tableaux admin s'adaptent (vue carte sur mobile)
- [ ] CA5 : Aucun contenu tronqué ou inaccessible
- [ ] CA6 : Zones de touch ≥ 44 × 44 px

**DoD spécifique :** testé sur iOS Safari et Android Chrome ; breakpoints 375/414/768 px ; Lighthouse Mobile > 70 ; aucun scroll horizontal parasite.

**Points :** 8 | **Priorité :** Haute | **Sprint :** 5 | **Statut :** En cours

---

## Activité 2 — S'authentifier

### US-011 : Inscription avec email et mot de passe
**En tant que** visiteur **je veux** créer un compte avec email et mot de passe **afin d'**accéder aux fonctionnalités personnalisées.

**Critères d'acceptation :**
- [ ] CA1 : Le formulaire contient email, pseudo, prénom, nom, mot de passe, confirmation
- [ ] CA2 : L'email est validé côté client (format) et serveur (unicité)
- [ ] CA3 : Le pseudo est validé (≥ 3 caractères, alphanumériques et tirets)
- [ ] CA4 : Le mot de passe contient ≥ 8 caractères
- [ ] CA5 : Message de succès après inscription
- [ ] CA6 : Message explicite en cas d'erreur (email déjà utilisé…)
- [ ] CA7 : Connexion automatique après inscription

**DoD spécifique :** données persistées dans Supabase (table `profiles`) ; cas nominaux et d'erreur validés.

**Points :** 3 | **Priorité :** Critique | **Sprint :** 1 | **Statut :** Done

---

### US-014 : Connexion avec email et mot de passe
**En tant qu'**utilisateur inscrit **je veux** me connecter avec mon email et mon mot de passe **afin d'**accéder à mon espace personnel.

**Critères d'acceptation :**
- [ ] CA1 : Champ email/identifiant + champ mot de passe
- [ ] CA2 : La connexion par email fonctionne
- [ ] CA3 : Message d'erreur générique si identifiants incorrects (sans préciser lequel)
- [ ] CA4 : Redirection vers la home (ou admin si rôle admin) après succès
- [ ] CA5 : Lien « Mot de passe oublié ? » présent et fonctionnel
- [ ] CA6 : Lien vers l'inscription présent

**DoD spécifique :** session correctement stockée dans Supabase Auth.

**Points :** 2 | **Priorité :** Critique | **Sprint :** 1 | **Statut :** Done

---

### US-015 : Connexion par pseudo (correction de bug)
**En tant qu'**utilisateur inscrit **je veux** me connecter avec mon pseudo **afin d'**avoir une alternative à l'email.

**Critères d'acceptation :**
- [ ] CA1 : Le champ identifiant accepte email **ou** pseudo
- [ ] CA2 : Si pseudo saisi, le service résout l'email via `profiles` avant Supabase Auth
- [ ] CA3 : Pseudo inexistant → message clair (« Identifiant ou mot de passe incorrect »)
- [ ] CA4 : La connexion par pseudo se comporte comme par email (session, redirection)
- [ ] CA5 : Logique dynamique (plus de comportement hardcodé)

**DoD spécifique :** bug reproduit puis résolu ; aucune régression sur la connexion par email.

**Notes techniques :** la logique initiale renvoyait une erreur hardcodée pour la connexion par pseudo ; implémenter la résolution pseudo → email via `profiles`.

**Points :** 3 | **Priorité :** Critique | **Sprint :** 2 | **Statut :** Done

---

### US-017 : Réinitialisation de mot de passe par email
**En tant qu'**utilisateur ayant oublié son mot de passe **je veux** recevoir un email de réinitialisation **afin de** récupérer l'accès à mon compte.

**Critères d'acceptation :**
- [ ] CA1 : Page « Mot de passe oublié » avec champ email + bouton d'envoi
- [ ] CA2 : Email envoyé si l'adresse existe
- [ ] CA3 : Si l'email n'existe pas, message neutre (ne pas révéler l'existence)
- [ ] CA4 : Message de confirmation après soumission
- [ ] CA5 : Le lien redirige vers /reset-password avec un token valide

**DoD spécifique :** email de reset testé manuellement (envoi et réception).

**Points :** 2 | **Priorité :** Critique | **Sprint :** 1 | **Statut :** Done

---

### US-018 : Définition d'un nouveau mot de passe
**En tant qu'**utilisateur ayant cliqué sur le lien de reset **je veux** définir un nouveau mot de passe **afin de** restaurer l'accès à mon compte.

**Critères d'acceptation :**
- [ ] CA1 : Deux champs : nouveau mot de passe + confirmation
- [ ] CA2 : Règles de validation respectées (≥ 8 caractères)
- [ ] CA3 : Les deux champs doivent être identiques
- [ ] CA4 : Message de succès après changement
- [ ] CA5 : Redirection vers la connexion après succès
- [ ] CA6 : Token invalide/expiré → message d'erreur explicite

**DoD spécifique :** flux complet testé (email → lien → reset → connexion).

**Points :** 2 | **Priorité :** Critique | **Sprint :** 1 | **Statut :** Done

---

## Activité 3 — Configurer son PC

### US-023 : Pagination dans le configurateur
**En tant qu'**utilisateur **je veux** parcourir les composants avec pagination **afin de** voir toutes les options sans saturer la page.

**Critères d'acceptation :**
- [ ] CA1 : Affichage par pages de 24 éléments
- [ ] CA2 : Boutons « Précédent » / « Suivant »
- [ ] CA3 : Nombre total de résultats affiché
- [ ] CA4 : Pagination réinitialisée au changement de catégorie ou de recherche
- [ ] CA5 : État de chargement (spinner)

**DoD spécifique :** testé avec des données réelles en base.

**Points :** 3 | **Priorité :** Critique | **Sprint :** 1 | **Statut :** Done

---

### US-024 : Recherche de composant par nom
**En tant qu'**utilisateur **je veux** rechercher un composant par nom **afin de** trouver rapidement un produit connu.

**Critères d'acceptation :**
- [ ] CA1 : Champ de recherche en haut de la liste
- [ ] CA2 : Recherche insensible à la casse et aux accents
- [ ] CA3 : Déclenchement en temps réel (debounce 300 ms)
- [ ] CA4 : Message « Aucun composant trouvé » si vide
- [ ] CA5 : Pagination réinitialisée à chaque recherche
- [ ] CA6 : Compatible avec les filtres de compatibilité actifs

**DoD spécifique :** testé avec requêtes vides, courtes et longues.

**Points :** 2 | **Priorité :** Critique | **Sprint :** 1 | **Statut :** Done

---

### US-025 : Affichage des caractéristiques techniques clés
**En tant qu'**utilisateur **je veux** voir les specs clés d'un composant dans la liste **afin de** comparer rapidement sans ouvrir le détail.

**Critères d'acceptation :**
- [ ] CA1 : Chaque carte affiche les specs clés par catégorie (ex. CPU → socket, cores, fréquence)
- [ ] CA2 : Specs formatées lisiblement (« 16 cores », « 5.2 GHz », « DDR5 »)
- [ ] CA3 : Valeurs manquantes → « — » plutôt qu'une erreur
- [ ] CA4 : Fabricant et nom du produit affichés
- [ ] CA5 : Indication claire si le composant est déjà sélectionné

**DoD spécifique :** testé sur toutes les catégories de composants.

**Points :** 2 | **Priorité :** Critique | **Sprint :** 1 | **Statut :** Done

---

### US-031 : Filtrage automatique par compatibilité CPU/Carte mère/RAM
**En tant qu'**utilisateur **je veux** que les composants incompatibles soient filtrés automatiquement **afin de** ne pas sélectionner de pièces qui ne fonctionneront pas ensemble.

**Critères d'acceptation :**
- [ ] CA1 : CPU sélectionné → seules les cartes mères au même socket
- [ ] CA2 : Carte mère sélectionnée → seuls les CPU au socket correspondant
- [ ] CA3 : Carte mère sélectionnée → seules les RAM au type compatible (DDR4/DDR5)
- [ ] CA4 : CPU sélectionné → seuls les ventirad compatibles avec le socket
- [ ] CA5 : Filtre désactivé si aucun composant de référence
- [ ] CA6 : Message explicatif si aucun composant compatible

**DoD spécifique :** testé sur Intel LGA1700 et AMD AM5 ; testé avec cas limites (aucun composant de référence).

**Points :** 8 | **Priorité :** Critique | **Sprint :** 1 | **Statut :** Done

---

### US-032 : Explication du filtre de compatibilité actif
**En tant qu'**utilisateur **je veux** voir pourquoi un filtre est actif **afin de** comprendre les contraintes de ma configuration.

**Critères d'acceptation :**
- [ ] CA1 : Un bandeau/badge indique clairement le filtre actif
- [ ] CA2 : Le message indique la raison (ex. « Filtré par socket LGA1700 »)
- [ ] CA3 : Le message s'affiche dans la catégorie concernée
- [ ] CA4 : Si liste filtrée vide, message indiquant l'absence de composant compatible

**DoD spécifique :** message validé comme compréhensible auprès d'un utilisateur.

**Points :** 2 | **Priorité :** Haute | **Sprint :** 1 | **Statut :** Done

---

### US-033 : Compatibilité GPU / Alimentation
**En tant qu'**utilisateur **je veux** que la compatibilité GPU/alimentation soit vérifiée **afin d'**éviter un PSU insuffisant.

**Critères d'acceptation :**
- [ ] CA1 : GPU sélectionné → PSU affichés ≥ (TDP GPU + TDP CPU + marge 20 %)
- [ ] CA2 : Raison du filtre affichée (ex. « puissance minimale recommandée 650 W »)
- [ ] CA3 : Message explicite si aucun PSU ne convient
- [ ] CA4 : Filtre bidirectionnel (GPU filtré si PSU choisi d'abord)

**DoD spécifique :** calcul validé sur plusieurs cas (entry / mid / high-end) ; **tests unitaires** sur la fonction de calcul de consommation.

**Notes techniques :** nécessite le champ `tdp_watts` dans les specs GPU et PSU ; logique dans `/src/utils/compatibility.ts`.

**Points :** 5 | **Priorité :** Haute | **Sprint :** 3 | **Statut :** Done

---

### US-034 : Compatibilité Boîtier / Format carte mère
**En tant qu'**utilisateur **je veux** que la compatibilité boîtier/format carte mère soit vérifiée **afin d'**éviter une carte mère qui ne rentre pas.

**Critères d'acceptation :**
- [ ] CA1 : Carte mère ATX → seuls les boîtiers supportant ATX
- [ ] CA2 : Boîtier mATX → seules les cartes mères mATX et Mini-ITX
- [ ] CA3 : Raison du filtre affichée (ex. « format ATX requis »)
- [ ] CA4 : Filtre bidirectionnel

**DoD spécifique :** testé ATX / mATX / Mini-ITX ; **tests unitaires** sur la logique de form factor.

**Points :** 3 | **Priorité :** Haute | **Sprint :** 3 | **Statut :** Done

---

### US-035 : Compatibilité Stockage / Connectique carte mère
**En tant qu'**utilisateur **je veux** que la compatibilité stockage/carte mère soit vérifiée **afin de** m'assurer que mes disques sont supportés.

**Critères d'acceptation :**
- [ ] CA1 : SSD M.2 NVMe → seules les cartes mères avec slot M.2 dispo
- [ ] CA2 : Disque SATA → seules les cartes mères avec ports SATA
- [ ] CA3 : Raison du filtre affichée
- [ ] CA4 : Filtre bidirectionnel

**DoD spécifique :** testé avec SSD NVMe et HDD SATA ; **tests unitaires** sur la logique.

**Points :** 3 | **Priorité :** Haute | **Sprint :** 3 | **Statut :** Done

---

### US-038 : Récapitulatif de configuration
**En tant qu'**utilisateur **je veux** un récapitulatif de tous mes composants **afin d'**avoir une vue d'ensemble.

**Critères d'acceptation :**
- [ ] CA1 : Panneau listant chaque catégorie + composant (ou « Non sélectionné »)
- [ ] CA2 : Suppression possible par ligne
- [ ] CA3 : Bouton « Réinitialiser » pour vider la configuration
- [ ] CA4 : Récapitulatif visible en permanence (sidebar/section dédiée)
- [ ] CA5 : Mise à jour en temps réel

**DoD spécifique :** testé avec configuration complète et partielle.

**Points :** 2 | **Priorité :** Critique | **Sprint :** 1 | **Statut :** Done

---

### US-039 : Prix total de la configuration
**En tant qu'**utilisateur **je veux** voir le prix total de ma configuration **afin de** connaître le coût des composants.

**Critères d'acceptation :**
- [ ] CA1 : Prix total affiché dans le récapitulatif
- [ ] CA2 : Somme des prix unitaires des composants sélectionnés
- [ ] CA3 : Composant sans prix non comptabilisé + mention « prix non disponible »
- [ ] CA4 : Format en euros (« 1 249,99 € »)
- [ ] CA5 : Mise à jour en temps réel

**DoD spécifique :** **dépend de US-079** (prix en BDD) ; testé avec configs complètes et partielles. *Statut Tech ready : UI prête, données prix absentes (credentials API).*

**Points :** 2 | **Priorité :** Haute | **Sprint :** 5 | **Statut :** Tech ready

---

### US-041 : Sauvegarde de configuration
**En tant qu'**utilisateur connecté **je veux** sauvegarder ma configuration **afin de** la retrouver à ma prochaine visite.

**Critères d'acceptation :**
- [ ] CA1 : Bouton « Sauvegarder ma configuration » dans le configurateur
- [ ] CA2 : Ouvre un modal demandant un nom
- [ ] CA3 : Configuration sauvegardée en base, liée au compte
- [ ] CA4 : Toast de confirmation après sauvegarde
- [ ] CA5 : Si non connecté, invitation à se connecter
- [ ] CA6 : Jusqu'à 10 configurations par utilisateur

**DoD spécifique :** **migration Supabase** `saved_configurations` créée ; testé connecté et non connecté ; dépend de US-084 (toast).

**Points :** 5 | **Priorité :** Haute | **Sprint :** 5 (livré mai 2026) | **Statut :** Done

---

## Activité 4 — Passer commande

### US-047 : Ajout de la configuration au panier
**En tant qu'**utilisateur **je veux** ajouter ma configuration au panier **afin de** procéder à la commande.

**Critères d'acceptation :**
- [ ] CA1 : Bouton « Ajouter au panier » dans le récapitulatif
- [ ] CA2 : Actif seulement si ≥ 1 composant sélectionné
- [ ] CA3 : Après ajout, notification (toast) de confirmation
- [ ] CA4 : Badge panier dans le header mis à jour
- [ ] CA5 : Si non connecté, invitation à se connecter

**DoD spécifique :** **store Zustand panier** avec persistance localStorage ; badge header fonctionnel.

**Points :** 5 | **Priorité :** Haute | **Sprint :** 6 | **Statut :** Done

---

### US-048 : Page panier
**En tant qu'**utilisateur **je veux** voir le contenu de mon panier **afin de** vérifier ma commande avant de continuer.

**Critères d'acceptation :**
- [ ] CA1 : Liste des configurations avec composants, catégorie, prix
- [ ] CA2 : Sous-total, frais estimés et total affichés
- [ ] CA3 : Suppression possible par article
- [ ] CA4 : Bouton « Continuer mes achats » → configurateur
- [ ] CA5 : Bouton « Passer commande » → tunnel (si connecté)
- [ ] CA6 : Si panier vide, message + lien vers le configurateur

**DoD spécifique :** testé avec panier vide et rempli.

**Points :** 3 | **Priorité :** Haute | **Sprint :** 6 | **Statut :** Done

---

### US-054 : Paiement par carte bancaire via Stripe
**En tant qu'**utilisateur **je veux** payer par carte de façon sécurisée **afin de** finaliser mon achat.

**Critères d'acceptation :**
- [ ] CA1 : Formulaire Stripe intégré (Payment Element)
- [ ] CA2 : Paiement sécurisé (PCI-DSS via Stripe)
- [ ] CA3 : Cartes principales acceptées (Visa, Mastercard, Amex)
- [ ] CA4 : Message clair si paiement refusé
- [ ] CA5 : En cas de succès, commande créée + page de confirmation
- [ ] CA6 : Email de confirmation automatique (US-055)
- [ ] CA7 : Mode test Stripe fonctionnel

**DoD spécifique :** intégration testée en sandbox ; **webhook Stripe** configuré ; **migration `orders`** ; **aucune donnée de carte stockée** côté serveur. *Remplacé provisoirement par le workflow de devis (US-088 à US-091).*

**Notes techniques :** Edge Function Supabase pour créer le Payment Intent (clés secrètes jamais exposées côté client).

**Points :** 8 | **Priorité :** Haute | **Sprint :** 7 | **Statut :** À faire

---

### US-055 : Email de confirmation de commande
**En tant qu'**utilisateur ayant commandé **je veux** recevoir un email de confirmation **afin d'**avoir la preuve de mon achat.

**Critères d'acceptation :**
- [ ] CA1 : Email envoyé automatiquement après confirmation du paiement
- [ ] CA2 : Contient n° de commande, composants, prix total, adresse
- [ ] CA3 : Envoyé à l'adresse du compte
- [ ] CA4 : Formaté en HTML
- [ ] CA5 : Expédié depuis une adresse no-reply

**DoD spécifique :** template email validé ; envoi déclenché par le webhook Stripe ; testé en sandbox (email réellement reçu). *Voir US-091 (email de devis) déjà livré.*

**Points :** 3 | **Priorité :** Haute | **Sprint :** 7 | **Statut :** À faire

---

### US-088 : Demande de devis à partir du panier *(workflow ajouté en juin 2026)*
**En tant qu'**utilisateur **je veux** demander un devis à partir de mon panier **afin de** lancer ma commande sans paiement immédiat.

**Critères d'acceptation :**
- [ ] CA1 : Depuis le panier, un bouton crée une commande au statut `pending` (en attente de devis)
- [ ] CA2 : L'utilisateur choisit/saisit une adresse de livraison (US-051/052)
- [ ] CA3 : Un devis estimatif est généré et téléchargeable
- [ ] CA4 : Une confirmation « Demande enregistrée » est affichée

**DoD spécifique :** **migration `orders`** avec statut et items ; commande visible côté client et admin.

**Points :** 3 | **Priorité :** Haute | **Sprint :** Juin 2026 | **Statut :** Done

---

### US-089 : Finalisation du devis par l'administrateur *(enabler métier)*
**En tant qu'**administrateur **je veux** compléter le devis avec le vendeur et le prix réel de chaque composant **afin d'**envoyer un devis ferme au client.

**Critères d'acceptation :**
- [ ] CA1 : Depuis le détail d'une commande `pending`, une popin permet de saisir vendeur + prix réel par composant
- [ ] CA2 : Le total se recalcule en direct (composants + assemblage)
- [ ] CA3 : L'envoi passe la commande au statut `quote_sent` et notifie le client
- [ ] CA4 : Un devis déjà envoyé peut être modifié / renvoyé

**DoD spécifique :** RPC Postgres `admin_finalize_order` en **SECURITY DEFINER** (vérifie le rôle admin) ; colonnes `final_items` / `final_total` ; statut visible dans la liste admin.

**Points :** 5 | **Priorité :** Haute | **Sprint :** Juin 2026 | **Statut :** Done

---

### US-090 : Acceptation ou refus du devis par le client *(workflow ajouté en juin 2026)*
**En tant qu'**utilisateur **je veux** accepter ou refuser le devis final reçu **afin de** valider ou annuler ma commande.

**Critères d'acceptation :**
- [ ] CA1 : Une commande `quote_sent` affiche le devis final + total et deux actions (Accepter / Refuser)
- [ ] CA2 : Accepter passe la commande au statut `accepted` ; refuser au statut `refused`
- [ ] CA3 : L'état est reflété immédiatement côté client et admin
- [ ] CA4 : Une commande acceptée entre dans le suivi (assemblage → expédiée → livrée)

**DoD spécifique :** RPC `respond_quote` (RLS `auth.uid() = user_id`) ; barre de progression de suivi côté client.

**Points :** 3 | **Priorité :** Haute | **Sprint :** Juin 2026 | **Statut :** Done

---

### US-091 : Email automatique d'envoi du devis *(technical story)*
**En tant que** système **je veux** envoyer automatiquement le devis au client **afin de** le notifier sans action manuelle.

**Critères d'acceptation :**
- [ ] CA1 : À la finalisation (US-089), un email est envoyé au client
- [ ] CA2 : L'email distingue devis **estimatif** et devis **final** (objet et contenu)
- [ ] CA3 : Le devis est joint ou résumé dans l'email

**DoD spécifique :** **Edge Function Supabase** `send-devis` (Deno) déployée ; envoi via Resend ; *en mode test Resend, la livraison réelle est limitée à une adresse vérifiée — un domaine vérifié est requis pour la production.*

**Points :** 3 | **Priorité :** Haute | **Sprint :** Juin 2026 | **Statut :** Done

---

## Activité 5 — Gérer son compte

### US-061 : Page de profil utilisateur
**En tant qu'**utilisateur connecté **je veux** accéder à ma page de profil **afin de** voir et modifier mes informations.

**Critères d'acceptation :**
- [ ] CA1 : /profile affiche prénom, nom, pseudo, email, téléphone
- [ ] CA2 : Page protégée (redirige vers /signin si non connecté)
- [ ] CA3 : Formulaire d'édition (US-062)
- [ ] CA4 : Date d'inscription en lecture seule
- [ ] CA5 : Liens vers Mes configurations et Mes commandes

**DoD spécifique :** remplace l'ancien placeholder de route ; page `Profile.tsx` créée.

**Points :** 3 | **Priorité :** Haute | **Sprint :** 5 | **Statut :** Done

---

### US-062 : Modification des informations personnelles
**En tant qu'**utilisateur connecté **je veux** modifier mon prénom, nom et téléphone **afin de** garder mes informations à jour.

**Critères d'acceptation :**
- [ ] CA1 : Champs prénom, nom, téléphone éditables
- [ ] CA2 : Téléphone validé (format FR/international)
- [ ] CA3 : Bouton « Enregistrer »
- [ ] CA4 : Toast de succès
- [ ] CA5 : Message en cas d'erreur serveur
- [ ] CA6 : Email non modifiable directement

**DoD spécifique :** `updateProfile` fonctionnel ; données mises à jour dans `profiles`.

**Points :** 2 | **Priorité :** Haute | **Sprint :** 5 | **Statut :** Done

---

### US-066 : Carnet d'adresses de livraison
**En tant qu'**utilisateur connecté **je veux** enregistrer plusieurs adresses de livraison sur mon profil **afin de** les réutiliser lors de mes commandes.

**Critères d'acceptation :**
- [ ] CA1 : Le profil liste les adresses enregistrées (libellé, destinataire, adresse, CP, ville, téléphone)
- [ ] CA2 : Ajout / modification / suppression d'une adresse (popin)
- [ ] CA3 : La première adresse créée devient l'adresse par défaut (US-067)
- [ ] CA4 : Au checkout, si des adresses existent, l'utilisateur en choisit une (style Amazon) ; sinon, il en crée une

**DoD spécifique :** **migration `addresses`** + RLS par utilisateur ; contrainte d'unicité partielle sur l'adresse par défaut.

**Points :** 3 | **Priorité :** Haute | **Sprint :** 6 | **Statut :** Done

---

## Activité 6 — [Admin] Gérer la plateforme

### US-069 : Dashboard admin
**En tant qu'**administrateur **je veux** un tableau de bord avec les stats clés **afin de** suivre l'activité d'un coup d'œil.

**Critères d'acceptation :**
- [ ] CA1 : Nombre total d'utilisateurs
- [ ] CA2 : Nombre total de produits
- [ ] CA3 : Nombre de commandes (quand disponible)
- [ ] CA4 : Stats chargées depuis Supabase (pas de données hardcodées)
- [ ] CA5 : État de chargement pendant la récupération
- [ ] CA6 : Accès restreint au rôle « admin »

**DoD spécifique :** `ProtectedRoute requiredRole="admin"` en place ; testé avec compte admin et compte user.

**Points :** 5 | **Priorité :** Critique | **Sprint :** 1 | **Statut :** Done

---

### US-076 : Modification d'un produit existant
**En tant qu'**administrateur **je veux** modifier les infos et specs d'un produit **afin de** maintenir le catalogue à jour.

**Critères d'acceptation :**
- [ ] CA1 : Bouton « Modifier » par ligne → formulaire d'édition
- [ ] CA2 : Édition des infos générales (nom, fabricant, série, année)
- [ ] CA3 : Édition de toutes les specs selon la catégorie
- [ ] CA4 : Specs typées correctement (texte, nombre, booléen, tableau, JSONB)
- [ ] CA5 : Sauvegarde dans la table produits + table specs
- [ ] CA6 : Toast de confirmation

**DoD spécifique :** testé sur toutes les catégories ; mise à jour réelle en base vérifiée.

**Points :** 5 | **Priorité :** Critique | **Sprint :** 1 | **Statut :** Done

---

### US-078 : Création d'un nouveau produit depuis l'admin
**En tant qu'**administrateur **je veux** créer un produit depuis l'admin **afin d'**enrichir le catalogue sans script.

**Critères d'acceptation :**
- [ ] CA1 : Bouton « Nouveau produit » sur la page admin Produits
- [ ] CA2 : Formulaire avec catégorie, nom, fabricant, série, année, image URL
- [ ] CA3 : Champs de specs affichés dynamiquement selon la catégorie
- [ ] CA4 : Produit créé dans `products` + specs dans la table dédiée
- [ ] CA5 : Toast de confirmation
- [ ] CA6 : Liste rafraîchie automatiquement

**DoD spécifique :** testé sur ≥ 3 catégories ; données créées vérifiées ; aucune régression sur l'édition.

**Points :** 5 | **Priorité :** Haute | **Sprint :** 4 | **Statut :** Done

---

### US-079 : Gestion des prix des produits
**En tant qu'**administrateur **je veux** définir et modifier le prix d'un produit **afin que** les utilisateurs voient les tarifs réels.

**Critères d'acceptation :**
- [ ] CA1 : Champ « Prix (€) » au formulaire d'édition
- [ ] CA2 : Champ prix aussi présent à la création (US-078)
- [ ] CA3 : Prix stocké en centimes (entier) pour éviter les flottants
- [ ] CA4 : Prix nullable (produit sans prix affiché)
- [ ] CA5 : Format « 1 249,99 € » au configurateur et au back-office

**DoD spécifique :** **migration** ajoutant la colonne prix ; testé avec et sans centimes.

**Points :** 3 | **Priorité :** Haute | **Sprint :** 4 | **Statut :** Done

---

### US-081 : Liste et détail des commandes (admin)
**En tant qu'**administrateur **je veux** voir toutes les commandes avec leur statut et leur détail **afin de** suivre l'activité et préparer l'assemblage.

**Critères d'acceptation :**
- [ ] CA1 : Liste de toutes les commandes (date, client, total, statut)
- [ ] CA2 : Dépli du détail (composants, prix, adresse)
- [ ] CA3 : Mise à jour du statut (US-082)
- [ ] CA4 : Statut toujours visible (badge) ; suivi `accepted → assemblage → expédiée → livrée`

**DoD spécifique :** RPC `admin_list_orders` / `admin_update_order_status` en SECURITY DEFINER (rôle admin vérifié).

**Points :** 3 (+ US-082, US-083) | **Priorité :** Haute | **Sprint :** 7 | **Statut :** Done

---

## Transverse — Qualité et infrastructure (technical / enabler stories)

> Ces stories ont une valeur surtout **technique**. Conformément à la convention, elles conservent une **DoD spécifique détaillée**.

### US-084 : Notifications toast globales
**En tant qu'**utilisateur **je veux** des toasts pour les actions importantes **afin d'**être informé sans bloquer mon flux.

**Critères d'acceptation :**
- [ ] CA1 : Composant Toast disponible globalement
- [ ] CA2 : Types success / error / info / warning
- [ ] CA3 : Affichage en haut à droite, disparition après 4 s
- [ ] CA4 : Fermeture manuelle possible
- [ ] CA5 : Empilement de plusieurs toasts
- [ ] CA6 : Utilisés après les actions clés (connexion, sauvegarde, erreur…)

**DoD spécifique :**
- [ ] Composant Toast intégré au design system
- [ ] Store global (Zustand/Context) de gestion des toasts
- [ ] Intégré aux actions critiques existantes (auth, save, admin)
- [ ] Accessible (`role="alert"`)

**Points :** 3 | **Priorité :** Haute | **Sprint :** 2 | **Statut :** Done

---

### US-086 : Tests unitaires sur les utils et services critiques
**En tant que** développeur **je veux** une couverture de tests unitaires sur les fonctions critiques **afin d'**éviter les régressions.

**Critères d'acceptation :**
- [ ] CA1 : Configuration Vitest en place
- [ ] CA2 : Fonctions de `compatibility.ts` couvertes
- [ ] CA3 : Fonctions de `authService` testées (mock Supabase)
- [ ] CA4 : Couverture ≥ 60 % sur utils et services
- [ ] CA5 : Tests verts dans la CI (GitHub Actions)

**DoD spécifique :**
- [ ] Vitest + Testing Library configurés
- [ ] ≥ 15 tests unitaires écrits (27 livrés)
- [ ] CI verte sur toutes les PR
- [ ] README mis à jour avec les instructions de test

**Points :** 8 | **Priorité :** Haute | **Sprint :** 3 | **Statut :** Done

---

### US-087 : Tests d'intégration sur les flux critiques
**En tant que** développeur **je veux** des tests d'intégration sur les parcours critiques (auth, config, commande) **afin de** sécuriser les évolutions.

**Critères d'acceptation :**
- [ ] CA1 : Parcours d'authentification couvert
- [ ] CA2 : Parcours de configuration couvert
- [ ] CA3 : Parcours admin couvert
- [ ] CA4 : Tests verts dans la CI

**DoD spécifique :**
- [ ] ≥ 15 tests d'intégration écrits (livrés)
- [ ] Exécutés dans la CI à chaque PR
- [ ] Mocks Supabase isolant les tests du réseau

**Points :** 13 | **Priorité :** Haute | **Sprint :** 4 | **Statut :** Done
