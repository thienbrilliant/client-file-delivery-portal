import { prisma } from '@/lib/db/prisma';

export const folderRepository = {
  findById(id: string) {
    return prisma.folder.findUnique({ where: { id }, include: { project: { select: { id: true, customerId: true } }, _count: { select: { children: true, files: true } } } });
  },
  listByProject(projectId: string, parentId?: string | null) {
    return prisma.folder.findMany({ where: { projectId, parentId: parentId ?? null }, orderBy: { name: 'asc' }, include: { _count: { select: { children: true, files: true } } } });
  },
  create(data: { projectId: string; parentId?: string | null; name: string }) {
    return prisma.folder.create({ data });
  },
  rename(id: string, name: string) {
    return prisma.folder.update({ where: { id }, data: { name } });
  },
  move(id: string, parentId: string | null) {
    return prisma.folder.update({ where: { id }, data: { parentId } });
  },
  delete(id: string) {
    return prisma.folder.delete({ where: { id } });
  },
};
