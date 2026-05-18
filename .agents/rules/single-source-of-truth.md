---
description: Core design principle — declare everything once, backend is the authority
globs:
---

# Single Source of Truth

所有类型、常量、配置只声明一次。

- 前后端都需要的定义放在后端（`api/`），前端通过 `@api/*` 别名导入。
- 禁止跨包复制类型或常量。如果前端需要后端的类型，`import type` from `@api/...`。
- 环境变量集中在 `api/src/libs/env/index.ts`（`ENV` 对象），禁止直接 `process.env`。
  - 必填变量加入 `REQUIRED_KEYS`（缺失时启动崩溃）。
  - 可选变量加入 `OPTIONAL_KEYS`（带默认值）。
  - `env/index.ts` 内部使用 `Bun.env`，这是唯一允许接触原始环境变量的文件。
  - 由 oxlint `no-restricted-properties` 规则强制执行，lint 和 build 均会拦截。

```ts
// ✅
import { ENV } from '@/libs';
const port = Number(ENV.PORT);

// ❌ lint error
const port = Number(process.env.PORT);
```
