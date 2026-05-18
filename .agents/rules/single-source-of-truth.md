---
description: Core design principle — declare everything once, backend is the authority
globs:
---

# Single Source of Truth

Every type, constant, and config must be declared exactly once.

- Definitions needed by both frontend and backend live in the backend (`api/`). The frontend imports them via the `@api/*` alias.
- Never duplicate types or constants across packages. If the frontend needs a backend type, use `import type` from `@api/...`.
- Environment variables are centralized in `api/src/libs/env/index.ts` (the `ENV` object). Direct `process.env` access is forbidden.
  - Required variables go in `REQUIRED_KEYS` — the server crashes on startup if any are missing.
  - Optional variables (with defaults) go in `OPTIONAL_KEYS`.
  - `env/index.ts` uses `Bun.env` internally; it is the only file allowed to touch raw env access.
  - Enforced by the oxlint `no-restricted-properties` rule — lint and build will both reject `process.env`.

```ts
// ✅
import { ENV } from '@/libs';
const port = Number(ENV.PORT);

// ❌ lint error
const port = Number(process.env.PORT);
```
