import { prisma } from '@/lib/db/prisma';
import { requireAdmin } from '@/server/require-auth';
import { AppError, errorResponse } from '@/server/errors';

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string; fileId: string }> }) {
  try { await requireAdmin(); const { id, fileId } = await params; const membership = await prisma.deliveryFile.findUnique({ where: { deliveryId_fileId: { deliveryId: id, fileId } }, select: { id: true } }); if (!membership) throw new AppError('FILE_NOT_IN_DELIVERY', 'File không thuộc bàn giao.', 404); await prisma.deliveryFile.delete({ where: { id: membership.id } }); return Response.json({ data: { fileId }, error: null }); } catch (error) { return errorResponse(error); }
}
