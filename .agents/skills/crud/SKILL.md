# Generate CRUD Module

Generate a full CRUD module (backend + frontend) following the established patterns from the `users` module.

## Input

The user will provide:
- **Module name** (e.g. `projects`, `posts`, `products`)
- **Prisma model name** (e.g. `projects`, `posts`) — the table name in `schema.prisma`
- **Fields** — the fields for create/edit/list, with types and validation

If the user only gives a module name, check `api/prisma/schema.prisma` for the model definition and infer the fields from there.

## Backend Files to Generate

All backend files go under `api/src/core/<module>/`.

### 1. `types/create/index.ts`

Use Elysia's `t` (TypeBox) to define the request body schema. Export both the schema object and the inferred type.

```ts
import { t } from 'elysia';

export const Create<Model>Schema = {
  body: t.Object({
    // fields with validation (t.String, t.Number, t.Optional, etc.)
  }),
};

export type ICreate<Model>RequestType = typeof Create<Model>Schema.body.static;
```

### 2. `types/edit/index.ts`

Same as create but all fields are `t.Optional(...)`. The schema name is `Edit<Model>Schema`.

```ts
import { t } from 'elysia';

export const Edit<Model>Schema = {
  body: t.Object({
    // all fields wrapped in t.Optional(...)
  }),
};

export type IEdit<Model>RequestType = typeof Edit<Model>Schema.body.static;
```

### 3. `types/list/index.ts`

Compose `FilterSchema.query` (from `@/types`) with any module-specific query filters using `t.Composite`.

```ts
import { FilterSchema } from '@/types';
import { t } from 'elysia';

export const <Model>ListSchema = {
  query: t.Composite([
    FilterSchema.query,
    t.Object({
      // module-specific optional filters
    }),
  ]),
};

export type I<Model>ListRequestType = typeof <Model>ListSchema.query.static;
```

### 4. `types/index.ts`

Barrel export:
```ts
export * from './create';
export * from './edit';
export * from './list';
```

### 5. `service.ts`

A class with 5 methods. Key patterns:
- Define `SELECTED_FIELDS` (Prisma select) at the top — never return `password` or other sensitive fields.
- Every method receives `auth: IAuthType` and scopes queries with `tenantId: auth.tenantId`.
- `getList`: destructure `{ offset = 0, limit = 10, keyword }` from query. Build `where` with tenant scope + optional keyword search (case-insensitive `contains` on relevant fields via `OR`). Use `Promise.all([findMany, count])`. Return `{ items, totalCount }`.
- `getOne`: `findUniqueOrThrow` with tenant scope + select.
- `create`: `prisma.<model>.create({ data: { ...body, tenantId }, select })`.
- `update`: `prisma.<model>.update({ where: { id, tenantId }, data: body, select })`.
- `delete`: `prisma.<model>.deleteMany({ where: { tenantId, id: { in: ids.map(Number) } } })`. The `ids` param is `string[]`.

Export a singleton instance: `export const <module>Service = new <Model>Service();`

### 6. `controller.ts`

An Elysia instance with prefix `/<module>` and a tag. Key patterns:
- `.use(guardsPlugin).guard({ auth: true })` — all routes require auth.
- `GET /` — list, passes `{ query, auth }` to service, uses `<Model>ListSchema`.
- `GET /:id` — detail, passes `{ id: Number(params.id), auth }`.
- `POST /` — create, passes `{ body, auth }`, uses `Create<Model>Schema`.
- `PATCH /:id` — update, passes `{ id: Number(params.id), body, auth }`, uses `Edit<Model>Schema`.
- `DELETE /` — bulk delete, inline schema `t.Object({ ids: t.Array(t.String()) })`, passes `{ ids: body.ids, auth }`.

## Frontend Files to Generate

All frontend files go under `app/src/pages/<Module>/` (PascalCase).

### 1. `index.tsx`

Just imports and renders `<Module>List`:
```tsx
import { <Module>List } from './List';
export const <Module> = () => <><Module>List /></>;
```

### 2. `List/index.tsx`

Uses `useListAPI` with `API.<module>.get`. Renders `ProCard` > `TableForm` + `SearchInput` > `ProTable`.
- `extra` prop on `ProCard`: the `Create<Model>` component with `fetch` prop.
- Table columns: define based on fields. Last column is "Actions" with `Edit<Model>` and `Remove<Model>`.
- `Edit<Model>` receives `item` and `onEdited={update}`.
- `Remove<Model>` receives `items={[record]}` and `refreshList={fetch}`.

### 3. `Create/index.tsx`

Pattern:
- Props: `{ fetch: () => void }`.
- State: `open` (boolean), `form` (Ant Design Form).
- `useAPI` with `fetcher: API.<module>.post`, success action closes modal + resets form + calls `fetch()`.
- A `ProButton` (type="primary", iconName="Plus") that opens the modal.
- `ProModal` > `ProForm` with `Form.Item` fields matching the create schema.
- Import the create request type from `@api/core/<module>/types`.

### 4. `Edit/index.tsx`

Pattern:
- Props: `{ item: UseAPIItem<typeof API.<module>.get>, onEdited: (id, patch) => void }`.
- `useAPI` with `fetcher` that calls `API.<module>({ id: String(item.id) }).patch(body)`.
- Success action calls `onEdited(item.id, data)` then closes modal.
- A `ProButton` (type="text", action="EDIT") trigger.
- `ProModal` > `ProForm` with edit fields (same as create minus password-like fields).
- Import the edit request type from `@api/core/<module>/types`.

### 5. `Remove/index.tsx`

Pattern:
- Props: `{ items: UseAPIItem<typeof API.<module>.get>[], refreshList: () => void }`.
- `useAPI` with `fetcher` that calls `API.<module>.delete({ ids: items.map(i => String(i.id)) })`.
- Confirmation modal with single/bulk messaging.
- `ProButton` (type="text", action="DELETE") trigger.

## Wiring (do these after generating files)

1. **Backend barrel** — add exports to `api/src/core/index.ts`:
   ```ts
   export * from './<module>/service';
   export * from './<module>/controller';
   ```

2. **Mount controller** — add `.use(<module>Controller)` in `api/src/main.ts` (before the semicolon after the last `.use()`).

3. **Frontend barrel** — add `export * from './<Module>';` to `app/src/pages/index.ts`.

4. **Route** — add route entry in `app/src/routes.tsx`:
   ```tsx
   {
     id: '/<module>',
     path: '/<module>',
     element: <<Module> />,
     handle: {
       menu: {
         label: '<Module>',
         iconName: '<LucideIcon>',
         featured: true,
       },
     },
   },
   ```

## Rules

- All types flow from backend to frontend via Eden Treaty. Never define API response types on the frontend.
- Use `@api/core/<module>/types` for importing request types in frontend components.
- Use `UseAPIItem<typeof API.<module>.get>` to type list items — never hand-write the item type.
- Environment variables must go through `ENV` from `@/libs/env`, never `process.env`.
- All API calls on the frontend go through `useAPI` or `useListAPI`.
