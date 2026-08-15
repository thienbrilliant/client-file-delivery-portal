import { prisma } from '@/lib/db/prisma';
import type { NotificationType } from '@/generated/prisma/client';

export type CreateNotificationInput = {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  href?: string;
  idempotencyKey?: string;
};

export const NotificationService = {
  async create(input: CreateNotificationInput) {
    if (input.idempotencyKey) {
      const existing = await prisma.notification.findFirst({
        where: { userId: input.userId, type: input.type, href: input.idempotencyKey },
      });
      if (existing) return existing;
    }

    return prisma.notification.create({
      data: {
        userId: input.userId,
        type: input.type,
        title: input.title,
        message: input.message,
        href: input.href,
      },
    });
  },

  async listForUser(userId: string, take = 30) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: Math.min(Math.max(take, 1), 100),
    });
  },

  async unreadCount(userId: string) {
    return prisma.notification.count({ where: { userId, isRead: false } });
  },

  async markRead(userId: string, id: string) {
    return prisma.notification.updateMany({ where: { id, userId }, data: { isRead: true } });
  },

  async markAllRead(userId: string) {
    return prisma.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true } });
  },
};
