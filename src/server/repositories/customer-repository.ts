import { prisma } from '@/lib/db/prisma';

export const customerRepository = {
  findById(id: string) { return prisma.user.findUnique({ where: { id }, include: { customerProfile: true, _count: { select: { projectsOwned: true, filesUploaded: true } } } }); },
  list(input: { q?: string; status?: 'INVITED' | 'ACTIVE' | 'SUSPENDED' | 'DISABLED'; skip: number; take: number }) {
    const where = { role: 'CUSTOMER' as const, ...(input.status ? { status: input.status } : {}), ...(input.q ? { OR: [{ name: { contains: input.q, mode: 'insensitive' as const } }, { email: { contains: input.q, mode: 'insensitive' as const } }] } : {}) };
    return Promise.all([
      prisma.user.findMany({ where, orderBy: { createdAt: 'desc' }, skip: input.skip, take: input.take, include: { customerProfile: true, _count: { select: { projectsOwned: true, filesUploaded: true } } } }),
      prisma.user.count({ where }),
    ]);
  },
  create(data: { name: string; email: string; phone?: string | null; companyName?: string | null; notes?: string | null }) { return prisma.user.create({ data: { name: data.name, email: data.email, role: 'CUSTOMER', customerProfile: { create: { phone: data.phone, companyName: data.companyName, notes: data.notes } } }, include: { customerProfile: true } }); },
  update(id: string, data: { name?: string; email?: string; phone?: string | null; companyName?: string | null; notes?: string | null }) { return prisma.user.update({ where: { id }, data: { name: data.name, email: data.email, customerProfile: { upsert: { create: { phone: data.phone, companyName: data.companyName, notes: data.notes }, update: { phone: data.phone, companyName: data.companyName, notes: data.notes } } } }, include: { customerProfile: true } }); },
};
