import type { LucideIcon } from 'lucide-react';

export function SectionPage({
  title,
  description,
  icon: Icon,
  eyebrow = 'Không gian làm việc',
  children,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  eyebrow?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="space-y-7">
      <header>
        <p className="text-sm text-[var(--muted)]">{eyebrow}</p>
        <div className="mt-2 flex items-start gap-3">
          <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--muted)]">
            <Icon className="h-4 w-4" strokeWidth={1.8} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-[28px]">{title}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">{description}</p>
          </div>
        </div>
      </header>

      <section className="surface rounded-[10px] p-6 sm:p-8">
        {children ?? (
          <div className="flex min-h-[260px] items-center justify-center text-center">
            <div className="max-w-md">
              <h2 className="text-sm font-semibold">Phần này đã sẵn sàng cho dữ liệu</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                Giao diện đã được nối vào hệ thống điều hướng. Các chức năng quản lý chi tiết sẽ được triển khai trong milestone tiếp theo.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
