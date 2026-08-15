import Link from 'next/link';
import { Package, Plus } from 'lucide-react';
import { prisma } from '@/lib/db/prisma';
import { requireAdmin } from '@/server/require-auth';

function formatBytes(bytes: bigint) {
  const value = Number(bytes);
  if (value < 1024) return `${value} B`;
  if (value < 1024 ** 2) return `${(value / 1024).toFixed(1)} KB`;
  if (value < 1024 ** 3) return `${(value / 1024 ** 2).toFixed(1)} MB`;
  return `${(value / 1024 ** 3).toFixed(1)} GB`;
}

const statusLabel: Record<string, string> = {
  PREPARING: 'Đang chuẩn bị',
  READY: 'Sẵn sàng',
  VIEWED: 'Đã xem',
  DOWNLOADED: 'Đã tải xuống',
  EXPIRED: 'Đã hết hạn',
  REVOKED: 'Đã thu hồi',
  COMPLETED: 'Hoàn tất',
};

export default async function DeliveriesPage() {
  await requireAdmin();
  const deliveries = await prisma.delivery.findMany({
    orderBy: { updatedAt: 'desc' },
    take: 50,
    include: {
      project: { select: { id: true, name: true } },
      files: { include: { file: { select: { size: true } } } },
      _count: { select: { shareLinks: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm text-[var(--muted)]">Bàn giao sản phẩm</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Bàn giao</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">Quản lý các gói file đã chuẩn bị và link gửi cho khách hàng.</p>
        </div>
        <Package className="h-6 w-6 text-[var(--muted)]" />
      </div>

      <section className="surface rounded-[10px]">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
          <h2 className="font-semibold">Các gói bàn giao</h2>
          <span className="text-sm text-[var(--muted)]">{deliveries.length} gói</span>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {deliveries.map((delivery) => {
            const totalSize = delivery.files.reduce((sum, item) => sum + item.file.size, 0n);
            return (
              <Link key={delivery.id} href={`/du-an/${delivery.project.id}/ban-giao/${delivery.id}`} className="flex items-center gap-4 px-5 py-4 hover:bg-[var(--surface-muted)]">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{delivery.title}</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">{delivery.project.name} · {delivery.files.length} file · {formatBytes(totalSize)} · {delivery._count.shareLinks} link</p>
                </div>
                <span className="shrink-0 text-xs text-[var(--muted)]">{statusLabel[delivery.status] ?? delivery.status}</span>
                <span className="text-sm text-[var(--muted)]">Mở →</span>
              </Link>
            );
          })}
          {deliveries.length === 0 && (
            <div className="px-5 py-12 text-center">
              <Package className="mx-auto h-8 w-8 text-[var(--muted)]" />
              <p className="mt-3 text-sm font-medium">Chưa có gói bàn giao</p>
              <p className="mt-1 text-sm text-[var(--muted)]">Mở một dự án để chọn file và tạo bàn giao đầu tiên.</p>
              <Link href="/du-an" className="mt-4 inline-flex items-center gap-2 text-sm font-medium hover:underline"><Plus className="h-4 w-4" />Mở danh sách dự án</Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
