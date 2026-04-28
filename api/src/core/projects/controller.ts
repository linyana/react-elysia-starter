import { Elysia } from "elysia";
import { projectService } from "./service";
import { CreateProjectSchema } from "./types";
import { guardsPlugin } from "../../libs";

export const projectController = new Elysia({ prefix: "/projects" })
	.use(guardsPlugin)
	.guard({ auth: true })
	.get("/", ({ auth }) => projectService.getProjects(auth))
	.get("/:id", ({ params, auth }) =>
		projectService.getProject(Number(params.id), auth),
	)
	.post("/", ({ body, auth }) => projectService.createProject(body, auth), {
		...CreateProjectSchema,
	})
	.delete("/:id", ({ params, auth }) =>
		projectService.deleteProject(Number(params.id), auth),
	);
