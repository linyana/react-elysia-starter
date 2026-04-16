import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { projectController } from './core';

const app = new Elysia({ prefix: '/api' })
  .use(cors())
  .onError(({ code, error, set }) => {
    console.error(error);
    const message = 'message' in error ? error.message : 'Unknown error';
    if (code === 'NOT_FOUND') set.status = 404;
    else if (code === 'VALIDATION') set.status = 422;
    else set.status = 500;
    return { message };
  })
  .use(projectController)
  .listen(3000);

export type App = typeof app;

console.log(`
   ███████╗██╗  ██╗   ██╗███████╗██╗ █████╗ 
   ██╔════╝██║  ╚██╗ ██╔╝██╔════╝██║██╔══██╗
   █████╗  ██║   ╚████╔╝ ███████╗██║███████║
   ██╔══╝  ██║    ╚██╔╝  ╚════██║██║██╔══██║
   ███████╗███████╗██║   ███████║██║██║  ██║
   ╚══════╝╚══════╝╚═╝   ╚══════╝╚═╝╚═╝  ╚═╝

      ⚡ Elysia Server Ready on ${app.server?.port} ✔
`);
