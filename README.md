# PC Aeris

Application web développée avec React, TypeScript et Vite.

## Technologies

- React 19
- TypeScript
- Vite
- React Router
- SASS
- Phosphor Icons

## Installation

```bash
npm install
```

## Scripts

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

## Structure du projet

```
src/
├── assets/         # Images et fichiers statiques
├── components/     # Composants réutilisables
│   ├── common/     # Composants génériques (Button, Input, Form)
│   ├── layout/     # Composants de mise en page
│   └── ui/         # Composants d'interface
├── config/         # Configuration de l'application
├── constants/      # Constantes
├── context/        # Contextes React
├── hooks/          # Hooks personnalisés
├── pages/          # Pages de l'application
├── routes/         # Configuration des routes
├── services/       # Services et appels API
├── store/          # Gestion d'état
├── styles/         # Styles globaux SASS
├── types/          # Types TypeScript
└── utils/          # Fonctions utilitaires
```
