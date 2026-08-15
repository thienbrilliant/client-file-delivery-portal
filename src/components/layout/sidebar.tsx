'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, Bell, Files, FolderKanban, LayoutDashboard, Link2, LogOut, Moon, PackageCheck, Settings, Sun, Users } from 'lucide-react';
import { navigation } from '@/config/site';
import { cn } from '@/lib/utils';
import { setTheme } from './theme-provider';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';

const icons = { LayoutDashboard, Users, FolderKanban, Files, PackageCheck, Link2, Activity, Bell, Settings };

export function Sidebar({ userName }: { userName?: string | null }) {
  const pathname = usePathname();
  return (
    <aside className="hidden w-[252px] shrink-0 border-r border-[var(--border)] bg-[var(--surface)] lg:flex lg:flex-col">
      <div className="flex h-16 items-center border-b border-[var(--border)] px-5">
        <Link href="/" className="flex items-center gap-3 text-sm font-semibold tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--primary)]"><span className="h-2.5 w-2.5 rounded-[4px] bg-current" /></span>
          <span>Client File Portal</span>
        </Link>
      </div>
      <nav className="scrollbar-thin flex-1 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Không gian làm việc</p>
        <div className="space-y-0.5">
          {navigation.map((item) => {
            const Icon = icons[item.icon as keyof typeof icons];
            const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return <Link key={item.href} href={item.href} className={cn('focus-ring flex h-9 items-center gap-3 rounded-[8px] px-3 text-sm transition-colors duration-150', active ? 'bg-[var(--surface-muted)] text-[var(--foreground)]' : 'text-[var(--muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]')}><Icon className="h-4 w-4" strokeWidth={1.8} /><span>{item.label}</span></Link>;
          })}
        </div>
      </nav>
      <div className="border-t border-[var(--border)] p-3">
        <div className="mb-2 flex items-center justify-between rounded-[8px] bg-[var(--surface-muted)] px-3 py-2">
          <div className="min-w-0"><p className="truncate text-xs font-medium">{userName ?? 'Tài khoản'}</p><p className="text-[11px] text-[var(--muted)]">Không gian quản trị</p></div>
          <div className="flex items-center gap-1"><Button aria-label="Chuyển sang giao diện sáng" size="icon" variant="ghost" onClick={() => setTheme('light')}><Sun className="h-4 w-4" /></Button><Button aria-label="Chuyển sang giao diện tối" size="icon" variant="ghost" onClick={() => setTheme('dark')}><Moon className="h-4 w-4" /></Button></div>
        </div>
        <Button variant="ghost" className="w-full justify-start" onClick={() => signOut({ callbackUrl: '/dang-nhap' })}><LogOut className="h-4 w-4" />Đăng xuất</Button>
      </div>
    </aside>
  );
}
