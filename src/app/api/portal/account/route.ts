import { z } from 'zod';
import { requireActor } from '@/server/require-auth';
import { prisma } from '@/lib/db/prisma';
import { hashPassword, verifyPassword } from '@/lib/security/password';
import { errorResponse, AppError } from '@/server/errors';

const profileSchema = z.object({ name: z.string().trim().min(1).max(120), companyName: z.string().trim().max(160).optional().or(z.literal('')), phone: z.string().trim().max(40).optional().or(z.literal('')) });
const passwordSchema = z.object({ currentPassword: z.string().min(1), newPassword: z.string().min(8).max(128), confirmPassword: z.string().min(1) }).refine((value) => value.newPassword === value.confirmPassword, { message: 'Mật khẩu xác nhận không khớp.', path: ['confirmPassword'] });

export async function GET() {
  try { const actor = await requireActor(); const user = await prisma.user.findUnique({ where: { id: actor.id }, include: { customerProfile: true } }); if (!user) throw new AppError('FORBIDDEN', 'Không tìm thấy tài khoản.', 404); return Response.json({ data: { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl, role: user.role, profile: user.customerProfile }, error: null }); } catch (error) { return errorResponse(error); }
}

export async function PATCH(request: Request) {
  try { const actor = await requireActor(); const parsed = profileSchema.safeParse(await request.json()); if (!parsed.success) throw new AppError('INVALID_FILE', parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ.', 400); const user = await prisma.user.update({ where: { id: actor.id }, data: { name: parsed.data.name, customerProfile: { upsert: { create: { companyName: parsed.data.companyName || null, phone: parsed.data.phone || null }, update: { companyName: parsed.data.companyName || null, phone: parsed.data.phone || null } } } }, include: { customerProfile: true } }); return Response.json({ data: { name: user.name, email: user.email, profile: user.customerProfile }, error: null }); } catch (error) { return errorResponse(error); }
}

export async function PUT(request: Request) {
  try { const actor = await requireActor(); const parsed = passwordSchema.safeParse(await request.json()); if (!parsed.success) throw new AppError('INVALID_FILE', parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ.', 400); const user = await prisma.user.findUnique({ where: { id: actor.id }, select: { passwordHash: true } }); if (!user?.passwordHash || !(await verifyPassword(user.passwordHash, parsed.data.currentPassword))) throw new AppError('FORBIDDEN', 'Mật khẩu hiện tại không đúng.', 400); await prisma.user.update({ where: { id: actor.id }, data: { passwordHash: await hashPassword(parsed.data.newPassword) } }); return Response.json({ data: { ok: true }, error: null }); } catch (error) { return errorResponse(error); }
}
