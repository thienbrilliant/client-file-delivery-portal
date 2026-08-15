import { z } from 'zod';
import { accountService } from '@/server/services/account-service';
import { enqueueJob } from '@/server/job-queue';
import { sealSecret } from '@/lib/security/secret-box';
import { checkRateLimit } from '@/server/rate-limit';
import { errorResponse, AppError } from '@/server/errors';
import { prisma } from '@/lib/db/prisma';

const schema = z.object({ email: z.string().trim().email().max(254) });

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (!checkRateLimit(`password-reset:${ip}`, 5, 15 * 60_000)) return errorResponse(new AppError('RATE_LIMITED', 'Bạn đã thử quá nhiều lần. Vui lòng thử lại sau.', 429));
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return Response.json({ data: null, error: { code: 'INVALID_INPUT', message: 'Email không hợp lệ.' } }, { status: 400 });
    const result = await accountService.requestPasswordReset(parsed.data.email);
    if (result) {
      const user = await prisma.user.findUnique({ where: { email: result.email }, select: { id: true, name: true } });
      if (user) {
        await enqueueJob({ type: 'SEND_PASSWORD_RESET_EMAIL', idempotencyKey: `password-reset:${user.id}:${result.expiresAt.toISOString()}`, payload: { userId: user.id, email: result.email, name: user.name, sealedToken: sealSecret(result.token) } });
      }
    }
    return Response.json({ data: { message: 'Nếu tài khoản tồn tại, chúng tôi đã gửi hướng dẫn đến email này.' }, error: null });
  } catch (error) {
    return errorResponse(error);
  }
}
