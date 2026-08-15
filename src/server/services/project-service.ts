import { projectRepository } from '@/server/repositories/project-repository';
import { prisma } from '@/lib/db/prisma';
import { AppError } from '@/server/errors';
import { logActivity } from '@/server/activity';
import type { Actor } from '@/server/permissions';

type ProjectInput = { name?: string; description?: string | null; status?: 'DRAFT'|'IN_PROGRESS'|'READY'|'ARCHIVED'; customerUploadEnabled?: boolean };
export const projectService = {
  async create(actor: Actor, input: { customerId: string; name: string; description?: string; status?: 'DRAFT'|'IN_PROGRESS'|'READY'|'ARCHIVED'; customerUploadEnabled?: boolean }) {
    if (actor.role !== 'ADMIN') throw new AppError('FORBIDDEN', 'Bạn không có quyền tạo dự án.', 403);
    const customer = await prisma.user.findFirst({ where: { id: input.customerId, role: 'CUSTOMER' }, select: { id: true } });
    if (!customer) throw new AppError('CUSTOMER_NOT_FOUND', 'Không tìm thấy khách hàng.', 404);
    const item = await projectRepository.create(input); await logActivity({ userId: actor.id, projectId: item.id, action: 'PROJECT_CREATED', metadata: { name: item.name } }); return item;
  },
  async update(actor: Actor, projectId: string, input: ProjectInput) {
    if (actor.role !== 'ADMIN') throw new AppError('FORBIDDEN', 'Bạn không có quyền sửa dự án.', 403);
    if (!(await projectRepository.findById(projectId))) throw new AppError('PROJECT_NOT_FOUND', 'Không tìm thấy dự án.', 404);
    const item = await projectRepository.update(projectId, input); await logActivity({ userId: actor.id, projectId, action: 'PROJECT_UPDATED', metadata: { name: item.name, status: item.status, customerUploadEnabled: item.customerUploadEnabled } }); return item;
  },
};
