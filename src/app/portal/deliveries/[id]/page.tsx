import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Download, FileText, PackageCheck } from 'lucide-react';
import { auth } from '../../../../../auth';
import { prisma } from '@/lib/db/prisma';
import { Badge } from '@/components/ui/badge';
import { logActivity } from '@/server/activity';

export default async function PortalDeliveryPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await params;
  const delivery = await prisma.delivery.findFirst({ where: { id, project: { customerId: session!.user.id } }, include: { project: { select: { id: true, name: true } }, files: { include: { file: true }, orderBy: { createdAt: 'asc' } } } });
  if (!delivery) notFound();
  if (delivery.status === 'READY') await prisma.delivery.update({ where: { id: delivery.id }, data: { status: 'VIEWED' } });
  await logActivity({ userId: session!.user.id, projectId: delivery.project.id, action: 'CUSTOMER_OPENED_DELIVERY', metadata: { deliveryId: delivery.id } });
  const totalBytes = delivery.files.reduce((sum, item) => sum + Number(item.file.size), 0);
  return <div className="space-y-6"><Link href={`/portal/projects/${delivery.project.id}`} className="focus-ring inline-flex items-center gap-2 text-xs text-[var(--muted)] hover:text-[var(--foreground)]"><ArrowLeft className="h-3.5 w-3.5" />{delivery.project.name}</Link><header className="surface rounded-[12px] p-6 sm:p-7"><div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex items-center gap-2"><span className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[var(--surface-muted)] text-[var(--primary)]"><PackageCheck className="h-4 w-4" /></span><Badge variant="outline">{delivery.status === 'VIEWED' ? 'Đã xem' : 'Sẵn sàng'}</Badge></div><h1 className="mt-4 text-2xl font-semibold tracking-tight">{delivery.title}</h1>{delivery.description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">{delivery.description}</p> : null}</div><div className="text-left text-xs text-[var(--muted)] sm:text-right"><p>Gửi ngày {delivery.createdAt.toLocaleDateString('vi-VN')}</p><p className="mt-1">{delivery.files.length} file · {formatBytes(totalBytes)}</p>{delivery.expiresAt ? <p className="mt-1">Hết hạn {delivery.expiresAt.toLocaleDateString('vi-VN')}</p> : null}</div></div></header><section className="surface rounded-[10px]"><div className="border-b border-[var(--border)] px-5 py-4"><h2 className="text-sm font-semibold">File trong bàn giao</h2></div>{delivery.files.length ? <div className="divide-y divide-[var(--border)]">{delivery.files.map(({ file }) => <div key={file.id} className="flex min-w-0 items-center gap-3 px-5 py-4"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[var(--surface-muted)]"><FileText className="h-4 w-4 text-[var(--muted)]" /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{file.originalName}</p><p className="mt-1 text-xs text-[var(--muted)]">{formatBytes(Number(file.size))}</p></div><a href={`/api/files/${file.id}`} className="focus-ring inline-flex items-center gap-2 rounded-[8px] border border-[var(--border)] px-3 py-2 text-xs font-medium hover:bg-[var(--surface-muted)]"><Download className="h-3.5 w-3.5" />Tải xuống</a></div>)}</div> : <div className="px-5 py-12 text-center text-sm text-[var(--muted)]">Bàn giao chưa có file.</div>}</section></div>;
}
function formatBytes(bytes: number) { if (bytes < 1024) return `${bytes} B`; const units = ['KB', 'MB', 'GB']; let value = bytes / 1024; for (const unit of units) { if (value < 1024) return `${value.toFixed(value >= 10 ? 0 : 1)} ${unit}`; value /= 1024; } return `${value.toFixed(1)} TB`; }
