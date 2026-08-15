import Link from 'next/link';
import { Link2 } from 'lucide-react';
import { prisma } from '@/lib/db/prisma';
import { requireAdmin } from '@/server/require-auth';

function formatDate(value: Date | null) {
  return value ? new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }).format(value) : 'Không giới hạn';
}

export default async function ShareLinksPage() {
  await requireAdmin();
  const links = await prisma.shareLink.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: { delivery: { select: { id: true, title: true, project: { select: { id: true, name: true } } } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-[var(--muted)]">Secure sharing</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Link chia sẻ</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Theo dõi link bàn giao, thời hạn và lượt tải. Token thật không được hiển thị lại.</p>
      </div>
      <section className="surface rounded-[10px]">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
          <h2 className="font-semibold">Các link đã tạo</h2>
          <span className="text-sm text-[var(--muted)]">{links.length} link</span>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {links.map((link) => {
            const expired = Boolean(link.expiresAt && link.expiresAt <= new Date());
            const active = link.isActive && !expired && (link.maxDownloads === null || link.downloadCount < link.maxDownloads);
            return (
              <div key={link.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
                <Link href={`/du-an/${link.delivery.project.id}/ban-giao/${link.delivery.id}`} className="min-w-0 flex-1 hover:underline">
                  <p className="truncate font-medium">{link.delivery.title}</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">{link.delivery.project.name} · Tạo {formatDate(link.createdAt)}</p>
                </Link>
                <div className="text-right text-xs text-[var(--muted)]">
                  <p className={active ? 'text-emerald-600' : 'text-[var(--muted)]'}>{active ? 'Đang hoạt động' : expired ? 'Đã hết hạn' : link.isActive ? 'Đã đạt giới hạn' : 'Đã thu hồi'}</p>
                  <p className="mt-1">Hết hạn: {formatDate(link.expiresAt)}</p>
                  <p className="mt-1">Lượt tải: {link.downloadCount}{link.maxDownloads === null ? '' : ` / ${link.maxDownloads}`}</p>
                </div>
                <Link href={`/du-an/${link.delivery.project.id}/ban-giao/${link.delivery.id}`} className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">Quản lý →</Link>
              </div>
            );
          })}
          {links.length === 0 && (
            <div className="px-5 py-12 text-center">
              <Link2 className="mx-auto h-8 w-8 text-[var(--muted)]" />
              <p className="mt-3 text-sm font-medium">Chưa có link chia sẻ</p>
              <p className="mt-1 text-sm text-[var(--muted)]">Tạo link từ một gói bàn giao để bắt đầu gửi file cho khách.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
