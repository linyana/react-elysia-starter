import { prisma } from '../../libs';
import { ICreateUserRequestType } from './types';

const publicFields = {
  id: true,
  createdAt: true,
  updatedAt: true,
  email: true,
  name: true,
  tenantId: true,
} as const;

class UserService {
  getUsers(tenantId?: number) {
    return prisma.users.findMany({
      where: tenantId ? { tenantId } : undefined,
      orderBy: { updatedAt: 'desc' },
      select: publicFields,
    });
  }

  getUser(id: number) {
    return prisma.users.findUniqueOrThrow({
      where: { id },
      select: publicFields,
    });
  }

  async createUser(data: ICreateUserRequestType) {
    const password = await Bun.password.hash(data.password);
    return prisma.users.create({
      data: { ...data, password },
      select: publicFields,
    });
  }

  deleteUser(id: number) {
    return prisma.users.delete({ where: { id } });
  }
}

export const userService = new UserService();
