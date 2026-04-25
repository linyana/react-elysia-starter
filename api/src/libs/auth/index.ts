import { Elysia, t } from 'elysia';
import { jwt } from '@elysiajs/jwt';

export const JWT_NAME = 'jwt';

export const TokenClaimsSchema = t.Object({
  userId: t.Number(),
  tenantId: t.Number(),
  email: t.String(),
  name: t.String(),
  tenantName: t.Union([t.String(), t.Null()]),
});

export type ITokenClaims = typeof TokenClaimsSchema.static;

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

export const authPlugin = new Elysia({ name: 'libs/auth' })
  .use(jwtPlugin)
  .derive({ as: 'scoped' }, async ({ jwt, headers, set }) => {
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

    const auth: ITokenClaims = {
      userId: payload.userId,
      tenantId: payload.tenantId,
      email: payload.email,
      name: payload.name,
      tenantName: payload.tenantName,
    };

    return { auth };
  });
