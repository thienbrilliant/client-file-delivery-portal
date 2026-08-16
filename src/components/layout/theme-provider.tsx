'use client';

import * as React from 'react';

type Theme = 'light' | 'dark' | 'system';
const STORAGE_KEY = 'cfp-theme';
function getSystemTheme(): 'light' | 'dark' { return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; }
function applyTheme(theme: Theme) { const resolved = theme === 'system' ? getSystemTheme() : theme; document.documentElement.classList.toggle('dark', resolved === 'dark'); }
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    const saved = (window.localStorage.getItem(STORAGE_KEY) as Theme | null) ?? 'light';
    applyTheme(saved);
    if (saved !== 'system') return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => applyTheme('system');
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);
  return <>{children}</>;
}
export function setTheme(theme: Theme) { window.localStorage.setItem(STORAGE_KEY, theme); applyTheme(theme); }
