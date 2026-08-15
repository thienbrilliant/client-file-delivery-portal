import { prisma } from '@/lib/db/prisma';

export type JobType = 'SEND_INVITATION_EMAIL' | 'SEND_PASSWORD_RESET_EMAIL' | 'DELETE_CUSTOMER_DATA' | 'DELETE_STORAGE_OBJECT' | 'CLEAN_EXPIRED_UPLOADS' | 'CLEAN_EXPIRED_INVITATIONS';

export async function enqueueJob(input: { type: JobType; payload: Record<string, unknown>; idempotencyKey: string; createdById?: string }) {
  return prisma.job.upsert({
    where: { idempotencyKey: input.idempotencyKey },
    update: {},
    create: { type: input.type, payload: input.payload, idempotencyKey: input.idempotencyKey, createdById: input.createdById },
  });
}

export async function claimNextJob() {
  const rows = await prisma.$queryRaw<Array<{ id: string }>>`
    UPDATE "Job"
    SET "status" = 'RUNNING', "attempts" = "attempts" + 1, "startedAt" = NOW(), "updatedAt" = NOW()
    WHERE "id" = (
      SELECT "id" FROM "Job"
      WHERE "status" = 'PENDING' AND "availableAt" <= NOW()
      ORDER BY "availableAt" ASC, "createdAt" ASC
      FOR UPDATE SKIP LOCKED
      LIMIT 1
    )
    RETURNING "id"
  `;
  if (!rows[0]) return null;
  return prisma.job.findUnique({ where: { id: rows[0].id } });
}

export async function completeJob(id: string) {
  return prisma.job.update({ where: { id }, data: { status: 'COMPLETED', completedAt: new Date(), lastError: null } });
}

export async function failJob(id: string, error: unknown) {
  const message = error instanceof Error ? error.message : 'Unknown job failure';
  const job = await prisma.job.findUnique({ where: { id }, select: { attempts: true, maxAttempts: true } });
  if (!job) return;
  const exhausted = job.attempts >= job.maxAttempts;
  return prisma.job.update({ where: { id }, data: { status: exhausted ? 'FAILED' : 'PENDING', availableAt: new Date(Date.now() + Math.min(60_000, 2 ** job.attempts * 1_000)), lastError: message } });
}
