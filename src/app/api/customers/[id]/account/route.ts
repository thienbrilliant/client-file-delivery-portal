import { z } from 'zod';
import { accountService } from '@/server/services/account-service';
import { requireAdmin } from '@/server/require-auth';
import { errorResponse } from '@/server/errors';

const schema = z.object({ action: z.enum(['suspend', 'reactivate', 'disable', 'revoke-sessions', 'delete']) });

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const actor = await requireAdmin();
    const { id } = await params;
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return Response.json({ data: null, error: { code: 'INVALID_INPUT', message: 'Thao tác không hợp lệ.' } }, { status: 400 });
    const action = parsed.data.action;
    if (action === 'suspend') return Response.json({ data: await accountService.setStatus(id, 'SUSPENDED', actor.id), error: null });
    if (action === 'reactivate') return Response.json({ data: await accountService.setStatus(id, 'ACTIVE', actor.id), error: null });
    if (action === 'disable') return Response.json({ data: await accountService.setStatus(id, 'DISABLED', actor.id), error: null });
    if (action === 'revoke-sessions') return Response.json({ data: await accountService.revokeSessions(id, actor.id), error: null });
    return Response.json({ data: await accountService.softDelete(id, actor.id), error: null });
  } catch (error) {
    return errorResponse(error);
  }
}
