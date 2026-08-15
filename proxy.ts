import { auth } from './auth';
import { prisma } from '@/lib/db/prisma';

export const proxy = auth(async (request) => {
  const userId = request.auth?.user?.id;
  if (!userId) return Response.redirect(new URL('/dang-nhap', request.url));
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { status: true, deletedAt: true } });
  if (!user || user.deletedAt || user.status === 'SUSPENDED' || user.status === 'DISABLED') return Response.redirect(new URL('/dang-nhap?error=account-disabled', request.url));
});

export const config = { matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico|dang-nhap|account/activate|account/reset-password).*)'] };
