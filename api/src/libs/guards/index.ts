import { Elysia } from 'elysia';
import { authGuard } from './auth';
import { permissionGuard } from './permission';

export * from './auth';
export * from './permission';

export const guardsPlugin = new Elysia({ name: 'libs/guards' })
  .use(authGuard)
  .use(permissionGuard);
