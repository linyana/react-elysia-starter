import { Elysia, t } from 'elysia';
import { userService } from './service';
import { CreateUserSchema, EditUserSchema } from './types';
import { guardsPlugin } from '../../libs';
import { UserListSchema } from './types';

export const userController = new Elysia({ prefix: '/users', tags: ['Users'] })
	.use(guardsPlugin)
	.guard({ auth: true })
	.get(
		'/',
		({ query, auth }) =>
			userService.getUsers({
				query,
				auth,
			}),
		UserListSchema,
	)
	.get('/:id', ({ params, auth }) =>
		userService.getUser({
			id: Number(params.id),
			auth,
		}),
	)
	.post(
		'/',
		({ body, auth }) => userService.createUser({ body, auth }),
		CreateUserSchema,
	)
	.patch(
		'/:id',
		({ params, body, auth }) =>
			userService.updateUser({ id: Number(params.id), body, auth }),
		EditUserSchema,
	)
	.delete(
		'/',
		async ({ body, auth }) => {
			await userService.deleteUser({ ids: body.ids, auth });
			return 'Successfully removed';
		},
		{
			body: t.Object({
				ids: t.Array(t.String()),
			}),
		},
	);
