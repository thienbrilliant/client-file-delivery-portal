import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Bell, FolderKanban, House, UserRound } from 'lucide-react';
import { auth } from '../../../auth';
import { SignOutButton } from '@/components/auth/sign-out-button';

const links = [
  { href: '/portal', label: 'Tổng quan', icon: House },
  { href: '/portal/projects', label: 'Dự án', icon: FolderKanban },
  { href: '/portal/notifications', label: 'Thông báo', icon: Bell },
  { href: '/portal/account', label: 'Tài khoản', icon: UserRound },
];

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect('/dang-nhap');
  if (session.user.role === 'ADMIN') redirect('/tai-khoan');
  if (session.user.role !== 'CUSTOMER') redirect('/dang-nhap');

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-[var(--primary-soft)]/60 blur-3xl" />
        <div className="absolute -bottom-48 -right-40 h-[28rem] w-[28rem] rounded-full bg-amber-100/50 blur-3xl" />
      </div>
      <header className="sticky top-0 z-30 border-b border-[var(--border)]/80 bg-[var(--background)]/90 backdrop-blur-xl"><div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:px-8"><Link href="/portal" className="group flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-[9px] bg-[var(--primary)] text-white shadow-sm transition-transform group-hover:-rotate-3"><FolderKanban className="h-4 w-4" /></span><span className="hidden text-sm font-semibold tracking-tight sm:block">Client File Portal</span></Link><div className="flex items-center gap-1.5"><Link href="/portal/notifications" className="focus-ring relative rounded-[9px] p-2.5 text-[var(--muted)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]" aria-label="Thông báo"><Bell className="h-4 w-4" /></Link><Link href="/portal/account" className="focus-ring flex items-center gap-2 rounded-[9px] border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-[var(--surface-muted)]"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primary-soft)] text-[var(--primary)]">{(session.user.name ?? 'B').charAt(0).toUpperCase()}</span><span className="hidden max-w-28 truncate sm:block">{session.user.name ?? 'Tài khoản'}</span></Link><SignOutButton className="hidden rounded-[9px] p-2.5 text-xs text-[var(--muted)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)] sm:inline-flex" /></div></div></header>
      <div className="mx-auto grid max-w-[1280px] gap-6 px-4 py-5 pb-24 sm:px-6 lg:grid-cols-[205px_minmax(0,1fr)] lg:px-8 lg:py-8 lg:pb-10"><aside className="hidden lg:block"><nav className="sticky top-24 space-y-1"><p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[.16em] text-[var(--muted)]">Workspace</p>{links.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className="focus-ring group flex h-10 items-center gap-3 rounded-[9px] px-3 text-sm text-[var(--muted)] transition-all hover:bg-[var(--surface)] hover:text-[var(--foreground)] hover:shadow-sm"><Icon className="h-4 w-4 transition-transform group-hover:scale-105" strokeWidth={1.8} />{label}</Link>)}<div className="mt-6 border-t border-[var(--border)] pt-4"><SignOutButton className="w-full justify-start rounded-[9px] px-3 py-2.5 text-sm text-[var(--muted)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--foreground)]" /></div></nav></aside><main className="min-w-0">{children}</main></div>
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--border)] bg-[var(--surface)]/95 px-2 py-2 shadow-[0_-8px_30px_rgba(0,0,0,.05)] backdrop-blur-xl lg:hidden"><div className="mx-auto grid max-w-lg grid-cols-4 gap-1">{links.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className="focus-ring flex flex-col items-center gap-1 rounded-[9px] py-1.5 text-[10px] font-medium text-[var(--muted)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]"><Icon className="h-4 w-4" strokeWidth={1.8} />{label}</Link>)}</div></nav>
    </div>
  );
}
