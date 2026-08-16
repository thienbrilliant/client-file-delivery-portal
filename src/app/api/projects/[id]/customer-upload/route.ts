import crypto from 'node:crypto';
import { requireActor } from '@/server/require-auth';
import { canViewProject } from '@/server/permissions';
import { prisma } from '@/lib/db/prisma';
import { fileRepository } from '@/server/repositories/file-repository';
import { createStorageProvider } from '@/lib/storage';
import { AppError, errorResponse } from '@/server/errors';
import { logActivity } from '@/server/activity';
import { NotificationService } from '@/server/notification-service';

const MAX_FILE_SIZE = Number(process.env.MAX_FILE_SIZE ?? 52428800);
const MAX_FILES = Math.min(10, Number(process.env.MAX_FILES_PER_UPLOAD ?? 20));
const BLOCKED_EXTENSIONS = new Set(['.exe', '.bat', '.cmd', '.ps1', '.sh']);
function validateName(value: string) { const name = value.trim(); if (!name || name.length > 255 || name.includes('\0') || name === '.' || name === '..') throw new AppError('INVALID_FILE', 'Tên file không hợp lệ.'); return name; }

type CreatedFile = { id: string; size: string };

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const actor = await requireActor(); const { id: projectId } = await params;
    if (!(await canViewProject(actor, projectId))) throw new AppError('FORBIDDEN', 'Bạn không có quyền truy cập dự án này.', 403);
    const project = await prisma.project.findUnique({ where: { id: projectId }, select: { customerId: true, customerUploadEnabled: true, name: true, customer: { select: { name: true } } } });
    if (!project || project.customerId !== actor.id || !project.customerUploadEnabled) throw new AppError('FORBIDDEN', 'Dự án này chưa cho phép khách hàng gửi file.', 403);
    const form = await request.formData(); const entries = form.getAll('files').filter((value): value is File => value instanceof File);
    if (!entries.length) throw new AppError('INVALID_FILE', 'Chưa chọn file.'); if (entries.length > MAX_FILES) throw new AppError('INVALID_FILE', `Chỉ được gửi tối đa ${MAX_FILES} file mỗi lần.`);
    const storage = createStorageProvider(); const created: CreatedFile[] = [];
    for (const file of entries) {
      if (file.size > MAX_FILE_SIZE) throw new AppError('FILE_TOO_LARGE', `File ${file.name} vượt quá giới hạn kích thước.`);
      const originalName = validateName(file.name); const ext = originalName.includes('.') ? originalName.slice(originalName.lastIndexOf('.')).toLowerCase() : '';
      if (BLOCKED_EXTENSIONS.has(ext)) throw new AppError('INVALID_FILE', `Không cho phép tải lên loại file ${ext}.`);
      const id = crypto.randomUUID(); const storageKey = `projects/${projectId}/customer-uploads/${id}`; const buffer = Buffer.from(await file.arrayBuffer()); const checksum = crypto.createHash('sha256').update(buffer).digest('hex');
      try { await storage.upload(buffer, storageKey, { 'content-type': file.type || 'application/octet-stream' }); const item = await fileRepository.create({ projectId, folderId: null, originalName, storedName: id, mimeType: file.type || 'application/octet-stream', size: BigInt(file.size), storageKey, checksum, uploadedById: actor.id }); created.push({ id: item.id, size: item.size.toString() }); } catch (error) { try { await storage.delete(storageKey); } catch {} throw error; }
    }
    await logActivity({ userId: actor.id, projectId, action: 'CUSTOMER_FILE_UPLOADED', metadata: { count: created.length, fileIds: created.map((file) => file.id) } });
    const admins = await prisma.user.findMany({ where: { role: 'ADMIN' }, select: { id: true } });
    await Promise.all(admins.map((admin) => NotificationService.create({ userId: admin.id, type: 'FILE_UPLOADED', title: 'Khách hàng đã gửi file', message: `${project.customer.name ?? 'Khách hàng'} đã gửi ${created.length} file vào ${project.name}.`, href: `/du-an/${projectId}`, idempotencyKey: `${projectId}:${created.map((file) => file.id).join(',')}:${admin.id}` })));
    return Response.json({ data: created, error: null }, { status: 201 });
  } catch (error) { return errorResponse(error); }
}
