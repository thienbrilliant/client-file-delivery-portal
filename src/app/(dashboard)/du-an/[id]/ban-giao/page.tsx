import Link from 'next/link';
import { ArrowLeft, Package } from 'lucide-react';
import { prisma } from '@/lib/db/prisma';
import { requireAdmin } from '@/server/require-auth';
import { DeliveryCreator } from './DeliveryCreator';

export default async function DeliveriesPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin(); const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id }, select: { id: true, name: true } });
  if (!project) return <div className="p-8 text-sm text-[var(--muted)]">Không tìm thấy dự án.</div>;
  const [files, deliveries] = await Promise.all([
    prisma.file.findMany({ where: { projectId: id }, orderBy: { createdAt: 'desc' }, select: { id: true, originalName: true, mimeType: true, size: true } }),
    prisma.delivery.findMany({ where: { projectId: id }, orderBy: { updatedAt: 'desc' }, include: { files: { select: { fileId: true } }, _count: { select: { shareLinks: true } } } }),
  ]);
  return <div className="space-y-6"><div><Link href={`/du-an/${id}`} className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)]"><ArrowLeft className="h-4 w-4"/>Quay lại dự án</Link><div className="mt-4 flex items-end justify-between gap-4"><div><p className="text-sm text-[var(--muted)]">{project.name}</p><h1 className="mt-1 text-2xl font-semibold tracking-tight">Bàn giao</h1></div><Package className="h-6 w-6 text-[var(--muted)]"/></div></div><DeliveryCreator projectId={id} files={files.map((file) => ({ ...file, size: file.size.toString() }))}/><section className="surface rounded-[10px] p-5"><h2 className="font-semibold">Các gói bàn giao</h2><div className="mt-4 divide-y divide-[var(--border)]">{deliveries.map((delivery) => <Link key={delivery.id} href={`/du-an/${id}/ban-giao/${delivery.id}`} className="flex items-center gap-4 py-4 hover:bg-[var(--surface-muted)]"><div className="min-w-0 flex-1"><p className="font-medium">{delivery.title}</p><p className="mt-1 text-xs text-[var(--muted)]">{delivery.files.length} file · {delivery._count.shareLinks} link · {delivery.status}</p></div><span className="text-sm text-[var(--muted)]">Mở →</span></Link>)}{deliveries.length === 0 && <p className="py-10 text-center text-sm text-[var(--muted)]">Chưa có gói bàn giao.</p>}</div></section></div>;
}
