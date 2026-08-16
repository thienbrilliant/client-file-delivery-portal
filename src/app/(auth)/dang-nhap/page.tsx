'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, FolderKanban, LockKeyhole, ShieldCheck } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { siteConfig } from '@/config/site';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const googleEnabled = process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === 'true';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setError(null);
    const result = await signIn('credentials', { email, password, redirect: false, callbackUrl: '/tong-quan' });
    if (!result || result.error) { setError('Email hoặc mật khẩu không chính xác.'); setPending(false); return; }
    window.location.assign(result.url ?? '/tong-quan');
  }

  return <main className="min-h-[100svh] bg-[var(--background)] p-0 sm:p-3">
    <div className="grid min-h-[100svh] overflow-hidden border-[var(--border)] bg-[var(--surface)] sm:min-h-[calc(100svh-1.5rem)] sm:rounded-[14px] sm:border sm:shadow-[var(--shadow-medium)] lg:grid-cols-[1.02fr_.98fr]">
      <section className="relative hidden overflow-hidden bg-[var(--primary)] p-8 text-white lg:flex lg:flex-col lg:justify-between xl:p-11">
        <div className="absolute inset-0 muted-grid opacity-[.08]" /><div className="absolute -right-24 top-8 h-64 w-64 rounded-full bg-white/10 blur-3xl" /><div className="absolute -bottom-24 left-8 h-56 w-56 rounded-full bg-[var(--accent)]/20 blur-3xl" />
        <Link href="/" className="relative flex items-center gap-3 font-bold"><span className="flex h-9 w-9 items-center justify-center rounded-[7px] bg-white text-[var(--primary)]"><FolderKanban className="h-4 w-4" /></span><span>{siteConfig.name}</span></Link>
        <div className="relative max-w-lg"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-emerald-100">Client workspace</p><h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.05] tracking-[-.045em] xl:text-5xl">Từ dự án đến bàn giao, <span className="text-emerald-100">gọn trong một nơi.</span></h1><p className="mt-5 max-w-md text-sm leading-6 text-white/70">Quản lý khách hàng, file và delivery với một workflow rõ ràng, riêng tư và dễ vận hành.</p><div className="mt-7 grid max-w-md grid-cols-2 gap-2.5"><div className="border border-white/10 bg-white/[.07] p-3.5"><p className="text-[9px] uppercase tracking-[.14em] text-white/45">01</p><p className="mt-2 text-sm font-semibold">Project-first</p><p className="mt-1 text-[11px] leading-4 text-white/50">File luôn nằm đúng ngữ cảnh.</p></div><div className="rounded-[9px] border border-white/10 bg-white/[.07] p-3.5"><p className="text-[9px] uppercase tracking-[.14em] text-emerald-100/70">02</p><p className="mt-2 text-sm font-semibold">Delivery-ready</p><p className="mt-1 text-[11px] leading-4 text-white/50">Link chia sẻ có kiểm soát.</p></div></div></div>
        <div className="relative flex items-center gap-4 text-[11px] text-white/55"><span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-200" /> Private storage</span><span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-emerald-200" /> Server-side access</span></div>
      </section>
      <section className="flex min-h-[100svh] items-center justify-center px-5 py-6 sm:px-8 sm:py-8 lg:min-h-0">
        <div className="w-full max-w-[380px]"><Link href="/" className="inline-flex items-center gap-2 text-xs text-[var(--muted)] hover:text-[var(--foreground)]"><ArrowLeft className="h-3.5 w-3.5" /> Trang chủ</Link><div className="mt-6"><div className="flex h-10 w-10 items-center justify-center rounded-[7px] bg-[var(--primary-soft)] text-[var(--primary)]"><LockKeyhole className="h-4 w-4" /></div><p className="mt-5 text-[10px] font-bold uppercase tracking-[.16em] text-[var(--primary)]">Welcome back</p><h2 className="mt-1.5 text-2xl font-semibold tracking-[-.03em]">Đăng nhập</h2><p className="mt-1.5 text-sm leading-5 text-[var(--muted)]">Mở workspace và tiếp tục công việc của bạn.</p></div>
          <div className="mt-5 space-y-2.5">{googleEnabled ? <Button type="button" variant="secondary" className="h-10 w-full" onClick={() => signIn('google', { callbackUrl: '/tong-quan' })}><span className="font-bold">G</span> Tiếp tục với Google</Button> : null}{googleEnabled ? <div className="flex items-center gap-3 py-0.5 text-[9px] font-semibold tracking-[.12em] text-[var(--muted)]"><span className="h-px flex-1 bg-[var(--border)]" /> HOẶC <span className="h-px flex-1 bg-[var(--border)]" /></div> : null}</div>
          <form onSubmit={handleSubmit} className="mt-2.5 space-y-3"><label className="block"><span className="mb-1 block text-xs font-semibold">Email</span><Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" required placeholder="you@example.com" /></label><label className="block"><span className="mb-1 block text-xs font-semibold">Mật khẩu</span><Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="current-password" required placeholder="Nhập mật khẩu" /></label>{error ? <p role="alert" className="border border-[var(--destructive)]/20 bg-[var(--destructive-soft)] px-3 py-2 text-xs text-[var(--destructive)]">{error}</p> : null}<Button type="submit" className="h-10 w-full" disabled={pending}>{pending ? 'Đang đăng nhập…' : <>Đăng nhập <ArrowRight className="h-3.5 w-3.5" /></>}</Button></form>
          <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-4 text-xs"><span className="text-[var(--muted)]">Chưa có tài khoản?</span><Link href="/dang-ky" className="font-bold text-[var(--primary)] hover:underline">Tạo tài khoản</Link></div><p className="mt-5 text-center text-[10px] leading-4 text-[var(--muted)]">Bảo mật tài khoản và quyền truy cập được kiểm tra ở phía máy chủ.</p>
        </div>
      </section>
    </div>
  </main>;
}
