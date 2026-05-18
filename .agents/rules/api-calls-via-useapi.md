---
description: All frontend HTTP calls must go through the useAPI hook
globs: app/src/**/*.{ts,tsx}
---

# All API calls must go through `useAPI`

前端所有 HTTP 请求必须经 `useAPI` hook，不允许：

- 直接调用 `API.xxx.yyy.post(...)` / `.get(...)`（`libs/api.ts` 定义处除外）
- 引入 `fetch`、`axios` 或任何其他 HTTP 客户端
- 自建绕过 `useAPI` 的 wrapper

`useAPI` 是 loading toast / 统一错误提示 / 竞态取消 / 类型推断的唯一执行点。

组合多个请求时，在领域 hook（如 `useAuth`）里声明多个 `useAPI` 实例，通过 `fetchData()` 返回值串联：

```ts
// ✅ 在领域 hook 里组合
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

// ❌ 裸调用
const { data } = await API.auth.login.post(creds);
```

不要建 `services/xxx.ts` 只为转发 `useAPI(API.x.y.z)`。只在需要真正组合、状态、副作用时才加一层。
