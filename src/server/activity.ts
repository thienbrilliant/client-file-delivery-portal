import { prisma } from '@/lib/db/prisma';
import type { Prisma } from '@/generated/prisma/client';

type ActivityMetadata = Prisma.InputJsonObject;

export async function logActivity(input: {
  userId?: string | null;
  projectId?: string | null;
  action: string;
  metadata?: ActivityMetadata;
}) {
  return prisma.activityLog.create({
    data: {
      userId: input.userId ?? null,
      projectId: input.projectId ?? null,
      action: input.action,
      metadata: input.metadata,
    },
  });
}
