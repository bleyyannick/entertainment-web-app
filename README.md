# Entertainment Web App

Projet issu du challenge [Frontend Mentor — Entertainment Web App](https://www.frontendmentor.io/challenges/entertainment-web-app-J-UhgAW1X), utilisé comme terrain d'expérimentation pour le **développement assisté par IA** (GitHub Copilot) en appliquant de bonnes pratiques de développement front-end.

## Objectifs du projet

- Explorer le pair-programming avec un assistant IA (GitHub Copilot) sur un projet React concret.
- Mettre en pratique des bonnes pratiques : architecture en couches (components/hooks/services/types), typage strict TypeScript, composants atomiques, commits Conventional Commits, etc.
- Consommer une API externe ([OMDb API](https://www.omdbapi.com/)) via un proxy backend sécurisé.

## Structure du dépôt

```
entertainement-web-app/
├── frontend/   # Application React + Vite
├── backend/    # Proxy Express + TypeScript (appels OMDb sécurisés)
└── README.md
```

## Stack technique

| Outil | Rôle |
|---|---|
| React 19 + TypeScript | UI & typage statique |
| Vite | Build & dev server |
| Tailwind CSS v4 | Styles utilitaires |
| TanStack Query v5 | Data fetching & cache |
| Lucide React | Icônes |
| React Compiler | Optimisation automatique des re-renders |
| Express + TypeScript | Proxy backend (Node.js) |

## Architecture des composants

```
frontend/src/components/
├── Content.tsx    # Orchestrateur : data-fetching + rendu conditionnel
├── layout/        # Navbar, NavButton, NavAvatar
├── media/         # MediaGrid, MovieCard
└── ui/            # SearchBar, EmptyState, ContentLoader, ContentError
```

## Décisions techniques

### Proxy backend
La clé API OMDb réside exclusivement côté serveur dans le backend Express. Le frontend n'envoie plus la clé dans ses requêtes : il interroge uniquement le proxy (`/api/search`), qui est le seul à communiquer avec OMDb — la clé n'est jamais exposée dans le bundle JavaScript.

L'endpoint unique `GET /api/search?q=...&type=movie|series` centralise toute la logique d'accès à l'API externe et valide les paramètres en entrée.

### React Compiler
Le React Compiler (stable depuis la v1.0 de `babel-plugin-react-compiler`) est activé via Babel. L'objectif est de se familiariser avec les prochaines versions de React qui l'intègreront nativement. Il analyse le code à la compilation et insère automatiquement la mémoïsation là où elle est nécessaire — sans avoir à écrire manuellement `useMemo` ou `useCallback`.

### Cache TanStack Query
Chaque requête est mise en cache avec un `staleTime` de 5 minutes et un `gcTime` de 10 minutes. Cela évite les appels HTTP redondants lors de la navigation entre sections ou d'une recherche identique, ce qui améliore les performances réseau et offre une expérience utilisateur plus fluide.

### Couche service (`mediaService.ts`)
La logique de récupération des données est isolée dans un service dédié. Les composants se concentrent uniquement sur le rendu, ce qui rend le code plus lisible, plus maintenable et plus facilement testable unitairement.

## Démarrage

### Prérequis

- Node.js ≥ 18
- Une clé API OMDb ([gratuite ici](https://www.omdbapi.com/apikey.aspx))

### Installation

```bash
cd frontend && npm install
cd ../backend && npm install
```

### Variables d'environnement

**Backend** — créer `backend/.env` :
```env
OMDB_API_KEY=votre_clé_api
PORT=3001
FRONTEND_URL=http://localhost:5173
```

**Frontend** — `frontend/.env.development` est déjà configuré pour pointer vers `http://localhost:3001`.

### Lancer en développement

Dans deux terminaux séparés :

```bash
# Terminal 1 — backend
cd backend && npm run dev

# Terminal 2 — frontend
cd frontend && npm run dev
```

Le frontend est disponible sur [http://localhost:5173](http://localhost:5173).

### Build de production

```bash
cd frontend && npm run build
cd frontend && npm run preview   # prévisualiser le build localement
```

### Lint

```bash
cd frontend && npm run lint
```

## Points d'amélioration connus

### Architecture du backend (SOLID)
Le proxy Express fonctionne mais peut être renforcé en appliquant les principes SOLID : séparation claire des responsabilités entre le routeur, la logique métier et l'accès à l'API externe, injection de dépendances pour faciliter les tests unitaires du service OMDb, etc.

### Tests
Le projet ne dispose pas encore de tests automatisés. La couche service (`omdbService.ts` côté backend) étant découplée du reste, elle constitue un point d'entrée naturel pour des **tests unitaires** (normalisation des données OMDb, gestion des cas limites). Les composants UI pourraient être couverts par des **tests de rendu** avec Vitest + React Testing Library.

## Déploiement

| Service | Hébergeur | URL |
|---|---|---|
| Frontend (statique) | GitHub Pages | [bleyyannick.github.io/entertainment-web-app](https://bleyyannick.github.io/entertainment-web-app/) |
| Backend (proxy Node.js) | Railway | `https://entertainment-web-app-production-9f90.up.railway.app` |

Le déploiement du frontend est automatisé via GitHub Actions (`.github/workflows/deploy.yml`) : tout push sur `main` ou `deployment` déclenche un build puis un déploiement sur GitHub Pages. La variable `BASE_PATH` est injectée automatiquement par le workflow pour que Vite génère les bons chemins d'assets.

`frontend/.env.production` contient l'URL du backend Railway — aucune configuration supplémentaire n'est nécessaire pour un build de production.
