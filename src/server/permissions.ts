import { prisma } from '@/lib/db/prisma';

export type Actor = { id: string; role: 'ADMIN' | 'CUSTOMER' };

export function isAdmin(actor: Actor) {
  return actor.role === 'ADMIN';
}

export async function canViewProject(actor: Actor, projectId: string) {
  if (isAdmin(actor)) return true;
  const project = await prisma.project.findUnique({ where: { id: projectId }, select: { customerId: true } });
  return project?.customerId === actor.id;
}

export async function canManageProject(actor: Actor, projectId: string) {
  return isAdmin(actor) && Boolean(await prisma.project.findUnique({ where: { id: projectId }, select: { id: true } }));
}

export async function canViewFolder(actor: Actor, folderId: string) {
  const folder = await prisma.folder.findUnique({ where: { id: folderId }, select: { project: { select: { customerId: true } } } });
  return Boolean(folder && (isAdmin(actor) || folder.project.customerId === actor.id));
}

export async function canManageFolder(actor: Actor, folderId: string) {
  return isAdmin(actor) && Boolean(await prisma.folder.findUnique({ where: { id: folderId }, select: { id: true } }));
}

export async function canViewFile(actor: Actor, fileId: string) {
  const file = await prisma.file.findUnique({ where: { id: fileId }, select: { project: { select: { customerId: true } } } });
  return Boolean(file && (isAdmin(actor) || file.project.customerId === actor.id));
}

export async function canManageFile(actor: Actor, fileId: string) {
  return isAdmin(actor) && Boolean(await prisma.file.findUnique({ where: { id: fileId }, select: { id: true } }));
}

export async function canViewCustomer(actor: Actor, userId: string) {
  return isAdmin(actor) || actor.id === userId;
}

export async function canManageCustomer(actor: Actor) {
  return isAdmin(actor);
}
