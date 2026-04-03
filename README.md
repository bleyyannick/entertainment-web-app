# Entertainment Web App

Projet issu du challenge [Frontend Mentor — Entertainment Web App](https://www.frontendmentor.io/challenges/entertainment-web-app-J-UhgAW1X), utilisé comme terrain d'expérimentation pour le **développement assisté par IA** (GitHub Copilot) en appliquant de bonnes pratiques de développement front-end.

## Objectifs du projet

- Explorer le pair-programming avec un assistant IA (GitHub Copilot) sur un projet React concret.
- Mettre en pratique des bonnes pratiques : architecture en feature folders, typage strict TypeScript, composants atomiques, commits Conventional Commits, etc.
- Consommer une API externe ([OMDb API](https://www.omdbapi.com/)) en gérant les états de chargement et d'erreur.

## Stack technique

| Outil | Rôle |
|---|---|
| React 19 + TypeScript | UI & typage statique |
| Vite | Build & dev server |
| Tailwind CSS v4 | Styles utilitaires |
| TanStack Query v5 | Data fetching & cache |
| Lucide React | Icônes |
| React Compiler | Optimisation automatique des re-renders |

## Architecture des composants

```
src/components/
├── layout/     # Navbar, NavButton, NavAvatar
├── media/      # MediaGrid, MovieCard
└── ui/         # SearchBar, EmptyState, ContentLoader, ContentError
```

## Décisions techniques

### React Compiler
Le React Compiler (expérimental) est activé via Babel. L'objectif est de se familiariser avec les prochaines versions de React qui l'intègreront nativement. Il analyse le code à la compilation et insère automatiquement la mémoïsation là où elle est nécessaire — sans avoir à écrire manuellement `useMemo` ou `useCallback`.

### Cache TanStack Query
Chaque requête OMDb est mise en cache avec un `staleTime` de 5 minutes et un `gcTime` de 10 minutes. Cela évite les appels HTTP redondants lors de la navigation entre sections ou d'une recherche identique, ce qui améliore les performances réseau et offre une expérience utilisateur plus fluide (pas de rechargement inutile).

### Couche service (`mediaService.ts`)
La logique de récupération et de normalisation des données est isolée dans un service dédié. Les composants se concentrent uniquement sur le rendu, ce qui rend le code plus lisible, plus maintenable et plus facilement testable unitairement.

## Démarrage

### Prérequis

- Node.js ≥ 18
- Une clé API OMDb ([gratuite ici](https://www.omdbapi.com/apikey.aspx))

### Installation

```bash
npm install
```

### Variables d'environnement

Créer un fichier `.env` à la racine :

```env
VITE_OMDB_API_KEY=votre_clé_api
```

### Lancer en développement

```bash
npm run dev
```

L'application est disponible sur [http://localhost:5173](http://localhost:5173).

### Build de production

```bash
npm run build
npm run preview   # pour prévisualiser le build localement
```

### Lint

```bash
npm run lint
```

## Points d'amélioration connus

### Sécurisation de la clé API
Actuellement, la clé OMDb est injectée via une variable d'environnement Vite (`VITE_*`). Ces variables sont **embarquées dans le bundle JavaScript** lors du build et donc visibles dans les outils de développement du navigateur — une variable d'environnement côté client ne protège pas réellement une clé.

La solution envisagée est d'introduire un **proxy serveur** (ex. une Edge Function Netlify, un Worker Cloudflare, ou un endpoint Express) qui effectuerait les appels OMDb côté serveur. Le client n'enverrait plus la clé dans ses requêtes : il interrogerait uniquement le proxy, qui serait le seul à détenir le secret.

### Tests
Le projet ne dispose pas encore de tests automatisés. La couche service (`mediaService.ts`) étant découplée des composants, elle constitue un point d'entrée naturel pour des **tests unitaires** (normalisation des données OMDb, gestion des cas limites). Les composants UI pourraient quant à eux être couverts par des **tests de rendu** avec Vitest + React Testing Library.

## Déploiement

L'application est déployée sur GitHub Pages :
[https://bleyyannick.github.io/entertainment-web-app/](https://bleyyannick.github.io/entertainment-web-app/)
