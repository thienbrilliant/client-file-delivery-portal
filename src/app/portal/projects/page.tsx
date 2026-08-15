import Link from 'next/link';
import { ArrowUpRight, FolderKanban, PackageCheck } from 'lucide-react';
import { auth } from '../../../../auth';
import { prisma } from '@/lib/db/prisma';
import { Badge } from '@/components/ui/badge';

const labels: Record<string, string> = { DRAFT: 'Bản nháp', IN_PROGRESS: 'Đang thực hiện', READY: 'Sẵn sàng', ARCHIVED: 'Đã lưu trữ' };

export default async function PortalProjectsPage() {
  const session = await auth();
  const projects = await prisma.project.findMany({ where: { customerId: session!.user.id }, include: { _count: { select: { files: true, deliveries: true } } }, orderBy: { updatedAt: 'desc' } });
  return <div className="space-y-6"><header><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--primary)]">Workspace</p><h1 className="mt-1 text-2xl font-semibold tracking-tight">Dự án</h1><p className="mt-2 text-sm text-[var(--muted)]">Xem file, bàn giao và tiến độ của từng dự án.</p></header>{projects.length ? <div className="grid gap-3 md:grid-cols-2">{projects.map((project) => <Link key={project.id} href={`/portal/projects/${project.id}`} className="surface group rounded-[10px] p-5 transition-colors hover:border-[var(--ring)]"><div className="flex items-start gap-4"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-[var(--surface-muted)] text-[var(--primary)]"><FolderKanban className="h-5 w-5" /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="truncate text-sm font-semibold">{project.name}</h2><Badge variant="outline">{labels[project.status]}</Badge></div>{project.description ? <p className="mt-2 line-clamp-2 text-sm leading-5 text-[var(--muted)]">{project.description}</p> : null}<div className="mt-5 flex items-center gap-4 text-xs text-[var(--muted)]"><span>{project._count.files} file</span><span className="flex items-center gap-1"><PackageCheck className="h-3.5 w-3.5" />{project._count.deliveries} bàn giao</span><ArrowUpRight className="ml-auto h-4 w-4 transition-transform group-hover:translate-x-0.5" /></div></div></div></Link>)}</div> : <div className="surface rounded-[10px] px-5 py-14 text-center"><FolderKanban className="mx-auto h-8 w-8 text-[var(--muted)]" /><h2 className="mt-3 text-sm font-semibold">Chưa có dự án nào</h2><p className="mt-1 text-sm text-[var(--muted)]">Các dự án dành cho bạn sẽ xuất hiện ở đây.</p></div>}</div>;
}
