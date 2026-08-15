import { auth } from '../../../../auth';
import { NotificationService } from '@/server/notification-service';
import { NotificationList } from '@/components/portal/notification-list';

export default async function PortalNotificationsPage() {
  const session = await auth();
  const [items, unreadCount] = await Promise.all([NotificationService.listForUser(session!.user.id), NotificationService.unreadCount(session!.user.id)]);
  return <NotificationList initialItems={items.map((item) => ({ ...item, createdAt: item.createdAt.toISOString() }))} initialUnread={unreadCount} />;
}
