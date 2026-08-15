import { z } from 'zod';
import { prisma } from '@/lib/db/prisma';
import { createShareLink, createSharePassword } from '@/server/delivery';
import { requireAdmin } from '@/server/require-auth';
import { errorResponse } from '@/server/errors';
import { logActivity } from '@/server/activity';

const schema = z.object({ password: z.string().min(8).max(200).nullable().optional(), generatePassword: z.boolean().optional(), expiresAt: z.string().datetime().nullable().optional(), maxDownloads: z.number().int().positive().nullable().optional() });

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { await requireAdmin(); const { id } = await params; const items = await prisma.shareLink.findMany({ where: { deliveryId: id }, orderBy: { createdAt: 'desc' }, select: { id: true, expiresAt: true, maxDownloads: true, downloadCount: true, isActive: true, lastAccessedAt: true, createdAt: true } }); return Response.json({ data: items, error: null }); } catch (error) { return errorResponse(error); }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { const actor = await requireAdmin(); const { id } = await params; const body = schema.parse(await request.json()); const generatedPassword = body.generatePassword ? createSharePassword() : null; const password = generatedPassword ?? body.password ?? null; const result = await createShareLink({ deliveryId: id, password, expiresAt: body.expiresAt ? new Date(body.expiresAt) : null, maxDownloads: body.maxDownloads ?? null }); const delivery = await prisma.delivery.update({ where: { id }, data: { status: 'READY' }, select: { projectId: true } }); await logActivity({ userId: actor.id, projectId: delivery.projectId, action: 'SHARE_LINK_CREATED', metadata: { deliveryId: id, shareLinkId: result.link.id, expiresAt: result.link.expiresAt, maxDownloads: result.link.maxDownloads, hasPassword: Boolean(password) } }); return Response.json({ data: { id: result.link.id, token: result.token, password: generatedPassword, expiresAt: result.link.expiresAt, maxDownloads: result.link.maxDownloads, downloadCount: result.link.downloadCount, hasPassword: Boolean(result.link.passwordHash) }, error: null }, { status: 201 }); } catch (error) { return errorResponse(error); }
}
