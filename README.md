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
| Zod v4 | Validation des schémas à l'exécution (frontend + backend) |

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

### Validation des données avec Zod
Les types `Media` (frontend) et `OmdbSearchResult` / `OmdbSearchResponse` (backend) ne sont plus de simples interfaces TypeScript : ils sont définis comme des **schémas Zod**, et les types TypeScript en sont **inférés** via `z.infer<>`. Cette approche garantit une cohérence totale entre la validation à l'exécution et le typage statique.

Chaque réponse API est validée au runtime au point d'entrée des données :
- côté **backend**, `omdbService.ts` utilise `safeParse` pour vérifier la réponse OMDb avant tout traitement ;
- côté **frontend**, `mediaService.ts` utilise `z.array(MediaSchema).parse(data)` pour valider la réponse du proxy.

Toute donnée malformée provoque immédiatement une erreur explicite, avant qu'elle ne se propage dans l'application.

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

### Tests

Les tests sont automatiquement exécutés dans la CI GitHub Actions à chaque push sur `main` ou `deployment`, avant le lint et le build — le déploiement est bloqué en cas d'échec.

Chaque couche dispose de sa propre suite Vitest :

```bash
# Backend
cd backend && npm run test          # exécution unique
cd backend && npm run test:watch    # mode watch

# Frontend
cd frontend && npm run test         # exécution unique
cd frontend && npm run test:watch   # mode watch
```

## Architecture des tests

```
backend/src/__tests__/
├── factories/
│   └── omdbFactory.ts         # createOmdbSearchResult, createOmdbSearchResponse
├── unit/
│   └── omdbService.test.ts    # searchOmdb — logique de normalisation OMDb
└── integration/               # réservé (tests HTTP à venir)

frontend/src/__tests__/
├── factories/
│   └── mediaFactory.ts        # createMedia
├── unit/
│   └── mediaService.test.ts   # fetchMovies, fetchSeries, fetchAll, fetchMedia
└── integration/               # réservé (tests composants à venir)
```

### Factories de test
Plutôt que de définir des fixtures statiques dans chaque fichier de test, les données de test sont générées via des **fonctions factory** (`createMedia`, `createOmdbSearchResult`, `createOmdbSearchResponse`). Chaque factory retourne un objet valide avec des valeurs par défaut réalistes, surchargeable par `overrides`. Ce pattern réduit la duplication, facilite la création de cas variés, et découple les tests de la structure exacte des types.

### Couverture actuelle

**Backend — `omdbService.ts`** (`searchOmdb`) :
- Lève une erreur si `OMDB_API_KEY` est absente de l'environnement
- Fonctionne avec une query vide ou renseignée
- Retourne `[]` si OMDb répond `Response: "False"`
- Lève une erreur si la requête réseau échoue
- Lève une erreur si la réponse OMDb ne respecte pas le schéma Zod attendu
- Normalise le type OMDb : `movie` → catégorie `"Movie"`, `series` → `"TV Series"`
- Remplace le poster `"N/A"` par une chaîne vide

**Frontend — `mediaService.ts`** (`fetchMovies`, `fetchSeries`, `fetchAll`, `fetchMedia`) :
- Retourne les médias renvoyés par le proxy backend
- Lève une erreur si la réponse réseau est en échec
- `fetchAll` retourne `[]` si la query est vide ou ne contient que des espaces
- `fetchMedia` délègue vers la bonne fonction selon la section active (`Movies`, `TV Series`, `Home`)

## Points d'amélioration connus

### Architecture du backend (SOLID)
Le proxy Express fonctionne mais peut être renforcé en appliquant les principes SOLID : séparation claire des responsabilités entre le routeur, la logique métier et l'accès à l'API externe, injection de dépendances pour faciliter les tests unitaires du service OMDb, etc.

### Tests
Les tests unitaires sont en place sur les deux couches service (frontend et backend). Les dossiers `integration/` sont réservés pour de futurs tests HTTP (backend) et tests de rendu composant (frontend, avec React Testing Library).

## Déploiement

| Service | Hébergeur | URL |
|---|---|---|
| Frontend (statique) | GitHub Pages | [bleyyannick.github.io/entertainment-web-app](https://bleyyannick.github.io/entertainment-web-app/) |
| Backend (proxy Node.js) | Railway | `https://entertainment-web-app-production-9f90.up.railway.app` |

Le déploiement du frontend est automatisé via GitHub Actions (`.github/workflows/deploy.yml`) : tout push sur `main` ou `deployment` déclenche un build puis un déploiement sur GitHub Pages. La variable `BASE_PATH` est injectée automatiquement par le workflow pour que Vite génère les bons chemins d'assets.

`frontend/.env.production` contient l'URL du backend Railway — aucune configuration supplémentaire n'est nécessaire pour un build de production.
