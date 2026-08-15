import { auth } from '../../auth';
import { AppError } from './errors';

export async function requireActor() {
  const session = await auth();
  if (!session?.user) throw new AppError('FORBIDDEN', 'Bạn không có quyền truy cập nội dung này.', 403);
  return { id: session.user.id, role: session.user.role } as const;
}

export async function requireAdmin() {
  const actor = await requireActor();
  if (actor.role !== 'ADMIN') throw new AppError('FORBIDDEN', 'Bạn không có quyền thực hiện thao tác này.', 403);
  return actor;
}
