import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'outline';

export function Badge({ className, children, variant = 'default' }: { className?: string; children: React.ReactNode; variant?: BadgeVariant }) {
  return <span className={cn('inline-flex items-center rounded-[6px] border px-2 py-1 text-xs font-medium', variant === 'outline' ? 'border-[var(--border)] bg-transparent text-[var(--muted)]' : 'border-[var(--border)] bg-[var(--surface-muted)] text-[var(--muted)]', className)}>{children}</span>;
}
