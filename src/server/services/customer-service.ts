import { customerRepository } from '@/server/repositories/customer-repository';
import { AppError } from '@/server/errors';
import type { Actor } from '@/server/permissions';

export const customerService = {
  async create(actor: Actor, input: { name: string; email: string; phone?: string | null; companyName?: string | null; notes?: string | null }) {
    if (actor.role !== 'ADMIN') throw new AppError('FORBIDDEN', 'Bạn không có quyền tạo khách hàng.', 403);
    const name=input.name.trim();const email=input.email.trim().toLowerCase();if(!name)throw new AppError('INVALID_FILE','Tên khách hàng là bắt buộc.');return customerRepository.create({...input,name,email});
  },
  async update(actor: Actor, id: string, input: { name: string; email: string; phone?: string | null; companyName?: string | null; notes?: string | null }) {
    if(actor.role!=='ADMIN')throw new AppError('FORBIDDEN','Bạn không có quyền sửa khách hàng.',403);if(!(await customerRepository.findById(id)))throw new AppError('CUSTOMER_NOT_FOUND','Không tìm thấy khách hàng.',404);return customerRepository.update(id,{...input,name:input.name.trim(),email:input.email.trim().toLowerCase()});
  },
};
