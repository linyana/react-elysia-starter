import { Elysia } from 'elysia';
import { tenantService } from './service';
import { CreateTenantSchema } from './types';

export const tenantController = new Elysia({ prefix: '/tenants' })
  .get('/', () => tenantService.getTenants())
  .get('/:id', ({ params }) => tenantService.getTenant(Number(params.id)))
  .post('/', ({ body }) => tenantService.createTenant(body), CreateTenantSchema)
  .delete('/:id', ({ params }) => tenantService.deleteTenant(Number(params.id)));
