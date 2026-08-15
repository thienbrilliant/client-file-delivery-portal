import { cookies } from 'next/headers';
import { getShareLinkForToken } from '@/server/delivery';
import { verifyDeliveryAccessCookie, DELIVERY_ACCESS_COOKIE } from '@/server/public-delivery';
import { createStorageProvider } from '@/lib/storage';
import { AppError, errorResponse } from '@/server/errors';

const PREVIEW_MIME_TYPES = new Set(['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'image/webp']);

export async function GET(_request: Request, { params }: { params: Promise<{ token: string; fileId: string }> }) {
  try { const { token, fileId } = await params; const link = await getShareLinkForToken(token); if (link.passwordHash && !verifyDeliveryAccessCookie((await cookies()).get(DELIVERY_ACCESS_COOKIE)?.value, link.id)) throw new AppError('INVALID_SHARE_PASSWORD', 'Vui lòng xác thực mật khẩu trước.', 401); const membership = link.delivery.files.find(({ file }) => file.id === fileId); if (!membership) throw new AppError('FILE_NOT_IN_DELIVERY', 'File này không thuộc bàn giao.', 404); const file = membership.file; if (!PREVIEW_MIME_TYPES.has(file.mimeType)) throw new AppError('DOWNLOAD_NOT_ALLOWED', 'File này không hỗ trợ xem trước.', 415); const storage = createStorageProvider(); if (!(await storage.exists(file.storageKey))) throw new AppError('FILE_NOT_FOUND', 'Không tìm thấy file.', 404); const stream = await storage.download(file.storageKey); return new Response(stream, { headers: { 'Content-Type': file.mimeType, 'Content-Length': file.size.toString(), 'Content-Disposition': `inline; filename*=UTF-8''${encodeURIComponent(file.originalName)}`, 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff' } }); } catch (error) { return errorResponse(error); }
}
