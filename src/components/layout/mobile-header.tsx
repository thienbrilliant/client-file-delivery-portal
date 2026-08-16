'use client';

import { Menu, Moon, Sun, X } from 'lucide-react';
import { useState } from 'react';
import { navigation, workspaceSecondaryNavigation, siteConfig } from '@/config/site';
import { setTheme } from './theme-provider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function MobileHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const items = [...navigation, ...workspaceSecondaryNavigation];
  return <header className="relative flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-4 py-3 lg:hidden">
    <Button size="icon" variant="ghost" aria-label={open ? 'Đóng menu' : 'Mở menu'} onClick={() => setOpen((value) => !value)}>{open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}</Button>
    <Link href="/tong-quan" className="flex items-center gap-2 text-sm font-bold"><span className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-[var(--primary)] text-white"><span className="text-xs">C</span></span>{siteConfig.name}</Link>
    <div className="flex items-center gap-1"><Button size="icon" variant="ghost" aria-label="Giao diện sáng" onClick={() => setTheme('light')}><Sun className="h-4 w-4" /></Button><Button size="icon" variant="ghost" aria-label="Giao diện tối" onClick={() => setTheme('dark')}><Moon className="h-4 w-4" /></Button></div>
    {open ? <div className="absolute inset-x-3 top-[58px] z-40 rounded-[9px] border border-[var(--border)] bg-[var(--surface)] p-2 shadow-[var(--shadow-medium)]"><p className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[.16em] text-[var(--muted)]">Điều hướng</p>{items.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={cn('block rounded-[7px] px-3 py-2.5 text-sm', pathname === item.href ? 'bg-[var(--primary)] font-semibold text-white' : 'text-[var(--muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]')}>{item.label}</Link>)}</div> : null}
  </header>;
}
