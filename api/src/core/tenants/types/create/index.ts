import { t } from 'elysia';

export const CreateTenantSchema = {
	body: t.Object({
		name: t.String({ minLength: 1 }),
	}),
};

export type ICreateTenantRequestType = typeof CreateTenantSchema.body.static;
