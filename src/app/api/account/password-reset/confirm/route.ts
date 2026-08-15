import { z } from 'zod';
import { hashPassword } from '@/lib/security/password';
import { accountService } from '@/server/services/account-service';
import { checkRateLimit } from '@/server/rate-limit';
import { errorResponse, AppError } from '@/server/errors';

const schema = z.object({ token: z.string().min(32).max(512), password: z.string().min(12).max(200) });

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (!checkRateLimit(`password-reset-confirm:${ip}`, 8, 15 * 60_000)) return errorResponse(new AppError('RATE_LIMITED', 'Bạn đã thử quá nhiều lần. Vui lòng thử lại sau.', 429));
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return Response.json({ data: null, error: { code: 'INVALID_INPUT', message: 'Mật khẩu phải có ít nhất 12 ký tự.' } }, { status: 400 });
    await accountService.resetPassword(parsed.data.token, await hashPassword(parsed.data.password));
    return Response.json({ data: { message: 'Mật khẩu đã được cập nhật.' }, error: null });
  } catch (error) {
    return errorResponse(error);
  }
}
