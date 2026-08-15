import * as React from 'react';
import { cn } from '@/lib/utils';
export const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(function Input({ className, ...props }, ref) { return <input ref={ref} className={cn('focus-ring h-9 w-full rounded-[8px] border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)]', className)} {...props} />; });
