export default function PortalLoading() {
  return <div className="space-y-5" aria-label="Đang tải"><div className="h-7 w-48 animate-pulse rounded-[6px] bg-[var(--surface-muted)]" /><div className="h-4 w-72 max-w-full animate-pulse rounded bg-[var(--surface-muted)]" /><div className="grid gap-4 sm:grid-cols-2"><div className="surface h-32 animate-pulse rounded-[10px]" /><div className="surface h-32 animate-pulse rounded-[10px]" /></div><div className="surface h-64 animate-pulse rounded-[10px]" /></div>;
}
