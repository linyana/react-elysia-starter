import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { authController, tenantController, userController } from "./core";
import { openapi } from "@elysia/openapi";
import { ensurePort, ENV } from "./libs";
import { AppError } from "./utils";
import { Prisma } from "@prisma/client";

const PORT = Number(ENV.PORT);

const PRISMA_MESSAGE: Record<string, string> = {
	P2002: "Record already exists",
	P2025: "Record not found",
	P2003: "Related record not found",
};

const app = new Elysia({
	prefix: "/api",
})
	.use(cors())
	.use(openapi())
	.onError(({ code, error, set, path }) => {
		if (error instanceof AppError) {
			set.status = error.status;
			console.error("\x1b[33m[BIZ]\x1b[0m", path, error.message);
			return { message: error.message };
		}

		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			const friendly = PRISMA_MESSAGE[error.code];
			set.status = friendly ? 400 : 500;
			console.error("\x1b[31m[PRISMA]\x1b[0m", path, error.code, error.message);
			return { message: friendly ?? "Database error" };
		}

		if (error instanceof Prisma.PrismaClientValidationError) {
			console.error("\x1b[31m[PRISMA]\x1b[0m", path, error.message);
			set.status = 400;
			return { message: "Invalid request data" };
		}

		const presetStatus = typeof set.status === "number" ? set.status : 0;
		if (presetStatus >= 400) {
			// status already set upstream (e.g. 401 from guards)
		} else if (code === "NOT_FOUND") set.status = 404;
		else if (code === "VALIDATION") set.status = 422;
		else set.status = 500;

		const message =
			code === "NOT_FOUND"
				? "Route not found"
				: code === "VALIDATION"
					? "message" in error
						? error.message
						: "Validation failed"
					: "Internal Server Error";

		if (code !== "NOT_FOUND" && code !== "VALIDATION") {
			console.error("\x1b[31m[ERROR]\x1b[0m", path, error);
		}

		return { message };
	})
	.use(authController)
	.use(tenantController)
	.use(userController);

export type App = typeof app;

await ensurePort(PORT);

app.listen(PORT);
console.log(`
   ███████╗██╗  ██╗   ██╗███████╗██╗ █████╗
   ██╔════╝██║  ╚██╗ ██╔╝██╔════╝██║██╔══██╗
   █████╗  ██║   ╚████╔╝ ███████╗██║███████║
   ██╔══╝  ██║    ╚██╔╝  ╚════██║██║██╔══██╗
   ███████╗███████╗██║   ███████║██║██║  ██║
   ╚══════╝╚══════╝╚═╝   ╚══════╝╚═╝╚═╝  ╚═╝

      ⚡ Elysia Server Ready on ${app.server?.port} ✔
`);
