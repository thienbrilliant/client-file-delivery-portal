import { prisma } from '@/lib/db/prisma';
import { createSecureToken, hashToken } from '@/lib/security/tokens';
import { AppError } from '@/server/errors';

const INVITATION_TTL_MS = Number(process.env.INVITATION_TTL_HOURS ?? 48) * 60 * 60 * 1000;
const RESET_TTL_MS = Number(process.env.PASSWORD_RESET_TTL_MINUTES ?? 60) * 60 * 1000;

export const accountService = {
  async createInvitation(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, status: true, deletedAt: true } });
    if (!user || user.deletedAt) throw new AppError('CUSTOMER_NOT_FOUND', 'Không tìm thấy khách hàng.', 404);
    if (user.status === 'DISABLED') throw new AppError('FORBIDDEN', 'Tài khoản đã bị vô hiệu hóa.', 409);
    const { token, tokenHash } = { token: createSecureToken(), tokenHash: '' };
    const hashed = hashToken(token);
    await prisma.$transaction(async (tx) => {
      await tx.accountInvitation.updateMany({ where: { userId, usedAt: null }, data: { usedAt: new Date() } });
      await tx.accountInvitation.create({ data: { userId, tokenHash: hashed, expiresAt: new Date(Date.now() + INVITATION_TTL_MS) } });
      await tx.user.update({ where: { id: userId }, data: { status: 'INVITED', passwordHash: null, sessionVersion: { increment: 1 } } });
    });
    return { token, email: user.email, expiresAt: new Date(Date.now() + INVITATION_TTL_MS) };
  },

  async activateInvitation(token: string, passwordHash: string) {
    const invitation = await prisma.accountInvitation.findUnique({ where: { tokenHash: hashToken(token) }, include: { user: true } });
    if (!invitation || invitation.usedAt || invitation.expiresAt <= new Date()) throw new AppError('INVALID_INVITATION', 'Liên kết kích hoạt không hợp lệ hoặc đã hết hạn.', 400);
    if (invitation.user.deletedAt || invitation.user.status === 'DISABLED') throw new AppError('FORBIDDEN', 'Tài khoản không thể kích hoạt.', 403);
    await prisma.$transaction([
      prisma.accountInvitation.update({ where: { id: invitation.id }, data: { usedAt: new Date() } }),
      prisma.user.update({ where: { id: invitation.userId }, data: { passwordHash, status: 'ACTIVE', emailVerified: new Date(), sessionVersion: { increment: 1 } } }),
      prisma.activityLog.create({ data: { userId: invitation.userId, action: 'CUSTOMER_ACTIVATED' } }),
    ]);
    return { id: invitation.user.id, email: invitation.user.email };
  },

  async requestPasswordReset(email: string) {
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() }, select: { id: true, email: true, status: true, deletedAt: true } });
    if (!user || user.deletedAt || user.status === 'DISABLED') return null;
    const token = createSecureToken();
    const expiresAt = new Date(Date.now() + RESET_TTL_MS);
    await prisma.$transaction(async (tx) => {
      await tx.passwordResetToken.updateMany({ where: { userId: user.id, usedAt: null }, data: { usedAt: new Date() } });
      await tx.passwordResetToken.create({ data: { userId: user.id, tokenHash: hashToken(token), expiresAt } });
      await tx.user.update({ where: { id: user.id }, data: { sessionVersion: { increment: 1 } } });
      await tx.activityLog.create({ data: { userId: user.id, action: 'CUSTOMER_PASSWORD_RESET_REQUESTED' } });
    });
    return { token, email: user.email, expiresAt };
  },

  async resetPassword(token: string, passwordHash: string) {
    const item = await prisma.passwordResetToken.findUnique({ where: { tokenHash: hashToken(token) } });
    if (!item || item.usedAt || item.expiresAt <= new Date()) throw new AppError('INVALID_RESET_TOKEN', 'Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.', 400);
    await prisma.$transaction([
      prisma.passwordResetToken.update({ where: { id: item.id }, data: { usedAt: new Date() } }),
      prisma.user.update({ where: { id: item.userId }, data: { passwordHash, status: 'ACTIVE', sessionVersion: { increment: 1 } } }),
      prisma.activityLog.create({ data: { userId: item.userId, action: 'CUSTOMER_PASSWORD_RESET' } }),
    ]);
  },

  async setStatus(userId: string, status: 'SUSPENDED' | 'ACTIVE' | 'DISABLED', actorId: string) {
    if (userId === actorId) throw new AppError('FORBIDDEN', 'Bạn không thể thay đổi trạng thái tài khoản của chính mình.', 400);
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, role: true, status: true } });
    if (!user || user.role !== 'CUSTOMER') throw new AppError('CUSTOMER_NOT_FOUND', 'Không tìm thấy khách hàng.', 404);
    const next = await prisma.user.update({ where: { id: userId }, data: { status, sessionVersion: { increment: 1 } } });
    await prisma.activityLog.create({ data: { userId, action: `CUSTOMER_${status}`, metadata: { actorId } } });
    return next;
  },

  async revokeSessions(userId: string, actorId: string) {
    if (userId === actorId) throw new AppError('FORBIDDEN', 'Bạn không thể thu hồi phiên của chính mình bằng thao tác này.', 400);
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.update({ where: { id: userId }, data: { sessionVersion: { increment: 1 } }, select: { sessionVersion: true } });
      const sessions = await tx.session.deleteMany({ where: { userId } });
      await tx.activityLog.create({ data: { userId, action: 'CUSTOMER_SESSIONS_REVOKED', metadata: { actorId } } });
      return { deletedSessions: sessions.count, sessionVersion: user.sessionVersion };
    });
    return result;
  },

  async softDelete(userId: string, actorId: string) {
    if (userId === actorId) throw new AppError('FORBIDDEN', 'Bạn không thể xóa tài khoản của chính mình.', 400);
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, role: true } });
    if (!user || user.role !== 'CUSTOMER') throw new AppError('CUSTOMER_NOT_FOUND', 'Không tìm thấy khách hàng.', 404);
    await prisma.$transaction(async (tx) => {
      await tx.user.update({ where: { id: userId }, data: { status: 'DISABLED', deletedAt: new Date(), sessionVersion: { increment: 1 } } });
      await tx.session.deleteMany({ where: { userId } });
      await tx.activityLog.create({ data: { userId, action: 'CUSTOMER_DELETE_REQUESTED', metadata: { actorId } } });
    });
    return { id: userId, status: 'DISABLED' as const };
  },
};
