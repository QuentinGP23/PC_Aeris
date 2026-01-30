# PC Aeris

Configurateur de PC sur mesure - Application web développée avec React, TypeScript et Vite.

## 🚀 Technologies

- React 19
- TypeScript
- Vite
- React Router
- SASS
- Phosphor Icons

## 📦 Installation

```bash
npm install
```

## 🛠️ Scripts

```bash
# Lancer le serveur de développement
npm run dev

# Build pour la production
npm run build

# Prévisualiser le build
npm run preview

# Lancer le linter
npm run lint
```

## 🌿 Workflow Git

### Branches

| Branche   | Description               | Déploiement                                        |
| --------- | ------------------------- | -------------------------------------------------- |
| `main`    | Production stable         | [pc-aeris.vercel.app](https://pc-aeris.vercel.app) |
| `develop` | Pré-production / Staging  | Preview Vercel                                     |
| `feat/*`  | Nouvelles fonctionnalités | Preview Vercel                                     |
| `fix/*`   | Corrections de bugs       | Preview Vercel                                     |

### Processus de développement

```
1. Créer une branche depuis develop
   git checkout develop
   git pull origin develop
   git checkout -b feat/ma-feature

2. Développer et commiter
   git commit -m "feat: description"

3. Pousser et créer une PR vers develop
   git push origin feat/ma-feature
   → Créer PR: feat/ma-feature → develop

4. Après merge sur develop (preprod validée)
   → Créer PR: develop → main

5. Merge sur main = Release automatique + Production
```

### Conventional Commits

Les messages de commit suivent le format [Conventional Commits](https://www.conventionalcommits.org/) :

| Type        | Description             | Version               |
| ----------- | ----------------------- | --------------------- |
| `feat:`     | Nouvelle fonctionnalité | Minor (1.0.0 → 1.1.0) |
| `fix:`      | Correction de bug       | Patch (1.0.0 → 1.0.1) |
| `feat!:`    | Breaking change         | Major (1.0.0 → 2.0.0) |
| `docs:`     | Documentation           | -                     |
| `style:`    | Formatage               | -                     |
| `refactor:` | Refactoring             | -                     |
| `chore:`    | Maintenance             | -                     |

**Exemples :**

```bash
git commit -m "feat: ajout du composant Header"
git commit -m "fix: correction responsive mobile"
git commit -m "docs: mise à jour README"
```

### Protections des branches

- ❌ Push direct sur `main` et `develop` interdit
- ✅ Pull Request obligatoire
- ✅ CI (build + lint) doit passer
- ✅ Seule `develop` peut être mergée sur `main`

## 📁 Structure du projet

```
src/
├── assets/         # Images et fichiers statiques
├── components/     # Composants réutilisables
│   ├── common/     # Composants génériques (Button, Input, Form)
│   ├── layout/     # Composants de mise en page (Header, Footer)
│   └── ui/         # Composants d'interface
├── config/         # Configuration de l'application
├── constants/      # Constantes
├── context/        # Contextes React (Auth, Theme)
├── hooks/          # Hooks personnalisés
├── pages/          # Pages de l'application
├── services/       # Services et appels API
├── store/          # Gestion d'état (Zustand)
├── styles/         # Styles globaux SASS
├── types/          # Types TypeScript
└── utils/          # Fonctions utilitaires
```

## 🔄 CI/CD

- **GitHub Actions** : Lint et Build automatiques sur chaque PR
- **Release Please** : Versioning automatique basé sur les commits
- **Vercel** : Déploiement automatique (Preview + Production)

## 📋 Releases

Les releases sont générées automatiquement via [Release Please](https://github.com/googleapis/release-please) :

1. Les commits sur `main` créent une PR de release
2. Merger la PR crée un tag et une release GitHub
3. Le CHANGELOG est généré automatiquement
