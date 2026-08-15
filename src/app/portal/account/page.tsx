import { auth } from '../../../../auth';
import { prisma } from '@/lib/db/prisma';
import { AccountForms } from '@/components/portal/account-forms';
import { SecurityActions } from './security-actions';

export default async function PortalAccountPage() {
  const session = await auth();
  const user = await prisma.user.findUnique({ where: { id: session!.user.id }, include: { customerProfile: true }, });
  const sessionCount = await prisma.session.count({ where: { userId: session!.user.id } });
  return <div className="space-y-6">
    <header><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--primary)]">Tài khoản</p><h1 className="mt-1 text-2xl font-semibold tracking-tight">Tài khoản của bạn</h1><p className="mt-2 text-sm text-[var(--muted)]">Quản lý thông tin cá nhân và bảo mật.</p></header>
    <section className="surface rounded-[10px] p-5"><p className="text-sm font-medium break-all">{user?.email}</p><p className="mt-1 text-xs text-[var(--muted)]">Tài khoản khách hàng · {user?.status === 'ACTIVE' ? 'Đang hoạt động' : 'Không hoạt động'}</p></section>
    <AccountForms initialName={user?.name ?? ''} initialCompany={user?.customerProfile?.companyName ?? ''} initialPhone={user?.customerProfile?.phone ?? ''} />
    <section className="surface rounded-[10px] p-5"><h2 className="font-semibold">Bảo mật</h2><p className="mt-1 text-sm text-[var(--muted)]">Thu hồi các phiên đăng nhập khi bạn nghi ngờ tài khoản đã được truy cập từ thiết bị khác.</p><div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-medium">Phiên đăng nhập</p><p className="text-xs text-[var(--muted)]">{sessionCount} phiên đang được lưu</p></div><SecurityActions /></div></section>
  </div>;
}
