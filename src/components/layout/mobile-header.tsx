'use client';

import { Menu, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { navigation } from '@/config/site';
import { setTheme } from './theme-provider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function MobileHeader() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-4 py-3 lg:hidden">
      <Button size="icon" variant="ghost" aria-label="Mở menu" onClick={() => setOpen((value) => !value)}>
        <Menu className="h-4 w-4" />
      </Button>
      <span className="text-sm font-semibold">Client File Portal</span>
      <div className="flex items-center gap-1">
        <Button size="icon" variant="ghost" aria-label="Giao diện sáng" onClick={() => setTheme('light')}>
          <Sun className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" aria-label="Giao diện tối" onClick={() => setTheme('dark')}>
          <Moon className="h-4 w-4" />
        </Button>
      </div>
      {open ? (
        <div className="absolute inset-x-3 top-14 z-20 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] p-2 shadow-[var(--shadow-soft)]">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={cn('block rounded-[8px] px-3 py-2 text-sm text-[var(--muted)] hover:bg-[var(--surface-muted)]')}>
              {item.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
