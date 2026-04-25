import { prisma } from '../../libs';
import { ILoginRequestType, IRegisterRequestType } from './types';

const issueToken = (tenantId: number, userId: number) =>
  `demo-${tenantId}-${userId}`;

const parseToken = (token: string) => {
  const match = /^demo-(\d+)-(\d+)$/.exec(token);
  if (!match) return null;
  return { tenantId: Number(match[1]), userId: Number(match[2]) };
};

class AuthService {
  async register({ tenant, user }: IRegisterRequestType) {
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
    return { token: issueToken(created.id, firstUser.id) };
  }

  async login({ email, password }: ILoginRequestType) {
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) throw new Error('Invalid credentials');

    const ok = await Bun.password.verify(password, user.password);
    if (!ok) throw new Error('Invalid credentials');

    return { token: issueToken(user.tenantId, user.id) };
  }

  async me(token: string | undefined) {
    const claims = token ? parseToken(token) : null;
    if (!claims) throw new Error('Invalid token');

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
}

export const authService = new AuthService();
