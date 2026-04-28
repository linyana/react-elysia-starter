import { t } from 'elysia';

export const JWT_NAME = 'jwt';

export const TokenClaimsSchema = t.Object({
  userId: t.Number(),
  tenantId: t.Number(),
  email: t.String(),
  name: t.String(),
  tenantName: t.Union([t.String(), t.Null()]),
  permissions: t.Array(t.String()),
});

export type ITokenClaims = typeof TokenClaimsSchema.static;
