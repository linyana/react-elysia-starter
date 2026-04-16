import { Elysia } from 'elysia';
import { projectService } from './service';
import { CreateProjectSchema } from './types';

export const projectController = new Elysia({ prefix: '/projects' })
  .get('/', () => projectService.getProjects())
  .get('/:id', ({ params }) => projectService.getProject(Number(params.id)))
  .post('/', ({ body }) => projectService.createProject(body), CreateProjectSchema)
  .delete('/:id', ({ params }) => projectService.deleteProject(Number(params.id)));
