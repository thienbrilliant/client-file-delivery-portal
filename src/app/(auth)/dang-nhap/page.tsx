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
    event.preventDefault();
    setPending(true);
    setError(null);
    const result = await signIn('credentials', { email, password, redirect: false, callbackUrl: '/tong-quan' });
    if (!result || result.error) {
      setError('Email hoặc mật khẩu không chính xác.');
      setPending(false);
      return;
    }
    window.location.assign(result.url ?? '/tong-quan');
  }

  return <main className="min-h-screen bg-[var(--background)] lg:p-4">
    <div className="grid min-h-screen overflow-hidden border-[var(--border)] bg-[var(--surface)] lg:min-h-[calc(100vh-2rem)] lg:grid-cols-[1.08fr_.92fr] lg:rounded-[16px] lg:border lg:shadow-[var(--shadow-medium)]">
      <section className="relative hidden overflow-hidden bg-[var(--foreground)] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
        <div className="absolute inset-0 muted-grid opacity-[.08]" />
        <div className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-[var(--primary)]/25 blur-3xl" />
        <div className="absolute -bottom-28 left-10 h-64 w-64 rounded-full bg-[var(--accent)]/20 blur-3xl" />
        <Link href="/" className="relative flex items-center gap-3 font-bold"><span className="flex h-10 w-10 items-center justify-center rounded-[7px] bg-[var(--primary)] text-white"><FolderKanban className="h-4 w-4" /></span><span>{siteConfig.name}</span></Link>
        <div className="relative max-w-xl">
          <p className="text-[11px] font-bold uppercase tracking-[.18em] text-emerald-200">Client workspace</p>
          <h1 className="mt-5 text-balance text-5xl font-semibold leading-[1.04] tracking-[-.045em] xl:text-6xl">Từ dự án đến bàn giao, <span className="text-emerald-200">gọn trong một nơi.</span></h1>
          <p className="mt-6 max-w-lg text-sm leading-7 text-white/65">Quản lý khách hàng, file và delivery với một workflow rõ ràng, riêng tư và dễ vận hành.</p>
          <div className="mt-9 grid max-w-lg grid-cols-2 gap-3">
            <div className="border border-white/10 bg-white/[.06] p-4"><p className="text-[10px] uppercase tracking-[.14em] text-white/45">01</p><p className="mt-3 text-sm font-semibold">Project-first</p><p className="mt-1 text-xs leading-5 text-white/45">File luôn nằm đúng ngữ cảnh.</p></div>
            <div className="rounded-[10px] border border-white/10 bg-emerald-300/10 p-4"><p className="text-[10px] uppercase tracking-[.14em] text-emerald-200/70">02</p><p className="mt-3 text-sm font-semibold">Delivery-ready</p><p className="mt-1 text-xs leading-5 text-white/45">Link chia sẻ có kiểm soát.</p></div>
          </div>
        </div>
        <div className="relative flex items-center gap-5 text-xs text-white/45"><span className="inline-flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-300" /> Private storage</span><span className="inline-flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-emerald-300" /> Server-side access</span></div>
      </section>

      <section className="flex items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-[420px]">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)]"><ArrowLeft className="h-4 w-4" /> Trang chủ</Link>
          <div className="mt-12"><div className="flex h-11 w-11 items-center justify-center rounded-[7px] bg-[var(--primary-soft)] text-[var(--primary)]"><LockKeyhole className="h-5 w-5" /></div><p className="mt-7 text-[11px] font-bold uppercase tracking-[.16em] text-[var(--primary)]">Welcome back</p><h2 className="mt-2 text-3xl font-semibold tracking-[-.03em]">Đăng nhập</h2><p className="mt-2 text-sm leading-6 text-[var(--muted)]">Mở workspace và tiếp tục công việc của bạn.</p></div>
          <div className="mt-8 space-y-3">
            {googleEnabled ? <Button type="button" variant="secondary" className="h-11 w-full" onClick={() => signIn('google', { callbackUrl: '/tong-quan' })}><span className="font-bold">G</span> Tiếp tục với Google</Button> : null}
            {googleEnabled ? <div className="flex items-center gap-3 py-1 text-[10px] font-semibold tracking-[.12em] text-[var(--muted)]"><span className="h-px flex-1 bg-[var(--border)]" /> HOẶC <span className="h-px flex-1 bg-[var(--border)]" /></div> : null}
          </div>
          <form onSubmit={handleSubmit} className="mt-3 space-y-4">
            <label className="block"><span className="mb-1.5 block text-sm font-semibold">Email</span><Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" required placeholder="you@example.com" /></label>
            <label className="block"><span className="mb-1.5 block text-sm font-semibold">Mật khẩu</span><Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="current-password" required placeholder="Nhập mật khẩu" /></label>
            {error ? <p role="alert" className="border border-[var(--destructive)]/20 bg-[var(--destructive-soft)] px-3 py-2.5 text-sm text-[var(--destructive)]">{error}</p> : null}
            <Button type="submit" className="h-11 w-full" disabled={pending}>{pending ? 'Đang đăng nhập…' : <>Đăng nhập <ArrowRight className="h-4 w-4" /></>}</Button>
          </form>
          <div className="mt-6 flex items-center justify-between border-t border-[var(--border)] pt-5 text-sm"><span className="text-[var(--muted)]">Chưa có tài khoản?</span><Link href="/dang-ky" className="font-bold text-[var(--primary)] hover:underline">Tạo tài khoản</Link></div>
          <p className="mt-8 text-center text-xs leading-5 text-[var(--muted)]">Bảo mật tài khoản và quyền truy cập được kiểm tra ở phía máy chủ.</p>
        </div>
      </section>
    </div>
  </main>;
}
