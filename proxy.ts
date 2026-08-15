import { auth } from './auth';
import { prisma } from '@/lib/db/prisma';

export const proxy = auth(async (request) => {
  const userId = request.auth?.user?.id;
  if (!userId) return Response.redirect(new URL('/dang-nhap', request.url));
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { status: true, deletedAt: true, sessionVersion: true } });
  const cookieVersion = request.cookies.get('account-session-version')?.value;
  if (!user || user.deletedAt || user.status === 'INVITED' || user.status === 'SUSPENDED' || user.status === 'DISABLED') return Response.redirect(new URL('/dang-nhap?error=account-disabled', request.url));
  if (cookieVersion !== String(user.sessionVersion)) return Response.redirect(new URL('/dang-nhap?error=session-revoked', request.url));
});

export const config = { matcher: ['/((?!api/auth|api/account/activate|api/account/password-reset|api/health|api/public|_next/static|_next/image|favicon.ico|dang-nhap|account/activate|account/reset-password).*)'] };
