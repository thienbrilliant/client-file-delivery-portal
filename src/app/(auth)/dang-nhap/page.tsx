'use client';

import { FormEvent, useState } from 'react';
import { signIn } from 'next-auth/react';
import { LockKeyhole } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('ChangeMe123!');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
      callbackUrl: '/',
    });

    if (!result || result.error) {
      setError('Email hoặc mật khẩu không chính xác.');
      setPending(false);
      return;
    }

    window.location.assign(result.url ?? '/');
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-[420px]">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-[10px] border border-[var(--border)] bg-[var(--surface)] text-[var(--primary)] shadow-[var(--shadow-soft)]">
            <LockKeyhole className="h-5 w-5" strokeWidth={1.8} />
          </div>
          <p className="text-sm font-semibold">{siteConfig.name}</p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight">Đăng nhập</h1>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Truy cập không gian làm việc và quản lý bàn giao file.</p>
        </div>

        <form onSubmit={handleSubmit} className="surface rounded-[12px] p-5 sm:p-6">
          <div className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Email</span>
              <Input value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" required />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Mật khẩu</span>
              <Input value={password} onChange={(event) => setPassword(event.target.value)} type="password" autoComplete="current-password" required />
            </label>
          </div>

          {error ? <p className="mt-3 rounded-[8px] bg-red-50 px-3 py-2 text-sm text-[var(--destructive)] dark:bg-red-950/30">{error}</p> : null}

          <Button type="submit" className="mt-5 w-full" disabled={pending}>
            {pending ? 'Đang đăng nhập…' : 'Đăng nhập'}
          </Button>
        </form>

        <p className="mt-4 text-center text-xs leading-5 text-[var(--muted)]">
          Tài khoản seed chỉ dành cho development. Đổi mật khẩu trước khi dùng môi trường thật.
        </p>
      </div>
    </main>
  );
}
