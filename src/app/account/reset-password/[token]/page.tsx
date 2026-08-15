'use client';

import { FormEvent, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const params = useParams<{ token: string }>();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault(); setError('');
    if (password.length < 12) return setError('Mật khẩu cần ít nhất 12 ký tự.');
    if (password !== confirm) return setError('Mật khẩu xác nhận không khớp.');
    setLoading(true);
    const response = await fetch('/api/account/password-reset/confirm', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: params.token, password }) });
    const body = await response.json(); setLoading(false);
    if (!response.ok) return setError(body.error?.message ?? 'Không thể cập nhật mật khẩu.');
    router.push('/dang-nhap?reset=1');
  }
  return <main className="mx-auto flex min-h-screen max-w-md items-center px-5 py-12"><section className="w-full"><p className="text-sm font-medium text-[var(--muted)]">Bảo mật tài khoản</p><h1 className="mt-3 text-3xl font-semibold tracking-tight">Đặt lại mật khẩu</h1><p className="mt-2 text-sm leading-6 text-[var(--muted)]">Chọn một mật khẩu mới, dài ít nhất 12 ký tự.</p><form onSubmit={submit} className="mt-8 space-y-5"><label className="block"><span className="text-sm font-medium">Mật khẩu mới</span><input className="mt-2 w-full rounded-[10px] border border-[var(--border)] bg-transparent px-3 py-2.5" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" /></label><label className="block"><span className="text-sm font-medium">Xác nhận mật khẩu</span><input className="mt-2 w-full rounded-[10px] border border-[var(--border)] bg-transparent px-3 py-2.5" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" /></label>{error && <p role="alert" className="text-sm text-red-600">{error}</p>}<button disabled={loading} className="w-full rounded-[10px] bg-[var(--foreground)] px-4 py-2.5 text-sm font-medium text-[var(--background)] disabled:opacity-50">{loading ? 'Đang cập nhật…' : 'Đặt lại mật khẩu'}</button></form></section></main>;
}
