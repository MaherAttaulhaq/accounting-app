'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Receipt, BarChart3, LogOut, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/transactions', label: 'Transactions', icon: Receipt },
  { href: '/dashboard/reports', label: 'Reports', icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/login';
  };

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-64 bg-white border-r h-screen fixed left-0 top-0 flex flex-col"
    >
      <div className="p-6 border-b">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold">AccountFlow</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
                isActive
                  ? 'bg-primary text-white'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground w-full transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </motion.aside>
  );
}