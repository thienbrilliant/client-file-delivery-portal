import 'dotenv/config';
import argon2 from 'argon2';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not configured. Copy .env.example to .env and set DATABASE_URL before running the seed script.');
}

const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await argon2.hash('ChangeMe123!');

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: { passwordHash, role: 'ADMIN', name: 'Quản trị viên' },
    create: {
      email: 'admin@example.com',
      passwordHash,
      role: 'ADMIN',
      name: 'Quản trị viên',
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: { passwordHash, role: 'CUSTOMER', name: 'Thiên' },
    create: {
      email: 'customer@example.com',
      passwordHash,
      role: 'CUSTOMER',
      name: 'Thiên',
      customerProfile: { create: { companyName: 'Khách hàng mẫu' } },
    },
  });

  await prisma.project.upsert({
    where: { id: 'seed-project-website-abc' },
    update: { customerId: customer.id },
    create: {
      id: 'seed-project-website-abc',
      customerId: customer.id,
      name: 'Website ABC',
      description: 'Dữ liệu mẫu cho môi trường phát triển.',
      status: 'READY',
    },
  });

  await prisma.activityLog.create({
    data: {
      userId: admin.id,
      projectId: 'seed-project-website-abc',
      action: 'seed.initialized',
      metadata: { environment: 'development' },
    },
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
