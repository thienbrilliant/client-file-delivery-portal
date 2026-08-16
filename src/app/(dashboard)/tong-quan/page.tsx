import Link from 'next/link';
import { Activity, ArrowUpRight, Bell, Database, FileDown, Files, FolderKanban, HardDrive, Link2, Plus, Users } from 'lucide-react';
import { auth } from '../../../../auth';
import { prisma } from '@/lib/db/prisma';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatBytes } from '@/lib/utils/format';

export default async function DashboardPage() {
  const session = await auth(); const userId = session?.user.id; const isCustomer = session?.user.role === 'CUSTOMER';
  const scopedProject = isCustomer && userId ? { customerId: userId } : undefined; const scopedFile = isCustomer && userId ? { project: { customerId: userId } } : undefined;
  const [customerCount, projectCount, fileCount, storageResult, downloadCount, activities] = await Promise.all([
    prisma.user.count({ where: { role: 'CUSTOMER' } }), prisma.project.count({ where: scopedProject }), prisma.file.count({ where: scopedFile }), prisma.file.aggregate({ _sum: { size: true }, where: scopedFile }), prisma.downloadLog.count({ where: isCustomer && userId ? { file: { project: { customerId: userId } } } : undefined }), prisma.activityLog.findMany({ where: isCustomer && userId ? { project: { customerId: userId } } : undefined, include: { user: { select: { name: true } }, project: { select: { name: true } } }, orderBy: { createdAt: 'desc' }, take: 6 }),
  ]);
  const metrics = [
    { label: isCustomer ? 'Dự án của bạn' : 'Khách hàng', value: isCustomer ? projectCount : customerCount, icon: isCustomer ? FolderKanban : Users },
    { label: 'Dự án', value: projectCount, icon: FolderKanban },
    { label: 'File đã lưu', value: fileCount, icon: Database },
    { label: 'Dung lượng', value: formatBytes(storageResult._sum.size ?? 0n), icon: HardDrive },
    { label: 'Lượt tải', value: downloadCount, icon: FileDown },
  ];
  const quickActions = isCustomer ? [
    { href: '/portal/projects', label: 'Xem dự án', text: 'Theo dõi file & bàn giao', icon: FolderKanban },
    { href: '/portal/notifications', label: 'Thông báo', text: 'Cập nhật mới nhất', icon: Bell },
  ] : [
    { href: '/khach-hang', label: 'Thêm khách hàng', text: 'Tạo hồ sơ khách hàng mới', icon: Users },
    { href: '/du-an', label: 'Tạo dự án', text: 'Bắt đầu một workspace mới', icon: FolderKanban },
    { href: '/file', label: 'Quản lý file', text: 'Upload & sắp xếp tài liệu', icon: Files },
    { href: '/link-chia-se', label: 'Tạo link', text: 'Chuẩn bị một bộ bàn giao', icon: Link2 },
  ];
  return <div className="space-y-6 sm:space-y-7">
    <header className="relative overflow-hidden rounded-[20px] border border-[var(--border)] bg-[linear-gradient(135deg,var(--primary-soft),var(--surface)_58%,#f7efe0)] p-5 sm:p-7">
      <div className="absolute -right-12 -top-20 h-56 w-56 rounded-full bg-[var(--primary)]/10 blur-3xl" /><div className="absolute -bottom-24 right-24 h-40 w-40 rounded-full bg-amber-200/25 blur-3xl" />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"><div><div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white/60 px-3 py-1.5 text-[11px] font-semibold text-[var(--primary)] backdrop-blur"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--primary)]" /> Workspace đang hoạt động</div><h1 className="mt-4 text-2xl font-semibold tracking-[-.025em] sm:text-[32px]">Xin chào, {session?.user.name ?? 'bạn'} 👋</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">Mọi thứ quan trọng về khách hàng, dự án và bàn giao file nằm ở đây.</p></div><Link href={isCustomer ? '/portal/projects' : '/du-an'}><Button className="w-full sm:w-auto">Đi tới dự án <ArrowUpRight className="h-4 w-4" /></Button></Link></div>
    </header>

    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">{metrics.map(({ label, value, icon: Icon }, index) => <div key={label} className="surface group relative overflow-hidden rounded-[13px] p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"><div className="absolute -right-5 -top-5 h-16 w-16 rounded-full bg-[var(--primary-soft)] opacity-0 transition-opacity group-hover:opacity-100" /><div className="relative flex items-center justify-between"><span className="text-xs font-medium text-[var(--muted)]">{label}</span><span className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-[var(--surface-muted)] text-[var(--primary)]"><Icon className="h-4 w-4" strokeWidth={1.8} /></span></div><p className="relative mt-4 text-xl font-semibold tracking-tight">{value}</p><div className="relative mt-3 h-1 overflow-hidden rounded-full bg-[var(--surface-muted)]"><span className="block h-full rounded-full bg-[var(--primary)]/60" style={{ width: `${35 + index * 12}%` }} /></div></div>)}</section>

    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{quickActions.map(({ href, label, text, icon: Icon }) => <Link key={href} href={href} className="group surface flex items-center gap-3 rounded-[13px] p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[var(--primary-soft)] text-[var(--primary)] transition-transform group-hover:scale-105"><Icon className="h-4.5 w-4.5" /></span><span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{label}</span><span className="mt-0.5 block truncate text-xs text-[var(--muted)]">{text}</span></span><Plus className="h-4 w-4 text-[var(--muted)] transition-transform group-hover:rotate-90" /></Link>)}</section>

    <section className="grid gap-4 lg:grid-cols-[1.35fr_.65fr]">
      <div className="surface rounded-[14px]"><div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4"><div><h2 className="text-sm font-semibold">Hoạt động gần đây</h2><p className="mt-1 text-xs text-[var(--muted)]">Những thay đổi mới nhất trong workspace.</p></div><Link href="/hoat-dong" className="focus-ring rounded-[8px] p-2 text-[var(--muted)] hover:bg-[var(--surface-muted)]"><Activity className="h-4 w-4" /></Link></div>{activities.length === 0 ? <div className="px-5 py-12 text-center"><p className="text-sm font-medium">Chưa có hoạt động nào.</p><p className="mt-1 text-sm text-[var(--muted)]">Nhật ký sẽ xuất hiện khi workspace có thay đổi.</p></div> : <div className="divide-y divide-[var(--border)]">{activities.map((activity) => <div key={activity.id} className="flex items-start gap-3 px-5 py-4"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--primary)] shadow-[0_0_0_4px_var(--primary-soft)]" /><div className="min-w-0 flex-1"><p className="text-sm leading-5">{activity.user?.name ?? 'Hệ thống'} · {activity.action}</p>{activity.project?.name ? <p className="mt-1 truncate text-xs text-[var(--muted)]">{activity.project.name}</p> : null}</div><span className="shrink-0 text-[11px] text-[var(--muted)]">{formatRelativeTime(activity.createdAt)}</span></div>)}</div>}</div>
      <div className="surface rounded-[14px] p-5"><div className="flex items-start justify-between"><div><h2 className="text-sm font-semibold">Hệ thống</h2><p className="mt-1 text-xs text-[var(--muted)]">Trạng thái các dịch vụ cốt lõi.</p></div><Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">Hoạt động</Badge></div><div className="mt-6 space-y-1">{[['Cơ sở dữ liệu','PostgreSQL'],['Lưu trữ',process.env.STORAGE_PROVIDER ?? 'local'],['Xác thực','Auth.js']].map(([label,value]) => <div key={label} className="flex items-center justify-between border-b border-[var(--border)] py-3 text-sm last:border-0"><span className="text-[var(--muted)]">{label}</span><span className="font-medium">{value}</span></div>)}</div><Link href="/cai-dat" className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[var(--primary)]">Cài đặt workspace <ArrowUpRight className="h-3 w-3" /></Link></div>
    </section>
  </div>;
}
function formatRelativeTime(date: Date) { const delta = Date.now() - date.getTime(); const minutes = Math.floor(delta / 60_000); if (minutes < 1) return 'vừa xong'; if (minutes < 60) return `${minutes} phút trước`; const hours = Math.floor(minutes / 60); if (hours < 24) return `${hours} giờ trước`; return `${Math.floor(hours / 24)} ngày trước`; }
