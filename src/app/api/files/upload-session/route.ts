import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { prisma } from '@/lib/db/prisma';
import { requireActor } from '@/server/require-auth';
import { canViewProject } from '@/server/permissions';
import { createStorageProvider } from '@/lib/storage';
import { S3StorageProvider } from '@/lib/storage/s3';
import { AppError, errorResponse } from '@/server/errors';

const schema = z.object({ projectId: z.string().min(1), originalName: z.string().trim().min(1).max(255), mimeType: z.string().trim().min(1).max(200), totalSize: z.number().int().positive().max(Number(process.env.MAX_FILE_SIZE ?? 1_073_741_824)) });

export async function POST(request: Request) {
  try {
    const actor = await requireActor();
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return Response.json({ data: null, error: { code: 'INVALID_INPUT', message: 'Thông tin upload không hợp lệ.' } }, { status: 400 });
    const input = parsed.data;
    if (!(await canViewProject(actor, input.projectId))) throw new AppError('FORBIDDEN', 'Bạn không có quyền truy cập dự án này.', 403);
    const project = await prisma.project.findUnique({ where: { id: input.projectId }, select: { customerUploadEnabled: true } });
    if (actor.role === 'CUSTOMER' && !project?.customerUploadEnabled) throw new AppError('FORBIDDEN', 'Dự án này chưa cho phép upload.', 403);
    const storage = createStorageProvider();
    if (!(storage instanceof S3StorageProvider)) throw new AppError('STORAGE_UNAVAILABLE', 'Upload trực tiếp vào storage chỉ khả dụng với S3-compatible storage.', 409);
    const chunkSize = 8 * 1024 * 1024;
    const storageKey = `uploads/${input.projectId}/${randomUUID()}-${input.originalName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const session = await prisma.uploadSession.create({ data: { projectId: input.projectId, userId: actor.id, storageKey, totalSize: BigInt(input.totalSize), mimeType: input.mimeType, originalName: input.originalName, chunkSize, status: 'UPLOADING', expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000) } });
    const uploadUrl = await storage.getSignedUploadUrl(storageKey, input.mimeType, 15 * 60);
    return Response.json({ data: { uploadSessionId: session.id, uploadUrl, storageKey: undefined, chunkSize, expiresAt: session.expiresAt }, error: null });
  } catch (error) { return errorResponse(error); }
}
