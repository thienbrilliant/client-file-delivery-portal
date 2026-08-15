import { NextResponse } from 'next/server';
import { accountService } from '@/server/services/account-service';
import { enqueueJob } from '@/server/job-queue';
import { sealSecret } from '@/lib/security/secret-box';
import { requireAdmin } from '@/server/require-auth';
import { errorResponse } from '@/server/errors';
import { prisma } from '@/lib/db/prisma';

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const actor = await requireAdmin();
    const { id } = await params;
    const result = await accountService.createInvitation(id);
    const user = await prisma.user.findUnique({ where: { id }, select: { name: true } });
    await enqueueJob({
      type: 'SEND_INVITATION_EMAIL',
      idempotencyKey: `invitation:${id}:${result.expiresAt.toISOString()}`,
      createdById: actor.id,
      payload: { userId: id, email: result.email, name: user?.name, sealedToken: sealSecret(result.token) },
    });
    const baseUrl = process.env.AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
    return NextResponse.json({ data: { email: result.email, activationUrl: `${baseUrl}/account/activate/${result.token}`, expiresAt: result.expiresAt }, error: null });
  } catch (error) {
    return errorResponse(error);
  }
}
