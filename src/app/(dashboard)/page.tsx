import { redirect } from 'next/navigation';
import { getServerSession } from 'better-auth/server';
import { db } from '@/lib/db';
import { transactions } from '@/drizzle/schema';
import { eq, desc } from 'drizzle-orm';
import { SummaryCards } from '@/components/dashboard/summary-cards';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session) {
    redirect('/login');
  }

  const userTransactions = await db
    .select()
    .from(transactions)
    .where(eq(transactions.userId, session.user.id as string))
    .orderBy(desc(transactions.date))
    .limit(10);

  const totalIncome = userTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = userTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your financial overview.</p>
        </div>
        <Link href="/dashboard/transactions">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Transaction
          </Button>
        </Link>
      </motion.div>

      <SummaryCards totalIncome={totalIncome} totalExpenses={totalExpenses} />

      <RecentTransactions transactions={userTransactions} />
    </div>
  );
}