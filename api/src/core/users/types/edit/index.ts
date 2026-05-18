import { t } from 'elysia';

export const EditUserSchema = {
	body: t.Object({
		email: t.Optional(t.String({ format: 'email' })),
		name: t.Optional(t.String({ minLength: 1 })),
	}),
};

export type IEditUserRequestType = typeof EditUserSchema.body.static;
