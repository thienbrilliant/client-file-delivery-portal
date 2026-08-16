import Link from 'next/link';
import { ArrowUpRight, Bell, FileText, FolderKanban, PackageCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { auth } from '../../../auth';
import { prisma } from '@/lib/db/prisma';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const statusLabel: Record<string, string> = { DRAFT: 'Bản nháp', IN_PROGRESS: 'Đang thực hiện', READY: 'Sẵn sàng', ARCHIVED: 'Đã lưu trữ' };

type Metric = { label: string; value: number; Icon: LucideIcon };

export default async function PortalPage() {
  const session = await auth();
  const userId = session!.user.id;
  const [projects, deliveries, fileCount, unreadCount] = await Promise.all([
    prisma.project.findMany({ where: { customerId: userId }, include: { _count: { select: { files: true, deliveries: true } } }, orderBy: { updatedAt: 'desc' }, take: 4 }),
    prisma.delivery.findMany({ where: { project: { customerId: userId } }, include: { project: { select: { name: true } }, _count: { select: { files: true } } }, orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.file.count({ where: { project: { customerId: userId } } }),
    prisma.notification.count({ where: { userId, isRead: false } }),
  ]);

  const metrics: Metric[] = [
    { label: 'Dự án đang có', value: projects.length, Icon: FolderKanban },
    { label: 'Bàn giao gần đây', value: deliveries.length, Icon: PackageCheck },
    { label: 'File của bạn', value: fileCount, Icon: FileText },
    { label: 'Chưa đọc', value: unreadCount, Icon: Bell },
  ];

  return <div className="space-y-7">
    <header className="surface overflow-hidden rounded-[12px] p-6 sm:p-7"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--primary)]">Không gian của bạn</p><div className="mt-2 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="text-2xl font-semibold tracking-tight sm:text-[30px]">Xin chào, {session!.user.name ?? 'bạn'} 👋</h1><p className="mt-2 max-w-xl text-sm leading-6 text-[var(--muted)]">Các dự án, file và bàn giao của bạn được tập trung ở một nơi.</p></div><Link href="/portal/notifications"><Button variant="secondary">{unreadCount ? `${unreadCount} thông báo mới` : 'Xem thông báo'}<Bell className="h-4 w-4" /></Button></Link></div></header>
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{metrics.map(({ label, value, Icon }) => <div key={label} className="surface rounded-[10px] p-4"><div className="flex items-center justify-between"><span className="text-sm text-[var(--muted)]">{label}</span><Icon className="h-4 w-4 text-[var(--muted)]" /></div><p className="mt-4 text-xl font-semibold">{value}</p></div>)}</section>
    <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="surface rounded-[10px]"><div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4"><div><h2 className="text-sm font-semibold">Bàn giao gần đây</h2><p className="mt-1 text-xs text-[var(--muted)]">Những bộ file mới nhất dành cho bạn.</p></div><Link href="/portal/projects" className="text-xs font-medium text-[var(--primary)]">Xem dự án</Link></div>{deliveries.length ? <div className="divide-y divide-[var(--border)]">{deliveries.map((delivery) => <Link key={delivery.id} href={`/portal/deliveries/${delivery.id}`} className="focus-ring flex items-center gap-4 px-5 py-4 transition-colors hover:bg-[var(--surface-muted)]"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[var(--surface-muted)] text-[var(--primary)]"><PackageCheck className="h-4 w-4" /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{delivery.title}</p><p className="mt-1 text-xs text-[var(--muted)]">{delivery.project.name} · {delivery._count.files} file</p></div><Badge variant="outline">{delivery.status === 'VIEWED' ? 'Đã xem' : 'Sẵn sàng'}</Badge><ArrowUpRight className="h-4 w-4 text-[var(--muted)]" /></Link>)}</div> : <div className="px-5 py-12 text-center text-sm text-[var(--muted)]">Chưa có bàn giao nào.</div>}</div>
      <div className="surface rounded-[10px] p-5"><h2 className="text-sm font-semibold">Dự án của bạn</h2><div className="mt-4 space-y-1">{projects.length ? projects.slice(0, 3).map((project) => <Link key={project.id} href={`/portal/projects/${project.id}`} className="focus-ring flex items-center gap-3 rounded-[8px] px-2 py-3 hover:bg-[var(--surface-muted)]"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-[var(--surface-muted)]"><FolderKanban className="h-4 w-4 text-[var(--primary)]" /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{project.name}</p><p className="mt-1 text-xs text-[var(--muted)]">{project._count.files} file · {project._count.deliveries} bàn giao</p></div><span className="text-[11px] text-[var(--muted)]">{statusLabel[project.status]}</span></Link>) : <p className="py-8 text-center text-sm text-[var(--muted)]">Dự án của bạn sẽ xuất hiện ở đây.</p>}</div></div>
    </section>
  </div>;
}
