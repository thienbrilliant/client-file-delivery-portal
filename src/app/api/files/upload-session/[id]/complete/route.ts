import { z } from 'zod';
import { prisma } from '@/lib/db/prisma';
import { fileRepository } from '@/server/repositories/file-repository';
import { requireActor } from '@/server/require-auth';
import { canViewProject } from '@/server/permissions';
import { createStorageProvider } from '@/lib/storage';
import { logActivity } from '@/server/activity';
import { AppError, errorResponse } from '@/server/errors';

const schema = z.object({ folderId: z.string().min(1).nullable().optional(), checksum: z.string().trim().max(128).optional() });

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const actor = await requireActor();
    const { id } = await params;
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return Response.json({ data: null, error: { code: 'INVALID_INPUT', message: 'Dữ liệu hoàn tất upload không hợp lệ.' } }, { status: 400 });
    const session = await prisma.uploadSession.findUnique({ where: { id } });
    if (!session || session.userId !== actor.id || session.expiresAt <= new Date() || session.status !== 'UPLOADING') throw new AppError('FORBIDDEN', 'Upload session không hợp lệ.', 403);
    if (!(await canViewProject(actor, session.projectId))) throw new AppError('FORBIDDEN', 'Bạn không có quyền với dự án này.', 403);
    if (parsed.data.folderId) {
      const folder = await prisma.folder.findUnique({ where: { id: parsed.data.folderId }, select: { projectId: true } });
      if (!folder || folder.projectId !== session.projectId) throw new AppError('INVALID_FOLDER', 'Thư mục không thuộc dự án này.');
    }
    const storage = createStorageProvider();
    if (!(await storage.exists(session.storageKey))) throw new AppError('FILE_NOT_FOUND', 'Storage chưa nhận được file.', 409);
    const file = await fileRepository.create({ projectId: session.projectId, folderId: parsed.data.folderId ?? null, originalName: session.originalName, storedName: session.originalName, mimeType: session.mimeType, size: session.totalSize, storageKey: session.storageKey, checksum: parsed.data.checksum ?? null, uploadedById: actor.id });
    await prisma.uploadSession.update({ where: { id }, data: { status: 'COMPLETED', uploadedSize: session.totalSize } });
    await logActivity({ userId: actor.id, projectId: session.projectId, action: 'FILE_UPLOADED', metadata: { fileId: file.id, fileName: file.originalName, uploadSessionId: id } });
    return Response.json({ data: file, error: null }, { status: 201 });
  } catch (error) { return errorResponse(error); }
}
