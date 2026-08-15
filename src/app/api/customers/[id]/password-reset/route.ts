import { requireAdmin } from '@/server/require-auth';
import { prisma } from '@/lib/db/prisma';
import { accountService } from '@/server/services/account-service';
import { enqueueJob } from '@/server/job-queue';
import { sealSecret } from '@/lib/security/secret-box';
import { errorResponse } from '@/server/errors';

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const actor = await requireAdmin();
    const { id } = await params;
    const user = await prisma.user.findUnique({ where: { id, role: 'CUSTOMER' }, select: { id: true, email: true, name: true } });
    if (!user) return Response.json({ data: null, error: { code: 'CUSTOMER_NOT_FOUND', message: 'Không tìm thấy khách hàng.' } }, { status: 404 });
    const result = await accountService.requestPasswordReset(user.email);
    if (!result) return Response.json({ data: null, error: { code: 'CUSTOMER_NOT_FOUND', message: 'Không thể tạo yêu cầu đặt lại mật khẩu.' } }, { status: 404 });
    await enqueueJob({ type: 'SEND_PASSWORD_RESET_EMAIL', idempotencyKey: `password-reset:${user.id}:${result.expiresAt.toISOString()}`, createdById: actor.id, payload: { userId: user.id, email: user.email, name: user.name, sealedToken: sealSecret(result.token) } });
    return Response.json({ data: { email: user.email, expiresAt: result.expiresAt }, error: null });
  } catch (error) { return errorResponse(error); }
}
