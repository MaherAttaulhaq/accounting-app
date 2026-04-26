import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Sidebar } from '@/components/dashboard/sidebar';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  let session;
  try {
    session = await getSession();
  } catch (error) {
    console.error('Dashboard layout session error:', error);
    session = null;
  }

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col">
      <Header />
      <div className="flex-1 flex pt-16">
        <Sidebar />
        <main className="flex-1 ml-64 p-8 pb-24">
          {children}
        </main>
      </div>
      <div className="ml-64">
        <Footer />
      </div>
    </div>
  );
}