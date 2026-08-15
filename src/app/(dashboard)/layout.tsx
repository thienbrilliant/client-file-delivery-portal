import { auth } from '../../../auth';
import { redirect } from 'next/navigation';
import { DashboardShell } from '@/components/layout/dashboard-shell';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) redirect('/dang-nhap');

  return <DashboardShell userName={session.user.name}>{children}</DashboardShell>;
}
