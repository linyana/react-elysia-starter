import { Elysia, t } from 'elysia';
import { userService } from './service';
import { CreateUserSchema } from './types';

export const userController = new Elysia({ prefix: '/users' })
  .get(
    '/',
    ({ query }) =>
      userService.getUsers(
        query.tenantId ? Number(query.tenantId) : undefined,
      ),
    { query: t.Object({ tenantId: t.Optional(t.String()) }) },
  )
  .get('/:id', ({ params }) => userService.getUser(Number(params.id)))
  .post('/', ({ body }) => userService.createUser(body), CreateUserSchema)
  .delete('/:id', ({ params }) => userService.deleteUser(Number(params.id)));
