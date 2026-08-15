import { prisma } from '@/lib/db/prisma';

export const projectRepository = {
  findById(id: string) { return prisma.project.findUnique({ where: { id }, include: { customer: { select: { id: true, name: true, email: true } }, _count: { select: { files: true, folders: true } } } }); },
  list(input: { q?: string; skip: number; take: number }) { const where = input.q ? { name: { contains: input.q, mode: 'insensitive' as const } } : undefined; return Promise.all([prisma.project.findMany({ where, orderBy: { updatedAt: 'desc' }, skip: input.skip, take: input.take, include: { customer: { select: { id: true, name: true, email: true } }, _count: { select: { files: true, folders: true } } } }), prisma.project.count({ where })]); },
  listByCustomer(customerId: string) { return prisma.project.findMany({ where: { customerId }, orderBy: { updatedAt: 'desc' }, include: { _count: { select: { files: true, folders: true } } } }); },
  create(data: { customerId: string; name: string; description?: string | null; status?: 'DRAFT' | 'IN_PROGRESS' | 'READY' | 'ARCHIVED'; customerUploadEnabled?: boolean }) { return prisma.project.create({ data }); },
  update(id: string, data: { name?: string; description?: string | null; status?: 'DRAFT' | 'IN_PROGRESS' | 'READY' | 'ARCHIVED'; customerUploadEnabled?: boolean }) { return prisma.project.update({ where: { id }, data }); },
};
