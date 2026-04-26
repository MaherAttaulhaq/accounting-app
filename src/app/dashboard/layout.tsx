'use client';

import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth-client';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Sidebar } from '@/components/dashboard/sidebar';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export const dynamic = 'force-dynamic';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<{ user: any } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkSession() {
      try {
        const { getSession } = await import('@/lib/auth-client');
        const sessionData = await getSession();
        if (!sessionData.authenticated) {
          window.location.href = '/login';
          return;
        }
        setSession(sessionData as any);
      } catch (error) {
        console.error('Dashboard layout session error:', error);
        window.location.href = '/login';
      } finally {
        setLoading(false);
      }
    }
    checkSession();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header 
        user={session?.user} 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        menuOpen={sidebarOpen}
      />
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed z-50 md:hidden"
            >
              <Sidebar onClose={() => setSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="flex-1 pt-16 md:pl-64">
        <main className="p-4 md:p-8 pb-24">
          {children}
        </main>
      </div>
      
      <div className="md:pl-64">
        <Footer />
      </div>
    </div>
  );
}