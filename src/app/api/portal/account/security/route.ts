import { prisma } from '@/lib/db/prisma';
import { auth } from '../../../../../../auth';

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ data: null, error: { code: 'FORBIDDEN', message: 'Bạn cần đăng nhập.' } }, { status: 401 });
  await prisma.$transaction(async tx => {
    await tx.user.update({ where: { id: session.user.id }, data: { sessionVersion: { increment: 1 } } });
    await tx.session.deleteMany({ where: { userId: session.user.id } });
    await tx.activityLog.create({ data: { userId: session.user.id, action: 'CUSTOMER_SESSIONS_REVOKED_SELF' } });
  });
  return Response.json({ data: { ok: true }, error: null });
}
