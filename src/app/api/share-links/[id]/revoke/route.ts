import { prisma } from '@/lib/db/prisma';
import { requireAdmin } from '@/server/require-auth';
import { AppError, errorResponse } from '@/server/errors';
import { logActivity } from '@/server/activity';

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { const actor = await requireAdmin(); const { id } = await params; const link = await prisma.shareLink.findUnique({ where: { id }, select: { id: true, deliveryId: true, isActive: true, delivery: { select: { projectId: true } } } }); if (!link) throw new AppError('SHARE_LINK_NOT_FOUND', 'Không tìm thấy link.', 404); await prisma.shareLink.update({ where: { id }, data: { isActive: false } }); await logActivity({ userId: actor.id, projectId: link.delivery.projectId, action: 'SHARE_LINK_REVOKED', metadata: { deliveryId: link.deliveryId, shareLinkId: id } }); return Response.json({ data: { id, isActive: false }, error: null }); } catch (error) { return errorResponse(error); }
}
