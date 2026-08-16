'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, Bell, Files, FolderKanban, LayoutDashboard, Link2, LogOut, Moon, PackageCheck, Settings, Sun, Users } from 'lucide-react';
import { navigation, workspaceSecondaryNavigation, siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import { setTheme } from './theme-provider';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';

const icons = { LayoutDashboard, Users, FolderKanban, Files, PackageCheck, Link2, Activity, Bell, Settings };

export function Sidebar({ userName }: { userName?: string | null }) {
  const pathname = usePathname();
  const renderItem = (item: (typeof navigation)[number] | (typeof workspaceSecondaryNavigation)[number]) => {
    const Icon = icons[item.icon as keyof typeof icons];
    const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
    return <Link key={item.href} href={item.href} className={cn('focus-ring group relative flex h-10 items-center gap-3 rounded-[7px] px-3 text-sm transition-colors duration-150', active ? 'bg-[var(--primary)] font-semibold text-white shadow-sm' : 'text-[var(--muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]')}><span className={cn('flex h-6 w-6 items-center justify-center', active ? 'text-white' : 'text-[var(--muted)] group-hover:text-[var(--primary)]')}><Icon className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-px" strokeWidth={active ? 2.1 : 1.8} /></span><span>{item.label}</span>{item.label === 'Thông báo' ? <span className={cn('ml-auto h-1.5 w-1.5 rounded-full', active ? 'bg-white' : 'bg-[var(--accent)]')} /> : null}</Link>;
  };

  return <aside className="hidden w-[248px] shrink-0 border-r border-[var(--border)] bg-[var(--surface)] lg:flex lg:flex-col">
    <div className="border-b border-[var(--border)] px-5 py-5"><Link href="/" className="group flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-[7px] bg-[var(--primary)] text-white shadow-sm transition-transform duration-150 group-hover:-rotate-2"><FolderKanban className="h-4 w-4" /></span><span><span className="block text-sm font-bold tracking-tight">{siteConfig.name}</span><span className="mt-0.5 block text-[10px] uppercase tracking-[.15em] text-[var(--muted)]">Workspace</span></span></Link></div>
    <nav className="scrollbar-thin flex-1 overflow-y-auto px-3 py-5"><p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[.17em] text-[var(--muted)]">Công việc</p><div className="space-y-1">{navigation.slice(0, 6).map(renderItem)}</div><div className="my-5 editorial-rule" /><p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[.17em] text-[var(--muted)]">Theo dõi</p><div className="space-y-1">{[navigation[6], ...workspaceSecondaryNavigation].map(renderItem)}</div></nav>
    <div className="border-t border-[var(--border)] p-3"><div className="mb-3 flex items-center gap-3 rounded-[7px] border border-[var(--border)] bg-[var(--surface-warm)] p-2.5"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--foreground)] text-xs font-bold text-white">{(userName ?? 'T').slice(0, 1).toUpperCase()}</div><div className="min-w-0 flex-1"><p className="truncate text-xs font-bold">{userName ?? 'Tài khoản'}</p><p className="text-[10px] text-[var(--muted)]">Workspace admin</p></div></div><div className="flex items-center gap-1"><Button aria-label="Giao diện sáng" size="icon" variant="ghost" onClick={() => setTheme('light')}><Sun className="h-4 w-4" /></Button><Button aria-label="Giao diện tối" size="icon" variant="ghost" onClick={() => setTheme('dark')}><Moon className="h-4 w-4" /></Button><Button variant="ghost" className="ml-auto" onClick={() => signOut({ callbackUrl: '/dang-nhap' })}><LogOut className="h-4 w-4" />Đăng xuất</Button></div></div>
  </aside>;
}
