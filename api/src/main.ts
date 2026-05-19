import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { authController, tenantController, userController } from '@api/core';
import { openapi } from '@elysia/openapi';
import { ensurePort, ENV, onError } from '@api/libs';

const PORT = Number(ENV.PORT);

const app = new Elysia({
	prefix: '/api',
})
	.use(cors())
	.use(openapi())
	.onError(onError)
	.use(authController)
	.use(tenantController)
	.use(userController);

export type App = typeof app;

await ensurePort(PORT);

app.listen(PORT);
console.log(`
   ███████╗██╗  ██╗   ██╗███████╗██╗ █████╗
   ██╔════╝██║  ╚██╗ ██╔╝██╔════╝██║██╔══██╗
   █████╗  ██║   ╚████╔╝ ███████╗██║███████║
   ██╔══╝  ██║    ╚██╔╝  ╚════██║██║██╔══██╗
   ███████╗███████╗██║   ███████║██║██║  ██║
   ╚══════╝╚══════╝╚═╝   ╚══════╝╚═╝╚═╝  ╚═╝

      ⚡ Elysia Server Ready on ${app.server?.port} ✔
`);
