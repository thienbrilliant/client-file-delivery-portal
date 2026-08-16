import Link from 'next/link';
import { Activity, ArrowUpRight, Bell, Database, FileDown, Files, FolderKanban, HardDrive, Link2, Plus, Users } from 'lucide-react';
import { auth } from '../../../../auth';
import { prisma } from '@/lib/db/prisma';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatBytes } from '@/lib/utils/format';

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user.id;
  const isCustomer = session?.user.role === 'CUSTOMER';
  const scopedProject = isCustomer && userId ? { customerId: userId } : undefined;
  const scopedFile = isCustomer && userId ? { project: { customerId: userId } } : undefined;
  const [customerCount, projectCount, fileCount, storageResult, downloadCount, activities] = await Promise.all([
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.project.count({ where: scopedProject }),
    prisma.file.count({ where: scopedFile }),
    prisma.file.aggregate({ _sum: { size: true }, where: scopedFile }),
    prisma.downloadLog.count({ where: isCustomer && userId ? { file: { project: { customerId: userId } } } : undefined }),
    prisma.activityLog.findMany({ where: isCustomer && userId ? { project: { customerId: userId } } : undefined, include: { user: { select: { name: true } }, project: { select: { name: true } } }, orderBy: { createdAt: 'desc' }, take: 6 }),
  ]);

  const metrics = [
    { label: isCustomer ? 'Dự án của bạn' : 'Khách hàng', value: isCustomer ? projectCount : customerCount, icon: isCustomer ? FolderKanban : Users, tone: 'bg-[var(--surface-sage)] text-[var(--primary)]' },
    { label: 'Dự án', value: projectCount, icon: FolderKanban, tone: 'bg-[var(--surface-sky)] text-[var(--info)]' },
    { label: 'File đã lưu', value: fileCount, icon: Database, tone: 'bg-[var(--surface-warm)] text-[var(--accent)]' },
    { label: 'Dung lượng', value: formatBytes(storageResult._sum.size ?? 0n), icon: HardDrive, tone: 'bg-[var(--surface-rose)] text-[var(--destructive)]' },
    { label: 'Lượt tải', value: downloadCount, icon: FileDown, tone: 'bg-[var(--surface-sage)] text-[var(--success)]' },
  ];
  const quickActions = isCustomer ? [
    { href: '/portal/projects', label: 'Xem dự án', text: 'Theo dõi file & bàn giao', icon: FolderKanban },
    { href: '/portal/notifications', label: 'Thông báo', text: 'Cập nhật mới nhất', icon: Bell },
  ] : [
    { href: '/khach-hang', label: 'Thêm khách hàng', text: 'Tạo hồ sơ khách hàng mới', icon: Users },
    { href: '/du-an', label: 'Tạo dự án', text: 'Bắt đầu workspace mới', icon: FolderKanban },
    { href: '/file', label: 'Quản lý file', text: 'Upload & sắp xếp tài liệu', icon: Files },
    { href: '/link-chia-se', label: 'Tạo link', text: 'Chuẩn bị một bộ bàn giao', icon: Link2 },
  ];

  return <div className="space-y-7 ui-rise">
    <header className="relative overflow-hidden border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-7">
      <div className="absolute inset-y-0 right-0 w-1/3 bg-[linear-gradient(135deg,transparent,var(--surface-warm))]" /><div className="absolute right-8 top-7 h-2 w-20 bg-[var(--accent)]/30" /><div className="absolute right-8 top-12 h-2 w-12 bg-[var(--primary)]/35" />
      <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between"><div><div className="inline-flex items-center gap-2 border border-[var(--border)] bg-[var(--surface-sage)] px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[.14em] text-[var(--primary)]"><span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" /> Workspace đang hoạt động</div><h1 className="mt-5 text-3xl font-semibold tracking-[-.04em] sm:text-[38px]">Xin chào, {session?.user.name ?? 'bạn'}.</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">Một góc nhìn nhanh về khách hàng, dự án, file và các lần bàn giao gần đây.</p></div><Link href={isCustomer ? '/portal/projects' : '/du-an'}><Button className="w-full sm:w-auto">Đi tới dự án <ArrowUpRight className="h-4 w-4" /></Button></Link></div>
    </header>

    <section className="grid gap-px overflow-hidden border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2 xl:grid-cols-5">
      {metrics.map(({ label, value, icon: Icon, tone }) => <div key={label} className="group relative bg-[var(--surface)] p-4 transition-colors hover:bg-[var(--surface-elevated)]"><div className="flex items-center justify-between"><span className="text-xs font-semibold text-[var(--muted)]">{label}</span><span className={`flex h-9 w-9 items-center justify-center rounded-[7px] ${tone}`}><Icon className="h-4 w-4" strokeWidth={1.8} /></span></div><p className="mt-5 text-2xl font-semibold tracking-[-.03em]">{value}</p><div className="mt-4 h-1 bg-[var(--surface-muted)]"><span className="block h-full w-2/5 bg-[var(--primary)] transition-all duration-300 group-hover:w-3/5" /></div></div>)}
    </section>

    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{quickActions.map(({ href, label, text, icon: Icon }) => <Link key={href} href={href} className="group surface flex items-center gap-3 rounded-[9px] p-4 transition-[background-color,border-color,transform] duration-150 hover:-translate-y-0.5 hover:border-[var(--primary)]/30 hover:bg-[var(--primary-soft)]"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[7px] bg-[var(--foreground)] text-white"><Icon className="h-4 w-4" /></span><span className="min-w-0 flex-1"><span className="block text-sm font-bold">{label}</span><span className="mt-1 block truncate text-xs text-[var(--muted)]">{text}</span></span><Plus className="h-4 w-4 text-[var(--muted)] transition-transform duration-150 group-hover:rotate-90 group-hover:text-[var(--primary)]" /></Link>)}</section>

    <section className="grid gap-5 lg:grid-cols-[1.35fr_.65fr]">
      <div className="surface overflow-hidden rounded-[11px]"><div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4"><div><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[var(--primary)]">Timeline</p><h2 className="mt-1 text-sm font-bold">Hoạt động gần đây</h2><p className="mt-1 text-xs text-[var(--muted)]">Những thay đổi mới nhất trong workspace.</p></div><Link href="/hoat-dong" className="focus-ring rounded-[7px] border border-[var(--border)] p-2 text-[var(--muted)] hover:bg-[var(--surface-muted)]"><Activity className="h-4 w-4" /></Link></div>{activities.length === 0 ? <div className="px-5 py-14 text-center"><Activity className="mx-auto h-7 w-7 text-[var(--muted)]" /><p className="mt-3 text-sm font-semibold">Chưa có hoạt động nào.</p><p className="mt-1 text-sm text-[var(--muted)]">Nhật ký sẽ xuất hiện khi workspace có thay đổi.</p></div> : <div className="divide-y divide-[var(--border)]">{activities.map((activity) => <div key={activity.id} className="flex items-start gap-3 px-5 py-4"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--primary)] shadow-[0_0_0_4px_var(--primary-soft)]" /><div className="min-w-0 flex-1"><p className="text-sm leading-5"><span className="font-semibold">{activity.user?.name ?? 'Hệ thống'}</span> · {activity.action}</p>{activity.project?.name ? <p className="mt-1 truncate text-xs text-[var(--muted)]">{activity.project.name}</p> : null}</div><span className="shrink-0 text-[11px] text-[var(--muted)]">{formatRelativeTime(activity.createdAt)}</span></div>)}</div>}</div>
      <div className="surface overflow-hidden rounded-[11px]"><div className="border-b border-[var(--border)] bg-[var(--surface-sage)] px-5 py-4"><div className="flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[var(--primary)]">System</p><h2 className="mt-1 text-sm font-bold">Hệ thống</h2></div><Badge className="border-emerald-200 bg-white/60 text-emerald-700 dark:border-emerald-900/50 dark:bg-black/10 dark:text-emerald-300">Hoạt động</Badge></div></div><div className="px-5 py-3">{[['Cơ sở dữ liệu','PostgreSQL'],['Lưu trữ',process.env.STORAGE_PROVIDER ?? 'local'],['Xác thực','Auth.js']].map(([label,value]) => <div key={label} className="flex items-center justify-between border-b border-[var(--border)] py-3 text-sm last:border-0"><span className="text-[var(--muted)]">{label}</span><span className="font-semibold">{value}</span></div>)}</div><div className="border-t border-[var(--border)] px-5 py-4"><Link href="/cai-dat" className="inline-flex items-center gap-1 text-xs font-bold text-[var(--primary)] hover:underline">Cài đặt workspace <ArrowUpRight className="h-3 w-3" /></Link></div></div>
    </section>
  </div>;
}

function formatRelativeTime(date: Date) { const delta = Date.now() - date.getTime(); const minutes = Math.floor(delta / 60_000); if (minutes < 1) return 'vừa xong'; if (minutes < 60) return `${minutes} phút trước`; const hours = Math.floor(minutes / 60); if (hours < 24) return `${hours} giờ trước`; return `${Math.floor(hours / 24)} ngày trước`; }
