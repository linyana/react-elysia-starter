import { t } from 'elysia';

export const CreateUserSchema = {
  body: t.Object({
    email: t.String({ format: 'email' }),
    password: t.String({ minLength: 8 }),
    name: t.String({ minLength: 1 }),
  }),
};

export type ICreateUserRequestType = typeof CreateUserSchema.body.static;
