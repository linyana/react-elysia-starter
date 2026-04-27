import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import {
	authController,
	projectController,
	tenantController,
	userController,
} from "./core";
import { authPlugin } from "./libs";

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
		} catch {}

		const message = "message" in error ? error.message : "Unknown error";
		const presetStatus = typeof set.status === "number" ? set.status : 0;
		if (presetStatus >= 400) {
			// status already set upstream (e.g. 401 from authPlugin) — preserve it
		} else if (code === "NOT_FOUND") set.status = 404;
		else if (code === "VALIDATION") set.status = 422;
		else set.status = 400;
		return { message };
	})
	// Public routes — login & register need no token; /me self-protects via authPlugin
	.use(authController)
	// Everything else requires a valid JWT
	.use(authPlugin)
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
