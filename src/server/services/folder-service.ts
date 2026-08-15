import { folderRepository } from '@/server/repositories/folder-repository';
import { canManageFolder } from '@/server/permissions';
import { AppError } from '@/server/errors';
import { logActivity } from '@/server/activity';
import type { Actor } from '@/server/permissions';

export const folderService = {
  async create(actor: Actor, input: { projectId: string; parentId?: string | null; name: string }) {
    if (actor.role !== 'ADMIN') throw new AppError('FORBIDDEN', 'Bạn không có quyền tạo thư mục.', 403);
    if (input.parentId) { const parent = await folderRepository.findById(input.parentId); if (!parent || parent.projectId !== input.projectId) throw new AppError('INVALID_FOLDER', 'Thư mục cha không thuộc dự án này.'); }
    const name=input.name.trim(); if(!name||name==='.'||name==='..'||name.includes('/')||name.includes('\\')) throw new AppError('INVALID_FOLDER','Tên thư mục không hợp lệ.');
    const item=await folderRepository.create({...input,name}); await logActivity({userId:actor.id,projectId:item.projectId,action:'FOLDER_CREATED',metadata:{folderId:item.id,name:item.name}}); return item;
  },
  async rename(actor: Actor, folderId: string, name: string) { if(!(await canManageFolder(actor,folderId)))throw new AppError('FORBIDDEN','Bạn không có quyền sửa thư mục này.',403);const folder=await folderRepository.findById(folderId);if(!folder)throw new AppError('FOLDER_NOT_FOUND','Không tìm thấy thư mục.',404);const value=name.trim();if(!value||value==='.'||value==='..'||value.includes('/')||value.includes('\\'))throw new AppError('INVALID_FOLDER','Tên thư mục không hợp lệ.');const item=await folderRepository.rename(folderId,value);await logActivity({userId:actor.id,projectId:folder.projectId,action:'FOLDER_RENAMED',metadata:{folderId,name:value}});return item; },
};
