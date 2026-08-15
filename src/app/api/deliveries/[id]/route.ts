import { z } from 'zod';
import { prisma } from '@/lib/db/prisma';
import { requireAdmin } from '@/server/require-auth';
import { AppError, errorResponse } from '@/server/errors';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { await requireAdmin(); const { id } = await params; const delivery = await prisma.delivery.findUnique({ where: { id }, include: { project: { select: { id: true, name: true, customer: { select: { name: true, email: true } } } }, files: { include: { file: { select: { id: true, originalName: true, mimeType: true, size: true, projectId: true } } } }, shareLinks: { orderBy: { createdAt: 'desc' }, select: { id: true, expiresAt: true, maxDownloads: true, downloadCount: true, isActive: true, lastAccessedAt: true, createdAt: true, passwordHash: false } } } }); if (!delivery) throw new AppError('DELIVERY_NOT_FOUND', 'Không tìm thấy bàn giao.', 404); return Response.json({ data: delivery, error: null }); } catch (error) { return errorResponse(error); }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { await requireAdmin(); const { id } = await params; const body = z.object({ title: z.string().trim().min(1).max(200).optional(), description: z.string().max(2000).nullable().optional(), expiresAt: z.string().datetime().nullable().optional() }).parse(await request.json()); const delivery = await prisma.delivery.update({ where: { id }, data: { title: body.title, description: body.description, expiresAt: body.expiresAt === undefined ? undefined : body.expiresAt ? new Date(body.expiresAt) : null } }); return Response.json({ data: delivery, error: null }); } catch (error) { return errorResponse(error); }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { await requireAdmin(); const { id } = await params; const delivery = await prisma.delivery.update({ where: { id }, data: { status: 'REVOKED', shareLinks: { updateMany: { where: { isActive: true }, data: { isActive: false } } } } }); return Response.json({ data: { id: delivery.id }, error: null }); } catch (error) { return errorResponse(error); }
}
