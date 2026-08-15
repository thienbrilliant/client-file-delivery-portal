import { handlers } from '../../../../../auth';
import { prisma } from '@/lib/db/prisma';

export const GET = handlers.GET;

export async function POST(request: Request) {
  const contentType = request.headers.get('content-type') ?? '';
  if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
    const clone = request.clone();
    try {
      const form = await clone.formData();
      const email = form.get('email');
      if (typeof email === 'string') {
        const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() }, select: { status: true, deletedAt: true } });
        if (user && (user.deletedAt || user.status === 'SUSPENDED' || user.status === 'DISABLED')) return Response.redirect(new URL('/dang-nhap?error=account-disabled', request.url), 303);
      }
    } catch {
      // Let NextAuth handle malformed authentication requests.
    }
  }
  return handlers.POST(request);
}
