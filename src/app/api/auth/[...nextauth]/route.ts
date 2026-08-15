import { NextResponse } from 'next/server';
import { handlers } from '../../../../../auth';
import { prisma } from '@/lib/db/prisma';

export const GET = handlers.GET;

export async function POST(request: Request) {
  let loginEmail: string | null = null;
  const contentType = request.headers.get('content-type') ?? '';
  if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
    try {
      const form = await request.clone().formData();
      const email = form.get('email');
      if (typeof email === 'string') loginEmail = email.trim().toLowerCase();
      if (loginEmail) {
        const user = await prisma.user.findUnique({ where: { email: loginEmail }, select: { status: true, deletedAt: true } });
        if (user && (user.deletedAt || user.status === 'INVITED' || user.status === 'SUSPENDED' || user.status === 'DISABLED')) return Response.redirect(new URL('/dang-nhap?error=account-disabled', request.url), 303);
      }
    } catch {
      // Let NextAuth handle malformed authentication requests.
    }
  }
  const response = await handlers.POST(request);
  if (!loginEmail || response.status < 200 || response.status >= 400) return response;
  const user = await prisma.user.findUnique({ where: { email: loginEmail }, select: { sessionVersion: true, status: true, deletedAt: true } });
  if (!user || user.deletedAt || user.status !== 'ACTIVE') return response;
  const nextResponse = new NextResponse(response.body, { status: response.status, statusText: response.statusText, headers: response.headers });
  nextResponse.cookies.set('account-session-version', String(user.sessionVersion), { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 30 });
  return nextResponse;
}
