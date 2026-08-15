'use client';

import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function PasswordGate({ token }: { token: string }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError('');
    const response = await fetch(`/api/public/deliveries/${encodeURIComponent(token)}/verify-password`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
    setBusy(false);
    if (!response.ok) { const json = await response.json().catch(() => null); setError(json?.error?.message ?? 'Mật khẩu không đúng.'); return; }
    window.location.reload();
  }
  return <main className="flex min-h-screen items-center justify-center px-5 py-12"><form onSubmit={submit} className="w-full max-w-md rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-7 shadow-sm"><p className="text-sm font-medium text-[var(--muted)]">Bàn giao được bảo vệ</p><h1 className="mt-2 text-2xl font-semibold tracking-tight">Nhập mật khẩu để tiếp tục</h1><label className="mt-6 block text-sm font-medium" htmlFor="delivery-password">Mật khẩu</label><Input id="delivery-password" autoFocus type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2"/><p aria-live="polite" className="mt-2 min-h-5 text-sm text-[var(--destructive)]">{error}</p><Button disabled={busy || !password} className="mt-3 w-full">{busy ? 'Đang xác thực...' : 'Mở bàn giao'}</Button></form></main>;
}
