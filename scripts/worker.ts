import 'dotenv/config';
import { prisma } from '@/lib/db/prisma';
import { claimNextJob, completeJob, failJob } from '@/server/job-queue';
import { createEmailProvider, accountInvitationEmail, passwordResetEmail } from '@/server/email';
import { unsealSecret } from '@/lib/security/secret-box';
import { createStorageProvider } from '@/lib/storage';

const emailProvider = createEmailProvider();

async function processJob(job: NonNullable<Awaited<ReturnType<typeof claimNextJob>>>) {
  const payload = job.payload as Record<string, unknown>;
  if (job.type === 'SEND_INVITATION_EMAIL') {
    const token = unsealSecret(String(payload.sealedToken));
    const baseUrl = process.env.AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
    const email = accountInvitationEmail({ name: typeof payload.name === 'string' ? payload.name : null, activationUrl: `${baseUrl}/account/activate/${token}` });
    await emailProvider.send({ to: String(payload.email), ...email });
    return;
  }
  if (job.type === 'SEND_PASSWORD_RESET_EMAIL') {
    const token = unsealSecret(String(payload.sealedToken));
    const baseUrl = process.env.AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
    const email = passwordResetEmail({ name: typeof payload.name === 'string' ? payload.name : null, resetUrl: `${baseUrl}/account/reset-password/${token}` });
    await emailProvider.send({ to: String(payload.email), ...email });
    return;
  }
  if (job.type === 'DELETE_STORAGE_OBJECT') {
    await createStorageProvider().delete(String(payload.storageKey));
    return;
  }
  if (job.type === 'CLEAN_EXPIRED_INVITATIONS') {
    await prisma.accountInvitation.updateMany({ where: { usedAt: null, expiresAt: { lt: new Date() } }, data: { usedAt: new Date() } });
    return;
  }
  if (job.type === 'CLEAN_EXPIRED_UPLOADS') {
    await prisma.uploadSession.updateMany({ where: { expiresAt: { lt: new Date() }, status: { in: ['PENDING', 'UPLOADING'] } }, data: { status: 'EXPIRED' } });
    return;
  }
  throw new Error(`Unsupported job type: ${job.type}`);
}

async function main() {
  const once = process.argv.includes('--once');
  while (true) {
    const job = await claimNextJob();
    if (!job) {
      if (once) break;
      await new Promise((resolve) => setTimeout(resolve, 1_000));
      continue;
    }
    try {
      await processJob(job);
      await completeJob(job.id);
    } catch (error) {
      console.error(JSON.stringify({ event: 'job.failed', jobId: job.id, type: job.type, error: error instanceof Error ? error.message : 'unknown' }));
      await failJob(job.id, error);
    }
  }
}

main().finally(async () => prisma.$disconnect());
