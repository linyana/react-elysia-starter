import { prisma } from '@/libs';
import { ICreateTenantRequestType } from './types';

class TenantService {
  getTenants() {
    return prisma.tenants.findMany({
      orderBy: { updatedAt: 'desc' },
    });
  }

  getTenant(id: number) {
    return prisma.tenants.findUniqueOrThrow({ where: { id } });
  }

  getTenantBySlug(slug: string) {
    return prisma.tenants.findUniqueOrThrow({ where: { slug } });
  }

  createTenant(data: ICreateTenantRequestType) {
    return prisma.tenants.create({ data });
  }

  deleteTenant(id: number) {
    return prisma.tenants.delete({ where: { id } });
  }
}

export const tenantService = new TenantService();
