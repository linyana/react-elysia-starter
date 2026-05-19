import { Elysia } from 'elysia';
import type { IAuthType } from '../auth';
import { PERMISSION_WILDCARD, type IPermission } from './types';
import { AppError } from '@api/libs/error';

export * from './types';

export const permissionGuard = new Elysia({
	name: 'libs/guards/permission',
}).macro('permissions', (required: IPermission | IPermission[]) => ({
	resolve: (ctx) => {
		const { auth } = ctx as typeof ctx & { auth?: IAuthType };
		if (!auth) throw new AppError('Unauthenticated', 401);
		if (auth.permissions.includes(PERMISSION_WILDCARD)) return {};
		const need = Array.isArray(required) ? required : [required];
		const lacking = need.filter((p) => !auth.permissions.includes(p));
		if (lacking.length) {
			throw new AppError(
				`Missing permission: ${lacking.join(', ')}`,
				403,
			);
		}
		return {};
	},
}));
