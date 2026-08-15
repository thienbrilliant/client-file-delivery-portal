import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Bell, FolderKanban, House, LogOut, UserRound } from 'lucide-react';
import { auth } from '@/../auth';
import { signOut } from 'next-auth/react';

const links = [
  { href: '/portal', label: 'Tổng quan', icon: House },
  { href: '/portal/projects', label: 'Dự án', icon: FolderKanban },
  { href: '/portal/notifications', label: 'Thông báo', icon: Bell },
  { href: '/portal/account', label: 'Tài khoản', icon: UserRound },
];

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect('/dang-nhap');
  if (session.user.role !== 'CUSTOMER') redirect('/');

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[color:color-mix(in_srgb,var(--background)_94%,transparent)] backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between px-4 sm:px-6">
          <Link href="/portal" className="flex items-center gap-3 text-sm font-semibold tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--primary)]"><span className="h-2.5 w-2.5 rounded-[4px] bg-current" /></span>
            <span>Client File Portal</span>
          </Link>
          <div className="flex items-center gap-1 sm:gap-2">
            {links.slice(2, 4).map(({ href, label, icon: Icon }) => <Link key={href} href={href} className="focus-ring rounded-[8px] p-2 text-[var(--muted)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]" aria-label={label}><Icon className="h-4 w-4" /></Link>)}
            <form action={async () => { 'use server'; const { signOut } = await import('@/../auth'); await signOut({ redirectTo: '/dang-nhap' }); }}><button className="focus-ring rounded-[8px] p-2 text-[var(--muted)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]" aria-label="Đăng xuất"><LogOut className="h-4 w-4" /></button></form>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-[1180px] gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[180px_minmax(0,1fr)] lg:py-8">
        <aside className="hidden lg:block">
          <nav className="sticky top-24 space-y-1">
            {links.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className="focus-ring flex h-9 items-center gap-3 rounded-[8px] px-3 text-sm text-[var(--muted)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]"><Icon className="h-4 w-4" strokeWidth={1.8} />{label}</Link>)}
          </nav>
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--border)] bg-[var(--surface)]/95 px-2 py-2 backdrop-blur-sm lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-4 gap-1">{links.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className="flex flex-col items-center gap-1 rounded-[8px] py-1.5 text-[11px] text-[var(--muted)]"><Icon className="h-4 w-4" />{label}</Link>)}</div>
      </nav>
    </div>
  );
}
