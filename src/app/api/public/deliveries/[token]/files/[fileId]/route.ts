import { cookies } from 'next/headers';
import { getShareLinkForToken, registerDownload } from '@/server/delivery';
import { verifyDeliveryAccessCookie, DELIVERY_ACCESS_COOKIE } from '@/server/public-delivery';
import { createStorageProvider } from '@/lib/storage';
import { AppError, errorResponse } from '@/server/errors';
import { logActivity } from '@/server/activity';

export async function GET(request: Request, { params }: { params: Promise<{ token: string; fileId: string }> }) {
  try {
    const { token, fileId } = await params;
    const link = await getShareLinkForToken(token);
    if (link.passwordHash) {
      const cookie = (await cookies()).get(DELIVERY_ACCESS_COOKIE)?.value;
      if (!verifyDeliveryAccessCookie(cookie, link.id)) throw new AppError('INVALID_SHARE_PASSWORD', 'Vui lòng xác thực mật khẩu trước.', 401);
    }
    const deliveryFile = link.delivery.files.find(({ file }) => file.id === fileId);
    if (!deliveryFile) throw new AppError('FILE_NOT_IN_DELIVERY', 'File này không thuộc bàn giao.', 404);
    const file = deliveryFile.file;
    const storage = createStorageProvider();
    if (!(await storage.exists(file.storageKey))) throw new AppError('FILE_NOT_FOUND', 'Không tìm thấy file.', 404);
    const stream = await storage.download(file.storageKey);
    await registerDownload({ shareLinkId: link.id, fileId: file.id, ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim(), userAgent: request.headers.get('user-agent') });
    await prismaDeliveryDownloadActivity(link.delivery.projectId, link.deliveryId, link.id, file.id, file.originalName);
    return new Response(stream, { headers: { 'Content-Type': file.mimeType, 'Content-Length': file.size.toString(), 'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(file.originalName)}`, 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff' } });
  } catch (error) { return errorResponse(error); }
}

async function prismaDeliveryDownloadActivity(projectId: string, deliveryId: string, shareLinkId: string, fileId: string, fileName: string) {
  await logActivity({ projectId, action: 'DELIVERY_DOWNLOAD', metadata: { deliveryId, shareLinkId, fileId, fileName } });
}
