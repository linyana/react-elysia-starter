import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import {
	authController,
	projectController,
	tenantController,
	userController,
} from "./core";

const app = new Elysia({ prefix: "/api" })
	.use(cors())
	.onError(({ code, error, set, path }) => {
		const err = error instanceof Error ? error : new Error(String(error));

		try {
			console.error("\x1b[31m[API_ERROR]\x1b[0m", {
				code,
				path,
				message: JSON.parse(err.message),
			});
		} catch { }
		
		const message = "message" in error ? error.message : "Unknown error";
		if (code === "NOT_FOUND") set.status = 404;
		else if (code === "VALIDATION") set.status = 422;
		else set.status = 400;
		return { message };
	})
	.use(authController)
	.use(tenantController)
	.use(userController)
	.use(projectController)
	.listen(3000);

export type App = typeof app;

console.log(`
   ███████╗██╗  ██╗   ██╗███████╗██╗ █████╗ 
   ██╔════╝██║  ╚██╗ ██╔╝██╔════╝██║██╔══██╗
   █████╗  ██║   ╚████╔╝ ███████╗██║███████║
   ██╔══╝  ██║    ╚██╔╝  ╚════██║██║██╔══██║
   ███████╗███████╗██║   ███████║██║██║  ██║
   ╚══════╝╚══════╝╚═╝   ╚══════╝╚═╝╚═╝  ╚═╝

      ⚡ Elysia Server Ready on ${app.server?.port} ✔
`);
