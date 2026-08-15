import { prisma } from '@/lib/db/prisma';

export const fileRepository = {
  findById(id: string) {
    return prisma.file.findUnique({ where: { id }, include: { project: { select: { id: true, name: true, customerId: true } }, folder: { select: { id: true, name: true } }, uploadedBy: { select: { id: true, name: true, email: true } } } });
  },
  list(input: { projectId: string; folderId?: string | null; q?: string; skip: number; take: number }) {
    const where = { projectId: input.projectId, folderId: input.folderId ?? null, ...(input.q ? { originalName: { contains: input.q, mode: 'insensitive' as const } } : {}) };
    return Promise.all([
      prisma.file.findMany({ where, orderBy: { updatedAt: 'desc' }, skip: input.skip, take: input.take, include: { uploadedBy: { select: { id: true, name: true } } } }),
      prisma.file.count({ where }),
    ]);
  },
  create(data: { projectId: string; folderId?: string | null; originalName: string; storedName: string; mimeType: string; size: bigint; storageKey: string; checksum?: string | null; uploadedById: string }) {
    return prisma.file.create({ data });
  },
  updateName(id: string, originalName: string) {
    return prisma.file.update({ where: { id }, data: { originalName } });
  },
  move(id: string, folderId: string | null) {
    return prisma.file.update({ where: { id }, data: { folderId } });
  },
  delete(id: string) {
    return prisma.file.delete({ where: { id } });
  },
};
