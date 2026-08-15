import { Sidebar } from '@/components/layout/sidebar';
import { MobileHeader } from '@/components/layout/mobile-header';

export function DashboardShell({ children, userName }: { children: React.ReactNode; userName?: string | null }) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="flex min-h-screen">
        <Sidebar userName={userName} />
        <div className="min-w-0 flex-1">
          <MobileHeader />
          <main className="mx-auto w-full max-w-[1440px] px-4 py-5 sm:px-6 lg:px-8 lg:py-7">{children}</main>
        </div>
      </div>
    </div>
  );
}
