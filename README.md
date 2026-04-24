# React + Elysia Starter

A full-stack monorepo starter built with **React 19**, **Elysia**, **Prisma**, and **Bun**.

## Tech Stack

- **Frontend:** React 19 + Vite + Ant Design + Zustand
- **Backend:** Elysia + Prisma + PostgreSQL
- **Monorepo:** Bun Workspaces + Turborepo
- **Type Safety:** End-to-end via Eden Treaty (zero manual type definitions)

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (v1.0+)
- [Docker](https://www.docker.com/) (for PostgreSQL)

### Setup

```bash
# 1. Clone and install
git clone <your-repo-url>
cd <your-project>
bun install

# 2. Rename the project (replace with your own names)
- Replace all `project-name` → `your-project-name` (package names, database, config)
- Replace all `Project Name` → `Your Project Name` (UI display text)

# 3. Copy environment files
cp api/.env.example api/.env
cp app/.env.example app/.env

# 4. Start infrastructure (PostgreSQL + Redis)
docker compose up -d

# 5. Push database schema
cd api && bun run prisma:push

# 6. Start dev servers (API + App)
cd .. && bun dev
```

The app runs on `http://localhost:5173`, API on `http://localhost:3000`.

## Scripts

```bash
bun dev                    # Run API + App in dev mode (Turborepo)
bun eslint .               # Lint

# API
cd api
bun dev                    # API dev server (port 3000, hot-reload)
bun run prisma:push        # Push schema to database
bun run prisma:generate    # Regenerate Prisma client

# App
cd app
bun dev                    # Vite dev server (port 5173)
bun run build              # Production build
```

## Project Structure

```
.
├── api/                   # Backend (Elysia + Prisma)
│   ├── src/
│   │   ├── main.ts        # Entry point, mounts controllers
│   │   ├── core/          # Feature modules (controller + service + types)
│   │   ├── constants/     # Shared constants (permissions, etc.)
│   │   ├── libs/          # Prisma client, shared utilities
│   │   └── types/         # Global types (pagination, filters)
│   └── prisma/
│       └── schema.prisma  # Database schema
│
├── app/                   # Frontend (React + Vite)
│   ├── src/
│   │   ├── main.tsx       # Entry point
│   │   ├── App.tsx        # Root component (providers)
│   │   ├── routes.tsx     # Route definitions
│   │   ├── hooks/         # useAPI, useGlobal, useMessage, etc.
│   │   ├── libs/          # Eden Treaty API client
│   │   ├── providers/     # Theme, Routes, Layout, Auth
│   │   ├── pages/         # Page components
│   │   └── components/    # Shared components
│   └── PUBLIC/
│
├── docker-compose.yaml    # PostgreSQL + Redis
├── turbo.json             # Turborepo config
└── package.json           # Workspace root
```

## Architecture

### API Pattern

Controllers return data directly — no response envelope needed:

```typescript
// api/src/core/projects/controller.ts
export const projectController = new Elysia({ prefix: "/projects" })
	.get("/", () => projectService.getProjects())
	.get("/:id", ({ params }) => projectService.getProject(Number(params.id)))
	.post(
		"/",
		({ body }) => projectService.createProject(body),
		CreateProjectSchema,
	)
	.delete("/:id", ({ params }) =>
		projectService.deleteProject(Number(params.id)),
	);
```

### End-to-End Type Safety

Eden Treaty infers API types automatically on the frontend:

```typescript
// app — types are fully inferred, zero manual definitions
const { data: projects, fetchData } = useAPI(API.projects.get);
```

### Shared Constants

Constants like `PERMISSION` are defined in `api/src/constants/` and imported by the frontend via the `@api/*` path alias:

```typescript
import { PERMISSION } from "@api/constants";
```

## Environment Variables

Copy the example files and adjust as needed:

```bash
cp api/.env.example api/.env
cp app/.env.example app/.env
```

| Variable            | Location   | Description                                            |
| ------------------- | ---------- | ------------------------------------------------------ |
| `DATABASE_URL`      | `api/.env` | PostgreSQL connection string                           |
| `CORS_ORIGIN`       | `api/.env` | Allowed CORS origin (default: `http://localhost:5173`) |
| `VITE_API_BASE_URL` | `app/.env` | API base URL (default: `http://localhost:3000`)        |

## License

MIT
