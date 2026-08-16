import * as React from 'react';
import { cn } from '@/lib/utils';

export const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(function Input({ className, ...props }, ref) {
  return <input ref={ref} className={cn('focus-ring h-10 w-full rounded-[7px] border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--foreground)] shadow-[var(--shadow-xs)] outline-none transition-[border-color,box-shadow,background-color] duration-150 placeholder:text-[var(--muted)] hover:border-[var(--primary)]/30 focus:border-[var(--ring)] focus:bg-[var(--surface-elevated)]', className)} {...props} />;
});
