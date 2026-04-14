# Entertainment Web App

Application web de catalogue de films et séries, permettant de rechercher, filtrer et parcourir des contenus via l'[API OMDb](https://www.omdbapi.com/). Le frontend React communique exclusivement avec un proxy backend Express qui centralise les appels à l'API externe et protège la clé API.

## Fonctionnalités

- Recherche en temps réel avec debounce
- Navigation par section : Accueil, Films, Séries
- Filtrage par année de sortie
- Tri par date (plus récent / plus ancien)
- Architecture en couches : composants, hooks, services, types

## Positionnement : qualité logicielle

Ce projet met volontairement l'accent sur la qualité logicielle comme critère différenciant.

- **Tests orientés comportement** : les scénarios valident des résultats fonctionnels (ce que l'utilisateur voit, ce que l'API renvoie), plutôt que des détails d'implémentation fragiles.
- **Validation des données au runtime** : les réponses externes sont validées avec Zod côté backend et frontend pour éviter la propagation de données invalides.
- **Séparation claire des responsabilités** : composants, hooks, services et types sont découplés pour faciliter l'évolution et la testabilité.
- **Chaîne d'intégration stricte** : analyse statique, tests puis compilation avant tout déploiement.

Objectif : démontrer une capacité à produire un code fiable, maintenable et vérifiable dans la durée.

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
└── ui/            # SearchBar, SortButton, YearSelect, EmptyState, ContentLoader, ContentError

frontend/src/hooks/
├── useFilter.ts      # Recherche textuelle et section active (état global App)
├── useDateFilter.ts  # Filtrage par année et ordre de tri (état local Content)
├── useMedia.ts       # Requête TanStack Query vers le backend
└── useDebounce.ts    # Debounce de la saisie utilisateur
```

## Décisions techniques

### Proxy backend
La clé API OMDb réside exclusivement côté serveur dans le backend Express. Le frontend n'envoie plus la clé dans ses requêtes : il interroge uniquement le proxy (`/api/search`), qui est le seul à communiquer avec OMDb — la clé n'est jamais exposée dans le bundle JavaScript.

L'endpoint unique `GET /api/search?q=...&type=movie|series&year=YYYY` centralise toute la logique d'accès à l'API externe et valide les paramètres en entrée. Le paramètre `year` est optionnel (entier entre 1888 et 2100) et est transmis à OMDb via le paramètre `y`.

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

### Filtrage et tri des médias
Les filtres sont séparés en deux hooks selon leur périmètre de responsabilité :

- **`useFilter`** (état global, dans `App`) — gère la recherche textuelle et la section active (Home / Movies / TV Series). Ces valeurs sont transmises en props à `Content`.
- **`useDateFilter`** (état local, dans `Content`) — encapsule le filtrage par année et l'ordre de tri (plus récent / plus ancien). `Content` l'appelle en interne et distribue les valeurs aux composants `YearSelect` et `SortButton`.

Ce découpage garantit que `Content` n'expose que 2 props (`query`, `activeSection`) tout en restant extensible : ajouter un nouveau critère de filtre ne nécessite que d'enrichir `useDateFilter` sans modifier l'interface de `Content`.

Le tri est appliqué côté client (sur les résultats déjà chargés), tandis que le filtre par année est transmis au backend pour que OMDb renvoie directement les résultats correspondants.

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

### Analyse statique du code (lint)

```bash
cd frontend && npm run lint
```

### Tests

La chaîne d'intégration GitHub Actions exécute automatiquement l'analyse statique du code, les tests frontend/backend, puis la compilation de production à chaque push sur `main` — le déploiement est bloqué en cas d'échec.

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

Le déploiement du frontend est automatisé via GitHub Actions (`.github/workflows/deploy.yml`) : tout push sur `main` déclenche la chaîne d'intégration (analyse statique, tests, compilation), puis un déploiement sur GitHub Pages. Le pipeline peut aussi être lancé manuellement depuis l'interface GitHub Actions. La variable `BASE_PATH` est injectée automatiquement pour que Vite génère les bons chemins d'assets.

`frontend/.env.production` contient l'URL du backend Railway — aucune configuration supplémentaire n'est nécessaire pour une compilation de production.
