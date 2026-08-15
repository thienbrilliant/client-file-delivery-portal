import { prisma } from '@/lib/db/prisma';

export async function logActivity(input: { userId?: string | null; projectId?: string | null; action: string; metadata?: Record<string, unknown> }) {
  return prisma.activityLog.create({ data: { userId: input.userId ?? null, projectId: input.projectId ?? null, action: input.action, metadata: input.metadata ?? undefined } });
}
