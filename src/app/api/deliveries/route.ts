import { z } from 'zod';
import { requireAdmin } from '@/server/require-auth';
import { createDelivery } from '@/server/delivery';
import { errorResponse } from '@/server/errors';
import { logActivity } from '@/server/activity';
import { prisma } from '@/lib/db/prisma';

const createSchema = z.object({ projectId: z.string().min(1), title: z.string().trim().min(1).max(200), description: z.string().max(2000).nullable().optional(), expiresAt: z.string().datetime().nullable().optional(), fileIds: z.array(z.string().min(1)).min(1).max(500) });

export async function POST(request: Request) {
  try { const actor = await requireAdmin(); const body = createSchema.parse(await request.json()); const delivery = await createDelivery({ ...body, expiresAt: body.expiresAt ? new Date(body.expiresAt) : null }); await logActivity({ userId: actor.id, projectId: body.projectId, action: 'DELIVERY_CREATED', metadata: { deliveryId: delivery.id, title: delivery.title, fileCount: delivery.files.length } }); return Response.json({ data: { id: delivery.id, title: delivery.title, description: delivery.description, status: delivery.status, expiresAt: delivery.expiresAt, fileCount: delivery.files.length }, error: null }, { status: 201 }); } catch (error) { return errorResponse(error); }
}

export async function GET(request: Request) {
  try { await requireAdmin(); const projectId = new URL(request.url).searchParams.get('projectId'); if (!projectId) return Response.json({ data: [], error: null }); const items = await prisma.delivery.findMany({ where: { projectId }, orderBy: { updatedAt: 'desc' }, include: { files: { include: { file: { select: { id: true, originalName: true, mimeType: true, size: true } } } }, _count: { select: { shareLinks: true } } } }); return Response.json({ data: items.map((item) => ({ ...item, expiresAt: item.expiresAt?.toISOString() ?? null, createdAt: item.createdAt.toISOString(), updatedAt: item.updatedAt.toISOString(), files: item.files.map((membership) => ({ ...membership, file: { ...membership.file, size: membership.file.size.toString() } })) })), error: null }); } catch (error) { return errorResponse(error); }
}
