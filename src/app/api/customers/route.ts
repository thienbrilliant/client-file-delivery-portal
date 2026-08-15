import { z } from 'zod';
import { customerRepository } from '@/server/repositories/customer-repository';
import { requireAdmin } from '@/server/require-auth';
import { errorResponse } from '@/server/errors';

const schema = z.object({ name: z.string().trim().min(1).max(120), email: z.string().trim().email().max(254), phone: z.string().trim().max(40).optional(), companyName: z.string().trim().max(160).optional(), notes: z.string().trim().max(2000).optional() });

export async function GET(request: Request) {
  try {
    await requireAdmin(); const url = new URL(request.url); const q = url.searchParams.get('q')?.trim() || undefined; const rawStatus = url.searchParams.get('status') || undefined;
    const status = rawStatus && ['INVITED', 'ACTIVE', 'SUSPENDED', 'DISABLED'].includes(rawStatus) ? rawStatus as 'INVITED' | 'ACTIVE' | 'SUSPENDED' | 'DISABLED' : undefined;
    const page = Math.max(1, Number(url.searchParams.get('page') || 1)); const take = Math.min(50, Math.max(1, Number(url.searchParams.get('pageSize') || 20)));
    const [items, total] = await customerRepository.list({ q, status, skip: (page - 1) * take, take }); return Response.json({ data: { items, total, page, pageSize: take }, error: null });
  } catch (error) { return errorResponse(error); }
}

export async function POST(request: Request) {
  try { await requireAdmin(); const parsed = schema.safeParse(await request.json()); if (!parsed.success) return Response.json({ data: null, error: { code: 'INVALID_INPUT', message: parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ.' } }, { status: 400 }); const item = await customerRepository.create(parsed.data); return Response.json({ data: item, error: null }, { status: 201 }); } catch (error) { return errorResponse(error); }
}
