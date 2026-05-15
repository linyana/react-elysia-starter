import { t } from 'elysia';

export const UpdateUserSchema = {
	body: t.Object({
		email: t.Optional(t.String({ format: 'email' })),
		name: t.Optional(t.String({ minLength: 1 })),
	}),
};

export type IUpdateUserRequestType = typeof UpdateUserSchema.body.static;
