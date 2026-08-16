'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, Bell, Files, FolderKanban, LayoutDashboard, Link2, LogOut, Moon, PackageCheck, Settings, Sun, Users } from 'lucide-react';
import { navigation, workspaceSecondaryNavigation } from '@/config/site';
import { cn } from '@/lib/utils';
import { setTheme } from './theme-provider';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';

const icons = { LayoutDashboard, Users, FolderKanban, Files, PackageCheck, Link2, Activity, Bell, Settings };

export function Sidebar({ userName }: { userName?: string | null }) {
  const pathname = usePathname();
  const renderItem = (item: (typeof navigation)[number] | (typeof workspaceSecondaryNavigation)[number]) => {
    const Icon = icons[item.icon as keyof typeof icons];
    const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
    return <Link key={item.href} href={item.href} className={cn('focus-ring group flex h-10 items-center gap-3 rounded-[10px] px-3 text-sm transition-all duration-150', active ? 'bg-[var(--primary-soft)] font-semibold text-[var(--primary)] shadow-sm' : 'text-[var(--muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]')}><Icon className="h-4 w-4 transition-transform group-hover:scale-105" strokeWidth={active ? 2 : 1.8} /><span>{item.label}</span>{active ? <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--primary)]" /> : null}</Link>;
  };
  return <aside className="hidden w-[252px] shrink-0 border-r border-[var(--border)] bg-[var(--surface)] lg:flex lg:flex-col">
    <div className="flex h-[72px] items-center border-b border-[var(--border)] px-5"><Link href="/" className="group flex items-center gap-3 text-sm font-semibold tracking-tight"><span className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-[var(--foreground)] text-white shadow-sm transition-transform group-hover:-rotate-3"><FolderKanban className="h-4 w-4" /></span><span>Client File Portal</span></Link></div>
    <nav className="scrollbar-thin flex-1 overflow-y-auto px-3 py-5"><p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[.16em] text-[var(--muted)]">Workspace</p><div className="space-y-1">{navigation.map(renderItem)}</div><div className="my-5 h-px bg-[var(--border)]" /><p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[.16em] text-[var(--muted)]">Hệ thống</p><div className="space-y-1">{workspaceSecondaryNavigation.map(renderItem)}</div></nav>
    <div className="border-t border-[var(--border)] p-3"><div className="mb-2 flex items-center gap-3 rounded-[12px] bg-[var(--surface-muted)] p-2.5"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--foreground)] text-xs font-semibold text-white">{(userName ?? 'T').slice(0, 1).toUpperCase()}</div><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold">{userName ?? 'Tài khoản'}</p><p className="text-[11px] text-[var(--muted)]">Quản trị workspace</p></div></div><div className="flex items-center gap-1"><Button aria-label="Giao diện sáng" size="icon" variant="ghost" onClick={() => setTheme('light')}><Sun className="h-4 w-4" /></Button><Button aria-label="Giao diện tối" size="icon" variant="ghost" onClick={() => setTheme('dark')}><Moon className="h-4 w-4" /></Button><Button variant="ghost" className="ml-auto" onClick={() => signOut({ callbackUrl: '/dang-nhap' })}><LogOut className="h-4 w-4" />Đăng xuất</Button></div></div>
  </aside>;
}
