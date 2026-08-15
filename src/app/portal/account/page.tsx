import { auth } from '../../../../auth';
import { prisma } from '@/lib/db/prisma';
import { AccountForms } from '@/components/portal/account-forms';

export default async function PortalAccountPage() {
  const session = await auth();
  const user = await prisma.user.findUnique({ where: { id: session!.user.id }, include: { customerProfile: true } });
  return <div className="space-y-6"><header><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--primary)]">Tài khoản</p><h1 className="mt-1 text-2xl font-semibold tracking-tight">Tài khoản của bạn</h1><p className="mt-2 text-sm text-[var(--muted)]">Quản lý thông tin cá nhân và bảo mật.</p></header><div className="surface rounded-[10px] p-5"><p className="text-sm font-medium">{user?.email}</p><p className="mt-1 text-xs text-[var(--muted)]">Tài khoản khách hàng</p></div><AccountForms initialName={user?.name ?? ''} initialCompany={user?.customerProfile?.companyName ?? ''} initialPhone={user?.customerProfile?.phone ?? ''} /></div>;
}
