import { z } from 'zod';
import { customerRepository } from '@/server/repositories/customer-repository';
import { requireAdmin } from '@/server/require-auth';
import { AppError, errorResponse } from '@/server/errors';

const schema = z.object({ name: z.string().trim().min(1).max(120), email: z.string().trim().email().max(254), phone: z.string().trim().max(40).nullable().optional(), companyName: z.string().trim().max(160).nullable().optional(), notes: z.string().trim().max(2000).nullable().optional() });
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) { try { await requireAdmin(); const { id } = await params; if (!(await customerRepository.findById(id))) throw new AppError('CUSTOMER_NOT_FOUND', 'Không tìm thấy khách hàng.', 404); const parsed = schema.safeParse(await request.json()); if (!parsed.success) throw new AppError('INVALID_FILE', parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ.'); const item = await customerRepository.update(id, parsed.data); return Response.json({ data: item, error: null }); } catch (error) { return errorResponse(error); } }
