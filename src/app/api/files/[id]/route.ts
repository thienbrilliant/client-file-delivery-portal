import { fileRepository } from '@/server/repositories/file-repository';
import { folderRepository } from '@/server/repositories/folder-repository';
import { requireActor, requireAdmin } from '@/server/require-auth';
import { canViewFile } from '@/server/permissions';
import { createStorageProvider } from '@/lib/storage';
import { AppError, errorResponse } from '@/server/errors';
import { logActivity } from '@/server/activity';
import { prisma } from '@/lib/db/prisma';

function name(value: unknown) { const v = String(value ?? '').trim(); if (!v || v.length > 255 || v === '.' || v === '..' || v.includes('\0') || v.includes('/') || v.includes('\\')) throw new AppError('INVALID_FILE', 'Tên file không hợp lệ.'); return v; }

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { const actor = await requireActor(); const { id } = await params; if (!(await canViewFile(actor, id))) throw new AppError('FORBIDDEN', 'Bạn không có quyền truy cập file này.', 403); const file = await fileRepository.findById(id); if (!file) throw new AppError('FILE_NOT_FOUND', 'Không tìm thấy file.', 404); const storage = createStorageProvider(); if (!(await storage.exists(file.storageKey))) throw new AppError('FILE_NOT_FOUND', 'Không tìm thấy file.', 404); const stream = await storage.download(file.storageKey); await prisma.downloadLog.create({ data: { fileId: file.id, userId: actor.id } }); await logActivity({ userId: actor.id, projectId: file.projectId, action: 'FILE_DOWNLOADED', metadata: { fileId: file.id, fileName: file.originalName } }); return new Response(stream, { headers: { 'Content-Type': file.mimeType, 'Content-Length': file.size.toString(), 'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(file.originalName)}`, 'Cache-Control': 'private, no-store' } }); } catch (error) { return errorResponse(error); }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { const actor = await requireAdmin(); const { id } = await params; const file = await fileRepository.findById(id); if (!file) throw new AppError('FILE_NOT_FOUND', 'Không tìm thấy file.', 404); const body = await request.json(); if (body.name !== undefined) { const newName = name(body.name); const item = await fileRepository.updateName(id, newName); await logActivity({ userId: actor.id, projectId: file.projectId, action: 'FILE_RENAMED', metadata: { fileId: id, fileName: newName } }); return Response.json({ data: item, error: null }); } if (body.folderId !== undefined) { const folderId = body.folderId ? String(body.folderId) : null; if (folderId) { const folder = await folderRepository.findById(folderId); if (!folder || folder.projectId !== file.projectId) throw new AppError('INVALID_FOLDER', 'Thư mục đích không thuộc dự án này.'); } const item = await fileRepository.move(id, folderId); await logActivity({ userId: actor.id, projectId: file.projectId, action: 'FILE_MOVED', metadata: { fileId: id, folderId } }); return Response.json({ data: item, error: null }); } throw new AppError('INVALID_FILE', 'Không có thay đổi hợp lệ.'); } catch (error) { return errorResponse(error); }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { const actor = await requireAdmin(); const { id } = await params; const file = await fileRepository.findById(id); if (!file) throw new AppError('FILE_NOT_FOUND', 'Không tìm thấy file.', 404); const storage = createStorageProvider(); await storage.delete(file.storageKey); await fileRepository.delete(id); await logActivity({ userId: actor.id, projectId: file.projectId, action: 'FILE_DELETED', metadata: { fileId: id, fileName: file.originalName } }); return Response.json({ data: { id }, error: null }); } catch (error) { return errorResponse(error); }
}
