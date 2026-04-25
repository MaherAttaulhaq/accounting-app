import { redirect } from 'next/navigation';
import { getServerSession } from 'better-auth/react';
import { Sidebar } from '@/components/dashboard/sidebar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar />
      <main className="ml-64 p-8">{children}</main>
    </div>
  );
}