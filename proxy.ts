import { auth } from './auth';
import { prisma } from '@/lib/db/prisma';

export const proxy = auth(async (request) => {
  const pathname = request.nextUrl.pathname;
  if (pathname === '/' || pathname === '/dang-ky') return;

  const isStateChanging = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method);
  if (isStateChanging && pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin');
    const configuredOrigin = process.env.AUTH_URL || process.env.NEXT_PUBLIC_APP_URL;
    if (origin && configuredOrigin && origin !== new URL(configuredOrigin).origin) {
      return new Response(JSON.stringify({ data: null, error: { code: 'CSRF_REJECTED', message: 'Yêu cầu không hợp lệ.' } }), { status: 403, headers: { 'Content-Type': 'application/json' } });
    }
  }

  const userId = request.auth?.user?.id;
  if (!userId) return Response.redirect(new URL('/dang-nhap', request.url));

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { status: true, deletedAt: true } });
  if (!user || user.deletedAt || user.status === 'INVITED' || user.status === 'SUSPENDED' || user.status === 'DISABLED') {
    return Response.redirect(new URL('/dang-nhap?error=account-disabled', request.url));
  }
});

export const config = { matcher: ['/((?!api/auth|api/account/activate|api/account/password-reset|api/auth/register|api/health|api/public|_next/static|_next/image|favicon.ico|dang-nhap|dang-ky|account/activate|account/reset-password|delivery).*)'] };
