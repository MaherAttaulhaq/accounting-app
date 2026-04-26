'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logout } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Receipt, BarChart3, LogOut, X } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/transactions', label: 'Transactions', icon: Receipt },
  { href: '/dashboard/reports', label: 'Reports', icon: BarChart3 },
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();

  const handleSignOut = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-64 bg-card border-r h-screen fixed left-0 top-16 z-40 flex flex-col"
    >
      {onClose && (
        <div className="flex justify-end p-2 md:hidden">
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-accent"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
      
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/20'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive w-full transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </motion.aside>
  );
}