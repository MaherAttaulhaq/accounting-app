import { redirect } from 'next/navigation';
import { getServerSession } from 'better-auth/react';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
  
  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="w-full max-w-md px-4">
        {children}
      </div>
    </div>
  );
}