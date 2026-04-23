import { Elysia } from 'elysia';
import { authService } from './service';
import { LoginSchema, RegisterSchema } from './types';

const getBearer = (header: string | null | undefined) =>
  header?.startsWith('Bearer ') ? header.slice(7) : undefined;

export const authController = new Elysia({ prefix: '/auth' })
  .post('/register', ({ body }) => authService.register(body), RegisterSchema)
  .post('/login', ({ body }) => authService.login(body), LoginSchema)
  .get('/me', ({ headers, set }) => {
    const token = getBearer(headers.authorization);
    if (!token) {
      set.status = 401;
      throw new Error('Missing token');
    }
    return authService.me(token);
  });
