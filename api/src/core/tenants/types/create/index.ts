import { t } from 'elysia';

export const CreateTenantSchema = {
  body: t.Object({
    name: t.String({ minLength: 1 }),
    slug: t.String({ minLength: 1, pattern: '^[a-z0-9-]+$' }),
  }),
};

export type ICreateTenantRequestType = typeof CreateTenantSchema.body.static;
