'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, FolderKanban, LockKeyhole } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { siteConfig } from '@/config/site';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('ChangeMe123!');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setError(null);
    const result = await signIn('credentials', { email, password, redirect: false, callbackUrl: '/tong-quan' });
    if (!result || result.error) { setError('Email hoặc mật khẩu không chính xác.'); setPending(false); return; }
    window.location.assign(result.url ?? '/tong-quan');
  }

  return <main className="min-h-screen bg-[var(--background)]"><div className="grid min-h-screen lg:grid-cols-[1.05fr_.95fr]">
    <section className="relative hidden overflow-hidden bg-[var(--foreground)] p-10 text-white lg:flex lg:flex-col lg:justify-between"><div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-emerald-300/15 blur-3xl" /><Link href="/" className="relative flex items-center gap-3 font-semibold"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-200/15 text-emerald-200"><FolderKanban className="h-4 w-4" /></span>{siteConfig.name}</Link><div className="relative max-w-xl"><p className="text-xs font-semibold uppercase tracking-[.16em] text-emerald-200">Workspace của bạn</p><h1 className="mt-5 text-5xl font-semibold leading-tight tracking-[-.04em]">Mở workspace. <span className="text-emerald-200">Bắt đầu làm việc.</span></h1><p className="mt-5 max-w-lg text-sm leading-7 text-white/60">Quản lý khách hàng, dự án, file và bàn giao từ một giao diện rõ ràng.</p><div className="mt-8 grid max-w-md grid-cols-2 gap-3"><div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-xs text-white/45">Tổ chức</p><p className="mt-2 text-sm font-medium">Dự án & khách hàng</p></div><div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-xs text-white/45">Bàn giao</p><p className="mt-2 text-sm font-medium">Link & quyền truy cập</p></div></div></div><p className="relative text-xs text-white/40">{siteConfig.description}</p></section>
    <section className="flex items-center justify-center px-5 py-10 sm:px-8"><div className="w-full max-w-[420px]"><Link href="/" className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)]"><ArrowLeft className="h-4 w-4" /> Trang chủ</Link><div className="mt-10 text-center"><div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]"><LockKeyhole className="h-5 w-5" /></div><h2 className="mt-5 text-3xl font-semibold tracking-tight">Đăng nhập</h2><p className="mt-2 text-sm leading-6 text-[var(--muted)]">Chào mừng bạn quay lại workspace.</p></div>
      <div className="mt-8 space-y-3"><Button type="button" variant="secondary" className="h-11 w-full" onClick={() => signIn('google', { callbackUrl: '/tong-quan' })}><span className="text-base font-bold">G</span> Tiếp tục với Google</Button><div className="flex items-center gap-3 py-2 text-[11px] text-[var(--muted)]"><span className="h-px flex-1 bg-[var(--border)]" /> HOẶC EMAIL <span className="h-px flex-1 bg-[var(--border)]" /></div></div>
      <form onSubmit={handleSubmit} className="space-y-4"><label className="block"><span className="mb-1.5 block text-sm font-medium">Email</span><Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" required /></label><label className="block"><span className="mb-1.5 block text-sm font-medium">Mật khẩu</span><Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="current-password" required /></label>{error ? <p className="rounded-xl bg-red-50 px-3 py-2.5 text-sm text-[var(--destructive)] dark:bg-red-950/30">{error}</p> : null}<Button type="submit" className="h-11 w-full" disabled={pending}>{pending ? 'Đang đăng nhập…' : 'Đăng nhập'}</Button></form>
      <div className="mt-6 flex items-center justify-between text-sm"><span className="text-[var(--muted)]">Chưa có tài khoản?</span><Link href="/dang-ky" className="font-semibold text-[var(--primary)]">Tạo tài khoản</Link></div><p className="mt-8 text-center text-xs leading-5 text-[var(--muted)]">Tài khoản seed development có thể dùng để kiểm thử. Hãy đổi mật khẩu trước production.</p>
    </div></section>
  </div></main>;
}
