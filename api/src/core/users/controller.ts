import { Elysia, t } from 'elysia';
import { userService } from './service';
import { CreateUserSchema } from './types';
import { guardsPlugin } from '../../libs';

export const userController = new Elysia({ prefix: '/users', tags: ["Users"] })
  .use(guardsPlugin)
  .guard({ auth: true })
  .get(
    '/',
    ({ query }) =>
      userService.getUsers({
        tenantId: query.tenantId,
        offset: query.offset,
        limit: query.limit,
        keyword: query.keyword,
      }),
    {
      query: t.Object({
        tenantId: t.Optional(t.Numeric()),
        offset: t.Optional(t.Numeric()),
        limit: t.Optional(t.Numeric()),
        keyword: t.Optional(t.String()),
      }),
    },
  )
  .get('/:id', ({ params }) => userService.getUser(Number(params.id)))
  .post('/', ({ body, auth }) => userService.createUser(body, auth.tenantId), CreateUserSchema)
  .delete('/:id', ({ params }) => userService.deleteUser(Number(params.id)));
