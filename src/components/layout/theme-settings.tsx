'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { setTheme } from './theme-provider';

const options = [
  { value: 'light' as const, label: 'Sáng', icon: Sun },
  { value: 'system' as const, label: 'Hệ thống', icon: Monitor },
  { value: 'dark' as const, label: 'Tối', icon: Moon },
];

export function ThemeSettings() {
  const [theme, setSelectedTheme] = useState<'light' | 'dark' | 'system'>('light');
  function choose(value: typeof theme) { setSelectedTheme(value); setTheme(value); }
  return <div className="mt-5 grid grid-cols-3 gap-2">{options.map(({ value, label, icon: Icon }) => <button key={value} type="button" onClick={() => choose(value)} className={`rounded-[9px] border px-2 py-3 text-xs font-medium transition ${theme === value ? 'border-[var(--ring)] bg-[var(--primary-soft)] text-[var(--primary)]' : 'border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-muted)]'}`}><Icon className="mx-auto h-4 w-4" /><span className="mt-2 block">{label}</span></button>)}</div>;
}
