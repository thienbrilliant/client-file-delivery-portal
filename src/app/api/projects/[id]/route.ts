import { z } from 'zod';
import { projectRepository } from '@/server/repositories/project-repository';
import { requireAdmin } from '@/server/require-auth';
import { AppError, errorResponse } from '@/server/errors';
import { logActivity } from '@/server/activity';

const schema = z.object({ name: z.string().trim().min(2).max(160), description: z.string().trim().max(4000).nullable().optional(), status: z.enum(['DRAFT','IN_PROGRESS','READY','ARCHIVED']).optional() });
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) { try { const actor = await requireAdmin(); const { id } = await params; const existing = await projectRepository.findById(id); if (!existing) throw new AppError('PROJECT_NOT_FOUND', 'Không tìm thấy dự án.', 404); const parsed = schema.safeParse(await request.json()); if (!parsed.success) throw new AppError('INVALID_FILE', parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ.'); const item = await projectRepository.update(id, parsed.data); await logActivity({ userId: actor.id, projectId: id, action: 'PROJECT_UPDATED', metadata: { name: item.name, status: item.status } }); return Response.json({ data: item, error: null }); } catch (error) { return errorResponse(error); } }
