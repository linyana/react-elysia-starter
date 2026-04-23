import { prisma } from '../src/libs';

async function main() {
  let tenant = await prisma.tenants.findFirst({
    where: {
      name: 'Test Tenant',
    },
  });

  if (!tenant) { 
    tenant = await prisma.tenants.create({
      data: {
        name: 'Test Tenant',
      },
    })
  }

  const passwordTest = await Bun.password.hash('Silk123456');
  await prisma.users.upsert({
    where: {
      email: 'test@test.com',
    },
    update: {},
    create: {
      name: 'Test',
      email: 'test@test.com',
      password: passwordTest,
      tenantId: tenant.id,
    },
  });

  console.log('Successfully init');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
