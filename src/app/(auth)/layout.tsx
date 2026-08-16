import { redirect } from 'next/navigation';
import { auth } from '../../../auth';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (session?.user?.role === 'ADMIN') redirect('/tong-quan');
  if (session?.user?.role === 'CUSTOMER') redirect('/portal');
  return <div className="min-h-screen bg-[var(--background)]">{children}</div>;
}
