'use client';

import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export function SignOutButton({ className = '' }: { className?: string }) {
  return (
    <button
      type="button"
      className={`focus-ring inline-flex items-center justify-center gap-2 ${className}`}
      onClick={() => void signOut({ callbackUrl: '/dang-nhap' })}
      aria-label="Đăng xuất"
    >
      <LogOut className="h-4 w-4" strokeWidth={1.8} />
      <span>Đăng xuất</span>
    </button>
  );
}
