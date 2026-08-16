export default function DashboardLoading() {
  return <div className="space-y-6" aria-label="Đang tải"><div className="h-7 w-52 animate-pulse rounded-[6px] bg-[var(--surface-muted)]" /><div className="h-4 w-80 max-w-full animate-pulse rounded bg-[var(--surface-muted)]" /><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }).map((_, index) => <div key={index} className="surface h-28 animate-pulse rounded-[10px]" />)}</div><div className="surface h-72 animate-pulse rounded-[10px]" /></div>;
}
