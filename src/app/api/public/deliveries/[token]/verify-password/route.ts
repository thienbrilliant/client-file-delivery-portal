import { cookies } from 'next/headers';
import { z } from 'zod';
import { getShareLinkForToken, verifySharePassword } from '@/server/delivery';
import { AppError, errorResponse } from '@/server/errors';
import { checkRateLimit } from '@/server/rate-limit';
import { createDeliveryAccessCookieValue, DELIVERY_ACCESS_COOKIE, DELIVERY_ACCESS_TTL } from '@/server/public-delivery';
import { prisma } from '@/lib/db/prisma';
import { logActivity } from '@/server/activity';

const schema = z.object({ password: z.string().min(1).max(200) });

export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params;
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
    if (!checkRateLimit(`delivery-password:${ip}:${token}`, 8, 60_000)) throw new AppError('INVALID_SHARE_PASSWORD', 'Bạn thử quá nhiều lần. Vui lòng thử lại sau.', 429);
    const body = schema.parse(await request.json());
    const link = await getShareLinkForToken(token);
    await verifySharePassword(link.id, body.password);
    const cookieStore = await cookies();
    cookieStore.set(DELIVERY_ACCESS_COOKIE, createDeliveryAccessCookieValue(link.id), { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: DELIVERY_ACCESS_TTL });
    await prisma.shareLink.update({ where: { id: link.id }, data: { lastAccessedAt: new Date() } });
    await logActivity({ projectId: link.delivery.projectId, action: 'PASSWORD_SUCCESS', metadata: { deliveryId: link.deliveryId, shareLinkId: link.id } });
    return Response.json({ data: { verified: true }, error: null });
  } catch (error) { return errorResponse(error); }
}
