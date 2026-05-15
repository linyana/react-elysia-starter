import { Elysia, t } from "elysia";
import { userService } from "./service";
import { CreateUserSchema, UpdateUserSchema } from "./types";
import { guardsPlugin } from "../../libs";

export const userController = new Elysia({ prefix: "/users", tags: ["Users"] })
	.use(guardsPlugin)
	.guard({ auth: true })
	.get(
		"/",
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
	.get("/:id", ({ params }) => userService.getUser(Number(params.id)))
	.post(
		"/",
		({ body, auth }) => userService.createUser(body, auth.tenantId),
		CreateUserSchema,
	)
	.patch(
		"/:id",
		({ params, body }) => userService.updateUser(Number(params.id), body),
		UpdateUserSchema,
	)
	.delete("/", ({ body }) => userService.deleteUser(body.ids), {
		body: t.Object({
			ids: t.Array(t.String()),
		}),
	});
