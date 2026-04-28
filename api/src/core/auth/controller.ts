import { Elysia } from "elysia";
import { authService } from "./service";
import { LoginSchema, RegisterSchema } from "./types";
import { guardsPlugin, jwtPlugin } from "../../libs";

export const authController = new Elysia({
	prefix: "/auth",
	detail: {
		hide: true,
	},
})
	.use(jwtPlugin)
	.use(guardsPlugin)
	.post(
		"/register",
		async ({ body, jwt }) => {
			const claims = await authService.register(body);
			const token = await jwt.sign(claims);
			return { token };
		},
		RegisterSchema,
	)
	.post(
		"/login",
		async ({ body, jwt }) => {
			const claims = await authService.login(body);
			const token = await jwt.sign(claims);
			return { token };
		},
		LoginSchema,
	)
	.get("/me", ({ auth }) => authService.me(auth), { auth: true });
