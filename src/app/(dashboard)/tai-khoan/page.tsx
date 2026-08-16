import { auth } from '../../../../auth';
import { prisma } from '@/lib/db/prisma';
import { AccountForms } from '@/components/portal/account-forms';
import { SecurityActions } from '@/components/portal/security-actions';

export default async function AdminAccountPage() {
  const session = await auth();
  if (!session?.user) return null;
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, include: { customerProfile: true } });
  const sessionCount = await prisma.session.count({ where: { userId: session.user.id } });

  return <div className="space-y-6 ui-rise">
    <header className="border-b border-[var(--border)] pb-6">
      <p className="text-[11px] font-bold uppercase tracking-[.17em] text-[var(--primary)]">Workspace / Tài khoản</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-[-.035em]">Tài khoản quản trị</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">Cập nhật thông tin cá nhân, mật khẩu và các phiên đăng nhập của tài khoản quản trị.</p>
    </header>
    <section className="surface flex flex-col gap-4 rounded-[12px] p-5 sm:flex-row sm:items-center">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--primary-soft)] font-bold text-[var(--primary)]">{(user?.name ?? 'Q').slice(0, 1).toUpperCase()}</div>
      <div className="min-w-0"><p className="font-semibold">{user?.name ?? 'Quản trị viên'}</p><p className="mt-1 truncate text-sm text-[var(--muted)]">{user?.email}</p><p className="mt-1 text-xs text-[var(--primary)]">Tài khoản quản trị · {user?.status === 'ACTIVE' ? 'Đang hoạt động' : 'Không hoạt động'}</p></div>
    </section>
    <AccountForms initialName={user?.name ?? ''} initialCompany={user?.customerProfile?.companyName ?? ''} initialPhone={user?.customerProfile?.phone ?? ''} />
    <section className="surface rounded-[12px] p-5"><h2 className="text-sm font-semibold">Phiên đăng nhập</h2><p className="mt-1 text-xs leading-5 text-[var(--muted)]">{sessionCount} phiên đang được lưu. Nếu nghi ngờ có truy cập trái phép, bạn có thể thu hồi toàn bộ phiên.</p><div className="mt-4"><SecurityActions /></div></section>
  </div>;
}
