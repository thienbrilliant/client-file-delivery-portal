import { createHash, randomBytes } from 'node:crypto';
import { prisma } from '@/lib/db/prisma';
import { hashPassword, verifyPassword } from '@/lib/security/password';
import { AppError } from '@/server/errors';
import type { Prisma } from '@/generated/prisma/client';

export const TOKEN_BYTES = 32;
export function createShareToken() { return randomBytes(TOKEN_BYTES).toString('base64url'); }
export function hashShareToken(token: string) { return createHash('sha256').update(token, 'utf8').digest('hex'); }
export function createSharePassword() { return randomBytes(12).toString('base64url'); }

export function assertShareLinkActive(link: { isActive: boolean; expiresAt: Date | null; maxDownloads: number | null; downloadCount: number }) {
  const now = new Date();
  if (!link.isActive) throw new AppError('SHARE_LINK_REVOKED', 'Link này không còn hoạt động.', 410);
  if (link.expiresAt && link.expiresAt <= now) throw new AppError('SHARE_LINK_EXPIRED', 'Link này đã hết hạn.', 410);
  if (link.maxDownloads !== null && link.downloadCount >= link.maxDownloads) throw new AppError('SHARE_LINK_LIMIT_REACHED', 'Link đã đạt giới hạn tải xuống.', 410);
}

export async function createDelivery(input: { projectId: string; title: string; description?: string | null; expiresAt?: Date | null; fileIds: string[] }) {
  const title = input.title.trim();
  if (!title) throw new AppError('DELIVERY_NOT_FOUND', 'Tên bàn giao không được để trống.');
  const fileIds = [...new Set(input.fileIds)];
  if (!fileIds.length) throw new AppError('FILE_NOT_IN_DELIVERY', 'Bàn giao phải có ít nhất một file.');
  return prisma.$transaction(async (tx) => {
    const project = await tx.project.findUnique({ where: { id: input.projectId }, select: { id: true } });
    if (!project) throw new AppError('PROJECT_NOT_FOUND', 'Không tìm thấy dự án.', 404);
    const files = await tx.file.findMany({ where: { id: { in: fileIds }, projectId: input.projectId }, select: { id: true } });
    if (files.length !== fileIds.length) throw new AppError('FILE_NOT_IN_DELIVERY', 'Một hoặc nhiều file không thuộc dự án này.', 400);
    return tx.delivery.create({ data: { projectId: input.projectId, title, description: input.description?.trim() || null, expiresAt: input.expiresAt ?? null, files: { create: fileIds.map((fileId) => ({ fileId })) } }, include: { files: { include: { file: true } }, project: { select: { id: true, name: true, customer: { select: { name: true, email: true } } } } } });
  });
}

export async function createShareLink(input: { deliveryId: string; password?: string | null; expiresAt?: Date | null; maxDownloads?: number | null }, db: Prisma.TransactionClient | typeof prisma = prisma) {
  const token = createShareToken();
  const delivery = await db.delivery.findUnique({ where: { id: input.deliveryId }, select: { id: true } });
  if (!delivery) throw new AppError('DELIVERY_NOT_FOUND', 'Không tìm thấy bàn giao.', 404);
  const link = await db.shareLink.create({ data: { deliveryId: input.deliveryId, tokenHash: hashShareToken(token), passwordHash: input.password ? await hashPassword(input.password) : null, expiresAt: input.expiresAt ?? null, maxDownloads: input.maxDownloads ?? null } });
  return { link, token };
}

export async function getShareLinkForToken(token: string) {
  if (!token || token.length > 128) throw new AppError('SHARE_LINK_NOT_FOUND', 'Link không hợp lệ.', 404);
  const link = await prisma.shareLink.findUnique({ where: { tokenHash: hashShareToken(token) }, include: { delivery: { include: { project: { select: { id: true, name: true, customer: { select: { name: true, email: true } } } }, files: { include: { file: true } } } } } });
  if (!link) throw new AppError('SHARE_LINK_NOT_FOUND', 'Link không hợp lệ.', 404);
  assertShareLinkActive(link);
  return link;
}

export async function verifySharePassword(linkId: string, password: string) {
  const link = await prisma.shareLink.findUnique({ where: { id: linkId }, select: { passwordHash: true, isActive: true, expiresAt: true, maxDownloads: true, downloadCount: true } });
  if (!link) throw new AppError('SHARE_LINK_NOT_FOUND', 'Link không hợp lệ.', 404);
  assertShareLinkActive(link);
  if (!link.passwordHash || !(await verifyPassword(link.passwordHash, password))) throw new AppError('INVALID_SHARE_PASSWORD', 'Mật khẩu không đúng.', 401);
  return true;
}

export async function registerDownload(input: { shareLinkId: string; fileId: string; ipAddress?: string | null; userAgent?: string | null; userId?: string | null }) {
  return prisma.$transaction(async (tx) => {
    const updated = await tx.$executeRaw`
      UPDATE "ShareLink"
      SET "downloadCount" = "downloadCount" + 1, "lastAccessedAt" = NOW()
      WHERE "id" = ${input.shareLinkId}
        AND "isActive" = true
        AND ("expiresAt" IS NULL OR "expiresAt" > NOW())
        AND ("maxDownloads" IS NULL OR "downloadCount" < "maxDownloads")
    `;
    if (updated !== 1) {
      const link = await tx.shareLink.findUnique({ where: { id: input.shareLinkId }, select: { isActive: true, expiresAt: true, maxDownloads: true, downloadCount: true } });
      if (!link) throw new AppError('SHARE_LINK_NOT_FOUND', 'Link không hợp lệ.', 404);
      assertShareLinkActive(link);
      throw new AppError('DOWNLOAD_NOT_ALLOWED', 'Không thể tải file này.', 403);
    }
    await tx.downloadLog.create({ data: { fileId: input.fileId, shareLinkId: input.shareLinkId, userId: input.userId ?? null, ipAddress: input.ipAddress ?? null, userAgent: input.userAgent ?? null } });
  });
}
