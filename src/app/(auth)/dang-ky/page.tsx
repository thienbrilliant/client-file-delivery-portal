'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, FolderKanban, ShieldCheck } from 'lucide-react';
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
    setPending(true);
    setError(null);
    const response = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, password }) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) { setError(data.error ?? 'Không thể tạo tài khoản.'); setPending(false); return; }
    const result = await signIn('credentials', { email, password, redirect: false, callbackUrl: '/tong-quan' });
    if (!result || result.error) { window.location.assign('/dang-nhap'); return; }
    window.location.assign(result.url ?? '/tong-quan');
  }

  return <main className="min-h-screen bg-[var(--background)] lg:p-4">
    <div className="grid min-h-screen overflow-hidden bg-[var(--surface)] lg:min-h-[calc(100vh-2rem)] lg:grid-cols-[.9fr_1.1fr] lg:rounded-[16px] lg:border lg:border-[var(--border)] lg:shadow-[var(--shadow-medium)]">
      <section className="relative hidden overflow-hidden bg-[var(--primary)] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
        <div className="absolute -right-28 -top-20 h-80 w-80 rounded-full bg-emerald-200/15 blur-3xl" /><div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-[var(--accent)]/25 blur-3xl" />
        <Link href="/" className="relative flex items-center gap-3 font-bold"><span className="flex h-10 w-10 items-center justify-center rounded-[7px] bg-white text-[var(--primary)]"><FolderKanban className="h-4 w-4" /></span>{siteConfig.name}</Link>
        <div className="relative max-w-lg"><p className="text-[11px] font-bold uppercase tracking-[.18em] text-emerald-100">Start with structure</p><h1 className="mt-5 text-balance text-5xl font-semibold leading-[1.05] tracking-[-.045em]">Một workspace rõ ràng bắt đầu từ một tài khoản.</h1><p className="mt-6 text-sm leading-7 text-white/70">Tạo tài khoản để quản lý khách hàng, dự án, file và các lần bàn giao trong cùng một hệ thống.</p><div className="mt-9 space-y-3 text-sm text-white/90"><p className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-200" /> Quản lý khách hàng và dự án</p><p className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-200" /> Tổ chức file theo ngữ cảnh</p><p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-200" /> Kiểm soát quyền truy cập ở server</p></div></div>
        <p className="relative text-xs text-white/45">Self-hosted · Bạn kiểm soát dữ liệu và hạ tầng</p>
      </section>

      <section className="flex items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-[460px]"><Link href="/" className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)]"><ArrowLeft className="h-4 w-4" /> Trang chủ</Link><div className="mt-12"><p className="text-[11px] font-bold uppercase tracking-[.16em] text-[var(--primary)]">New workspace</p><h2 className="mt-2 text-3xl font-semibold tracking-[-.03em]">Tạo tài khoản</h2><p className="mt-2 text-sm leading-6 text-[var(--muted)]">Thiết lập thông tin đăng nhập để bắt đầu workspace.</p></div>
          <form onSubmit={submit} className="mt-8 space-y-4"><label className="block"><span className="mb-1.5 block text-sm font-semibold">Họ và tên</span><Input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required placeholder="Nguyễn Văn A" /></label><label className="block"><span className="mb-1.5 block text-sm font-semibold">Email</span><Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" required placeholder="you@example.com" /></label><label className="block"><span className="mb-1.5 block text-sm font-semibold">Mật khẩu</span><Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="new-password" minLength={8} required placeholder="Ít nhất 8 ký tự" /></label>{error ? <p role="alert" className="border border-[var(--destructive)]/20 bg-[var(--destructive-soft)] px-3 py-2.5 text-sm text-[var(--destructive)]">{error}</p> : null}<Button className="mt-2 h-11 w-full" disabled={pending}>{pending ? 'Đang tạo tài khoản…' : <>Tạo tài khoản <ArrowRight className="h-4 w-4" /></>}</Button></form>
          <p className="mt-6 border-t border-[var(--border)] pt-5 text-center text-sm text-[var(--muted)]">Đã có tài khoản? <Link href="/dang-nhap" className="font-bold text-[var(--primary)] hover:underline">Đăng nhập</Link></p><p className="mt-8 text-center text-xs leading-5 text-[var(--muted)]">Mật khẩu được xử lý phía máy chủ và không được hiển thị lại.</p>
        </div>
      </section>
    </div>
  </main>;
}
