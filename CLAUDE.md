# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Package manager:** Bun (required). All commands use `bun`.

```bash
# Install dependencies (from root)
bun install

# Run both api and app in dev mode (via Turborepo)
bun dev

# Run api only
cd api && bun dev          # bun --watch src/main.ts (hot-reload)

# Run app only
cd app && bun dev          # Vite dev server on port 5173

# Build app
cd app && bun run build    # tsc --noEmit && vite build

# Database
cd api && bun run prisma:push      # Push schema to DB (no migration history)
cd api && bun run prisma:generate  # Regenerate Prisma client after schema change

# Lint (from root)
bun eslint .

# Infrastructure (PostgreSQL on 5432, Redis on 6379)
docker compose up -d
```

There are no test scripts configured yet.

## Architecture

This is a **Bun workspace monorepo** managed by Turborepo with two packages: `api` and `app`.

### API (`api/`) — Elysia + Prisma + PostgreSQL

- Entry: `api/src/main.ts` — creates the Elysia app with `/api` prefix, registers `transformResponse` (wraps all successful responses into `{ status, data, meta }` shape), and mounts controllers.
- **`api/src/core/`** — feature modules. Each module (e.g., `projects`) has a `controller.ts`, `service.ts`, and `types/` with Elysia/TypeBox schemas. The controller is an `Elysia` instance that is `.use()`d in `main.ts`. The `App` type exported from `main.ts` enables Eden treaty type-safety on the frontend.
- **`api/src/libs/`** — shared infrastructure: `prisma/` (singleton Prisma client using `@prisma/adapter-pg`) and `intercepters/` (`transformResponse` handler).
- **`api/prisma/schema.prisma`** — Postgres datasource. After editing it, run `prisma:generate` then `prisma:push`.
- Path alias: `@/*` → `api/src/*`.

### App (`app/`) — React 19 + Vite + Ant Design + Zustand

**Entry:** `app/src/main.tsx` → `App.tsx` composes three providers: `ThemeProvider` (Ant Design theme) → `MessageApiProvider` → `Routes`.

**`Routes` provider (`app/src/providers/Routes/`):**  
Reads `routes` from `app/src/routes.tsx`, normalizes them (permission filtering, default `handle` values), then creates a `BrowserRouter` with a root route whose `element` is `LayoutProvider`. Route `handle` metadata drives layout type and sidebar menu config.

**Route definition shape** (`IRouteType`):
```ts
handle?: {
  menu?: { label, iconName, position }  // iconName is a Lucide icon key
  layout?: 'DEFAULT' | 'BLANK' | 'CENTERED' | 'BASIC'
  auth?: boolean
  permissions?: PERMISSION[]
}
```

**Global state (`useGlobal`):**  
Zustand store (persisted to localStorage). Holds `apiBaseUrl`, `token`, `user`, `permissions`, and `collapsed` (sidebar). The `apiBaseUrl` defaults to `VITE_API_BASE_URL` env + `/api/v1`.

**End-to-end type safety (Eden Treaty):**  
The API exports `type App = typeof app` from `api/src/main.ts`. The frontend creates an Eden Treaty client in `app/src/libs/api.ts` typed against `App`. Every route's request/response types are inferred automatically — the frontend defines **no manual types** for API data shapes.

The `ok()` helper in `api/src/libs/response.ts` wraps every handler's return value into the standard envelope:
```ts
{ status: 200, data: T, meta: { message: string } }
```
Because handlers explicitly return `ok(data)`, Eden sees the full wrapper type and infers it end-to-end.

**`useApi` hook (`app/src/hooks/useApi/`):**  
Wraps any Eden Treaty call with React loading/data/error state. Types are fully inferred via `InferData<TFn>` — the hook unwraps the `{ data }` envelope so consumers get the actual payload. Provides loading toasts, success/error messages (Ant Design), and race-condition prevention (request IDs).

Services in `app/src/services/` are thin wrappers with zero manual type annotations:
```ts
export const useGetProjects = (options?) => useApi(api.api.projects.get, options);
export const useCreateProject = (options?) => useApi(api.api.projects.post, { success: { message: 'default' }, ...options });
```

**`useHttp` hook (`app/src/hooks/useHttp/`):**  
Legacy axios-based hook — kept for backward compatibility. New code should use `useApi`.

**Path aliases (app):**
- `@/*` → `app/src/*`
- `@api/*` → `api/src/*`

### Infrastructure

- **Database:** PostgreSQL 13.5 via Docker Compose. Connection string via `DATABASE_URL` env var.
- **Redis** is in docker-compose but not yet wired into the application.
- **`api/prisma.config.ts`** configures the Prisma CLI (schema path, datasource URL from env, seed script via `tsx prisma/seed.ts`).
- The `Dockerfile` and commented-out `nest_api` service in docker-compose are for production deployment of the API.
