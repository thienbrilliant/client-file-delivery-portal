import { cn } from '@/lib/utils';
export function Badge({ className, children }: { className?: string; children: React.ReactNode }) { return <span className={cn('inline-flex items-center rounded-[6px] border border-[var(--border)] bg-[var(--surface-muted)] px-2 py-1 text-xs font-medium text-[var(--muted)]', className)}>{children}</span>; }
