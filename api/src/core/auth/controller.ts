import { Elysia } from 'elysia';
import { authService } from './service';
import { LoginSchema, RegisterSchema } from './types';
import { authPlugin, jwtPlugin } from '../../libs';

export const authController = new Elysia({ prefix: '/auth' })
  .use(jwtPlugin)
  .post(
    '/register',
    async ({ body, jwt }) => {
      const claims = await authService.register(body);
      const token = await jwt.sign(claims);
      return { token };
    },
    RegisterSchema
  )
  .post(
    '/login',
    async ({ body, jwt }) => {
      const claims = await authService.login(body);
      const token = await jwt.sign(claims);
      return { token };
    },
    LoginSchema
  )
  .use(authPlugin)
  .get('/me', ({ auth }) => authService.me(auth));
