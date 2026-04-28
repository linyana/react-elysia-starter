import { prisma } from '../../libs';
import { ITokenClaims } from '../../libs';
import { ILoginRequestType, IRegisterRequestType } from './types';

class AuthService {
  async register({ tenant, user }: IRegisterRequestType) {
    const existing = await prisma.users.findUnique({ where: { email: user.email } });
    if (existing) throw new Error('Email already registered');

    const password = await Bun.password.hash(user.password);
    const created = await prisma.tenants.create({
      data: {
        name: tenant.name,
        users: {
          create: { email: user.email, name: user.name, password },
        },
      },
      include: { users: true },
    });
    const [firstUser] = created.users;

    return this.buildClaims(firstUser.id);
  }

  async login({ email, password }: ILoginRequestType) {
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) throw new Error('Invalid credentials');

    const ok = await Bun.password.verify(password, user.password);
    if (!ok) throw new Error('Invalid credentials');

    return this.buildClaims(user.id);
  }

  async me(claims: ITokenClaims) {
    const user = await prisma.users.findUnique({
      where: { id: claims.userId },
      include: { tenant: true },
    });
    if (!user || user.tenantId !== claims.tenantId) {
      throw new Error('Invalid token');
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        tenantId: user.tenantId,
      },
      tenant: {
        id: user.tenant.id,
        name: user.tenant.name,
      },
    };
  }

  private async buildClaims(userId: number): Promise<ITokenClaims> {
    const user = await prisma.users.findUniqueOrThrow({
      where: { id: userId },
      include: { tenant: true },
    });
    return {
      userId: user.id,
      tenantId: user.tenantId,
      email: user.email,
      name: user.name,
      tenantName: user.tenant.name ?? null,
      // TODO: replace wildcard with real RBAC lookup once a roles/permissions table exists
      permissions: ['*'],
    };
  }
}

export const authService = new AuthService();
