# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack movie/TV series catalog app that proxies the OMDb API. The frontend is a React SPA deployed to GitHub Pages; the backend is an Express proxy deployed to Railway that keeps the OMDb API key server-side only.

- Live frontend: https://bleyyannick.github.io/entertainment-web-app/
- Backend (Railway): https://entertainment-web-app-production-9f90.up.railway.app
- Coverage report: https://bleyyannick.github.io/entertainment-web-app/coverage/

## Repository Structure

```
frontend/   React + Vite + Tailwind + TanStack Query
backend/    Express + TypeScript + Zod
scripts/ci/ Coverage summary scripts for CI
```

## Commands

### Frontend (`cd frontend`)

```bash
npm run dev              # Dev server on :5173
npm run build            # tsc then vite build
npm run lint             # ESLint
npm run test             # All tests once
npm run test:unit        # Unit tests only
npm run test:integration # Integration tests only
npm run test:watch       # Watch mode
npm run test:unit:ci     # Unit tests + JUnit XML + coverage (for CI)
```

### Backend (`cd backend`)

```bash
npm run dev              # Watch mode via tsx, port 3001
npm run build            # tsc compile
npm run start            # Run compiled output
npm run test             # All tests once
npm run test:unit        # Unit tests only
npm run test:integration # Integration tests only
npm run test:watch       # Watch mode
npm run test:unit:ci     # Unit tests + JUnit XML + coverage (for CI)
```

### Running a single test file

```bash
# Vitest accepts file paths as positional args
npx vitest run src/tests/unit/someFile.test.ts
```

## Architecture

### Data flow

```
SearchBar / SortButton / YearSelect
  → useFilter (global: query + section) / useDateFilter (local: year + sort)
  → useMedia (TanStack Query, 5 min stale / 10 min GC)
  → mediaService.ts (fetch + Zod validation)
  → GET /api/search (backend)
  → omdbService.ts (fetch OMDb, normalize to Media shape)
  → OMDb external API
```

### Frontend layers

| Layer | Location | Responsibility |
|---|---|---|
| Components | `src/components/layout/`, `media/`, `ui/` | Rendering only |
| Hooks | `src/hooks/` | State (`useFilter`, `useDateFilter`), fetching (`useMedia`), util (`useDebounce`) |
| Service | `src/services/mediaService.ts` | API client, response parsing with Zod |
| Types | `src/types/` | Zod schemas; TypeScript types via `z.infer<>` |

### Backend layers

| Layer | Location | Responsibility |
|---|---|---|
| App factory | `src/index.ts` | CORS, route wiring, parameter validation |
| OMDb service | `src/services/omdbService.ts` | Fetch, Zod-validate, normalize to `Media` |
| Types | `src/types.ts` | Zod schemas for OMDb response and `Media` |

TypeScript types are always derived from Zod schemas (`z.infer<typeof schema>`), never declared separately.

### Testing conventions

Tests are in `src/tests/` within each workspace, split into `unit/` and `integration/`. A `factories/` directory provides typed test-data builders (`createMedia`, `createOmdbSearchResult`, etc.) — use these instead of inline object literals.

- **Backend integration tests** use `supertest` against the real Express app (with `fetch` mocked).
- **Frontend integration tests** mount full component trees and assert on rendered output / user interactions.
- Tests validate behavior (what the user sees / API returns), not implementation details.

## Environment Variables

### Backend

```
OMDB_API_KEY=   # Required — OMDb API key (never exposed to frontend)
PORT=3001
FRONTEND_URL=   # Allowed CORS origin
```

### Frontend

`VITE_API_URL` is set per environment:
- `frontend/.env.development` → `http://localhost:3001`
- `frontend/.env.production` → Railway backend URL

## CI Pipeline (`.github/workflows/deploy.yml`)

Jobs run in sequence: **lint → test-frontend → test-backend → build → deploy**

- Tests must pass before the build runs.
- Coverage reports (HTML, LCOV, JSON) are uploaded as artifacts and published to GitHub Pages under `/coverage/`.
- Frontend static output is deployed to GitHub Pages on every push to `main`.
