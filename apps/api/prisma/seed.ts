import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 10);

  // Departments
  const it = await prisma.department.upsert({
    where: { name: 'IT' },
    update: {},
    create: { name: 'IT' },
  });

  const finance = await prisma.department.upsert({
    where: { name: 'Finance' },
    update: {},
    create: { name: 'Finance' },
  });

  // Users
  await prisma.user.upsert({
    where: { email: 'admin@erp.com' },
    update: {},
    create: {
      email: 'admin@erp.com',
      password,
      name: 'Admin User',
      role: Role.SYSTEM_ADMIN,
    },
  });

  await prisma.user.upsert({
    where: { email: 'dept_head@erp.com' },
    update: {},
    create: {
      email: 'dept_head@erp.com',
      password,
      name: 'Sarah IT Head',
      role: Role.DEPARTMENT_HEAD,
      departmentId: it.id,
    },
  });

  await prisma.user.upsert({
    where: { email: 'proc_mgr@erp.com' },
    update: {},
    create: {
      email: 'proc_mgr@erp.com',
      password,
      name: 'Mike Procurement',
      role: Role.PROCUREMENT_MANAGER,
    },
  });

  // Rules
  await prisma.rulesConfig.upsert({
    where: { id: 'routing-rule-1' },
    update: {},
    create: {
      id: 'routing-rule-1',
      category: 'ROUTING',
      name: 'Approval Routing Rule',
      rule: {
        slabs: [
          { min: 0, max: 50000, roles: [Role.DEPARTMENT_HEAD] },
          { min: 50001, max: 500000, roles: [Role.DEPARTMENT_HEAD, Role.PROCUREMENT_MANAGER] },
          { min: 500001, max: 2500000, roles: [Role.DEPARTMENT_HEAD, Role.PROCUREMENT_MANAGER, Role.FINANCE_HEAD] },
          { min: 2500001, max: 999999999, roles: [Role.DEPARTMENT_HEAD, Role.PROCUREMENT_MANAGER, Role.FINANCE_HEAD, Role.MANAGING_DIRECTOR] },
        ],
      },
    },
  });

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
