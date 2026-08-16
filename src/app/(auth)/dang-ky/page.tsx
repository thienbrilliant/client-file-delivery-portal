'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, FolderKanban } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { siteConfig } from '@/config/site';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true); setError(null);
    const response = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, password }) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) { setError(data.error ?? 'Không thể tạo tài khoản.'); setPending(false); return; }
    const result = await signIn('credentials', { email, password, redirect: false, callbackUrl: '/tong-quan' });
    if (!result || result.error) { window.location.assign('/dang-nhap'); return; }
    window.location.assign(result.url ?? '/tong-quan');
  }

  return <main className="min-h-screen bg-[var(--background)]"><div className="grid min-h-screen lg:grid-cols-[.9fr_1.1fr]">
    <section className="relative hidden overflow-hidden bg-[var(--foreground)] p-10 text-white lg:flex lg:flex-col lg:justify-between"><div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-emerald-300/15 blur-3xl" /><Link href="/" className="relative flex items-center gap-3 font-semibold"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-200/15 text-emerald-200"><FolderKanban className="h-4 w-4" /></span>{siteConfig.name}</Link><div className="relative max-w-lg"><p className="text-xs font-semibold uppercase tracking-[.16em] text-emerald-200">Bắt đầu workspace</p><h1 className="mt-5 text-5xl font-semibold leading-tight tracking-[-.04em]">Một nơi để khách hàng nhận đúng file, đúng lúc.</h1><p className="mt-5 text-sm leading-7 text-white/60">Tạo tài khoản miễn phí để quản lý dự án và bàn giao file chuyên nghiệp hơn.</p><div className="mt-8 space-y-3 text-sm text-white/80"><p className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-300" /> Quản lý khách hàng và dự án</p><p className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-300" /> Bàn giao bằng link</p><p className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-300" /> Nhật ký hoạt động và bảo mật</p></div></div><p className="relative text-xs text-white/40">Workspace riêng · Không cần thẻ</p></section>
    <section className="flex items-center justify-center px-5 py-10 sm:px-8"><div className="w-full max-w-[460px]"><Link href="/" className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)]"><ArrowLeft className="h-4 w-4" /> Trang chủ</Link><div className="mt-10"><p className="text-sm font-semibold">Tạo tài khoản</p><h2 className="mt-2 text-3xl font-semibold tracking-tight">Chào mừng bạn 👋</h2><p className="mt-2 text-sm leading-6 text-[var(--muted)]">Thiết lập workspace của bạn trong chưa đầy một phút.</p></div><form onSubmit={submit} className="mt-8 space-y-4"><label className="block"><span className="mb-1.5 block text-sm font-medium">Họ và tên</span><Input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required placeholder="Nguyễn Văn A" /></label><label className="block"><span className="mb-1.5 block text-sm font-medium">Email</span><Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" required placeholder="ban@example.com" /></label><label className="block"><span className="mb-1.5 block text-sm font-medium">Mật khẩu</span><Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="new-password" minLength={8} required placeholder="Ít nhất 8 ký tự" /></label>{error ? <p className="rounded-xl bg-red-50 px-3 py-2.5 text-sm text-[var(--destructive)] dark:bg-red-950/30">{error}</p> : null}<Button className="mt-2 h-11 w-full" disabled={pending}>{pending ? 'Đang tạo tài khoản…' : <>Tạo tài khoản <ArrowRight className="h-4 w-4" /></>}</Button></form><p className="mt-5 text-center text-sm text-[var(--muted)]">Đã có tài khoản? <Link href="/dang-nhap" className="font-semibold text-[var(--primary)]">Đăng nhập</Link></p><p className="mt-8 text-center text-xs leading-5 text-[var(--muted)]">Bằng việc đăng ký, bạn đồng ý sử dụng workspace cho mục đích hợp pháp và an toàn.</p></div></section>
  </div></main>;
}
