import { Elysia } from 'elysia';
import { jwt } from '@elysiajs/jwt';
import { JWT_NAME, TokenClaimsSchema, type ITokenClaims } from './types';

export * from './types';

export const jwtPlugin = new Elysia({ name: 'libs/jwt' }).use(
  jwt({
    name: JWT_NAME,
    secret: process.env.JWT_SECRET ?? 'dev-only-change-me',
    exp: '7d',
    schema: TokenClaimsSchema,
  })
);

const getBearer = (header: string | null | undefined) =>
  header?.startsWith('Bearer ') ? header.slice(7) : undefined;

const toClaims = (payload: Record<string, unknown>): ITokenClaims => ({
  userId: payload.userId as number,
  tenantId: payload.tenantId as number,
  email: payload.email as string,
  name: payload.name as string,
  tenantName: (payload.tenantName as string | null) ?? null,
  permissions: (payload.permissions as string[]) ?? [],
});

export const authGuard = new Elysia({ name: 'libs/guards/auth' })
  .use(jwtPlugin)
  .macro('auth', {
    resolve: async ({ jwt, headers, set }) => {
      const token = getBearer(headers.authorization);
      if (!token) {
        set.status = 401;
        throw new Error('Missing token');
      }
      const payload = await jwt.verify(token);
      if (!payload) {
        set.status = 401;
        throw new Error('Invalid or expired token');
      }
      return { auth: toClaims(payload) };
    },
  });
