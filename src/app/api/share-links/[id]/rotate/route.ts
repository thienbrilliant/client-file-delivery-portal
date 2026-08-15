import { z } from 'zod';
import { prisma } from '@/lib/db/prisma';
import { createShareLink, createSharePassword } from '@/server/delivery';
import { requireAdmin } from '@/server/require-auth';
import { AppError, errorResponse } from '@/server/errors';
import { logActivity } from '@/server/activity';

const schema = z.object({ password: z.string().min(8).max(200).nullable().optional(), generatePassword: z.boolean().optional(), expiresAt: z.string().datetime().nullable().optional(), maxDownloads: z.number().int().positive().nullable().optional() });

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { const actor = await requireAdmin(); const { id } = await params; const old = await prisma.shareLink.findUnique({ where: { id }, select: { deliveryId: true, delivery: { select: { projectId: true } } } }); if (!old) throw new AppError('SHARE_LINK_NOT_FOUND', 'Không tìm thấy link.', 404); const body = schema.parse(await request.json()); const generatedPassword = body.generatePassword ? createSharePassword() : null; const result = await prisma.$transaction(async (tx) => { await tx.shareLink.update({ where: { id }, data: { isActive: false } }); return createShareLink({ deliveryId: old.deliveryId, password: generatedPassword ?? body.password ?? null, expiresAt: body.expiresAt ? new Date(body.expiresAt) : null, maxDownloads: body.maxDownloads ?? null }); }); await logActivity({ userId: actor.id, projectId: old.delivery.projectId, action: 'SHARE_LINK_ROTATED', metadata: { deliveryId: old.deliveryId, revokedShareLinkId: id, shareLinkId: result.link.id } }); return Response.json({ data: { id: result.link.id, token: result.token, password: generatedPassword, expiresAt: result.link.expiresAt, maxDownloads: result.link.maxDownloads, hasPassword: Boolean(result.link.passwordHash) }, error: null }, { status: 201 }); } catch (error) { return errorResponse(error); }
}
