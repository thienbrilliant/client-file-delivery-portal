import { prisma } from '@/lib/db/prisma';
import { getShareLinkForToken } from '@/server/delivery';
import { AppError, errorResponse } from '@/server/errors';
import { logActivity } from '@/server/activity';

export async function GET(request: Request, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params;
    const link = await getShareLinkForToken(token);
    if (link.passwordHash) return Response.json({ data: { requiresPassword: true }, error: null }, { status: 401 });
    const delivery = await prisma.delivery.update({ where: { id: link.deliveryId }, data: { status: link.delivery.status === 'PREPARING' || link.delivery.status === 'READY' ? 'VIEWED' : undefined } });
    await prisma.shareLink.update({ where: { id: link.id }, data: { lastAccessedAt: new Date() } });
    await logActivity({ projectId: link.delivery.projectId, action: 'DELIVERY_VIEWED', metadata: { deliveryId: link.deliveryId, shareLinkId: link.id } });
    return Response.json({ data: { id: delivery.id, title: delivery.title, description: delivery.description, status: delivery.status, expiresAt: link.expiresAt, maxDownloads: link.maxDownloads, downloadCount: link.downloadCount, files: link.delivery.files.map(({ file }) => ({ id: file.id, originalName: file.originalName, mimeType: file.mimeType, size: file.size.toString() })), customer: link.delivery.project.customer }, error: null });
  } catch (error) { return errorResponse(error); }
}
