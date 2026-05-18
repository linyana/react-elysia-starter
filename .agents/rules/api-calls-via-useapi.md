---
description: All frontend HTTP calls must go through the useAPI hook
globs: app/src/**/*.{ts,tsx}
---

# All API calls must go through `useAPI`

Every frontend HTTP request must use the `useAPI` hook. The following are forbidden:

- Calling `API.xxx.yyy.post(...)` / `.get(...)` directly (except in the `libs/api.ts` definition itself)
- Introducing `fetch`, `axios`, or any other HTTP client
- Writing ad-hoc wrappers that bypass `useAPI`

`useAPI` is the single enforcement point for loading toasts, unified error messages, race-condition prevention (request IDs), and end-to-end type inference.

When composing multiple requests, declare multiple `useAPI` instances in a domain hook (e.g. `useAuth`) and chain them via the `fetchData()` return value:

```ts
// ✅ compose in a domain hook
const loginApi = useAPI(API.auth.login.post, { success: { message: null } });
const meApi = useAPI(API.auth.me.get, { showLoading: false, error: { message: null } });

const login = async (creds) => {
  const loginRes = await loginApi.fetchData(creds);
  if (!loginRes) return;
  actions.set({ token: loginRes.token });
  const meRes = await meApi.fetchData();
  if (!meRes) return;
  actions.set({ user: meRes.user });
};

// ❌ raw call
const { data } = await API.auth.login.post(creds);
```

Do not create a `services/xxx.ts` layer just to forward `useAPI(API.x.y.z)`. Only add a layer when it does real work (composition, state, side-effects).
