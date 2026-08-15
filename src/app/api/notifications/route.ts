import { requireActor } from '@/server/require-auth';
import { NotificationService } from '@/server/notification-service';
import { errorResponse } from '@/server/errors';

export async function GET() {
  try {
    const actor = await requireActor();
    const [items, unreadCount] = await Promise.all([
      NotificationService.listForUser(actor.id),
      NotificationService.unreadCount(actor.id),
    ]);
    return Response.json({ data: { items, unreadCount }, error: null });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const actor = await requireActor();
    const body = await request.json().catch(() => ({}));
    if (body.all === true) {
      await NotificationService.markAllRead(actor.id);
    } else if (typeof body.id === 'string') {
      await NotificationService.markRead(actor.id, body.id);
    }
    return Response.json({ data: { ok: true }, error: null });
  } catch (error) {
    return errorResponse(error);
  }
}
