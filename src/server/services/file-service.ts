import { fileRepository } from '@/server/repositories/file-repository';
import { folderRepository } from '@/server/repositories/folder-repository';
import { canManageFile } from '@/server/permissions';
import { AppError } from '@/server/errors';
import type { Actor } from '@/server/permissions';
import { createStorageProvider } from '@/lib/storage';
import { logActivity } from '@/server/activity';

export const fileService = {
  async rename(actor: Actor, fileId: string, originalName: string) {
    if (!(await canManageFile(actor, fileId))) throw new AppError('FORBIDDEN', 'Bạn không có quyền sửa file này.', 403);
    const file = await fileRepository.findById(fileId); if (!file) throw new AppError('FILE_NOT_FOUND', 'Không tìm thấy file.', 404);
    const name = originalName.trim(); if (!name || name.length > 255 || name.includes('/') || name.includes('\\') || name === '.' || name === '..') throw new AppError('INVALID_FILE', 'Tên file không hợp lệ.');
    const item = await fileRepository.updateName(fileId, name); await logActivity({ userId: actor.id, projectId: file.projectId, action: 'FILE_RENAMED', metadata: { fileId, fileName: name } }); return item;
  },
  async move(actor: Actor, fileId: string, folderId: string | null) {
    if (!(await canManageFile(actor, fileId))) throw new AppError('FORBIDDEN', 'Bạn không có quyền sửa file này.', 403);
    const file = await fileRepository.findById(fileId); if (!file) throw new AppError('FILE_NOT_FOUND', 'Không tìm thấy file.', 404);
    if (folderId) { const folder = await folderRepository.findById(folderId); if (!folder || folder.projectId !== file.projectId) throw new AppError('INVALID_FOLDER', 'Thư mục đích không thuộc dự án này.'); }
    const item = await fileRepository.move(fileId, folderId); await logActivity({ userId: actor.id, projectId: file.projectId, action: 'FILE_MOVED', metadata: { fileId, folderId } }); return item;
  },
  async remove(actor: Actor, fileId: string) {
    if (!(await canManageFile(actor, fileId))) throw new AppError('FORBIDDEN', 'Bạn không có quyền xóa file này.', 403);
    const file = await fileRepository.findById(fileId); if (!file) throw new AppError('FILE_NOT_FOUND', 'Không tìm thấy file.', 404);
    await createStorageProvider().delete(file.storageKey); await fileRepository.delete(fileId); await logActivity({ userId: actor.id, projectId: file.projectId, action: 'FILE_DELETED', metadata: { fileId, fileName: file.originalName } }); return { id: fileId };
  },
};
