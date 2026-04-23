import { t } from 'elysia';

export const RegisterSchema = {
  body: t.Object({
    tenant: t.Object({
      name: t.String({ minLength: 1 }),
      slug: t.String({ minLength: 1, pattern: '^[a-z0-9-]+$' }),
    }),
    user: t.Object({
      email: t.String({ format: 'email' }),
      password: t.String({ minLength: 8 }),
      name: t.String({ minLength: 1 }),
    }),
  }),
};

export const LoginSchema = {
  body: t.Object({
    email: t.String({ format: 'email' }),
    password: t.String({ minLength: 1 }),
  }),
};

export type IRegisterRequestType = typeof RegisterSchema.body.static;
export type ILoginRequestType = typeof LoginSchema.body.static;
