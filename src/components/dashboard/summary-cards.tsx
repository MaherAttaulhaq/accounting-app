'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

interface SummaryCardsProps {
  totalIncome: number;
  totalExpenses: number;
  loading?: boolean;
}

export function SummaryCards({ totalIncome, totalExpenses, loading }: SummaryCardsProps) {
  const balance = totalIncome - totalExpenses;

  const cards = [
    {
      title: 'Total Income',
      value: totalIncome,
      icon: TrendingUp,
      color: 'text-income',
      bgColor: 'bg-green-50 dark:bg-green-950',
    },
    {
      title: 'Total Expenses',
      value: totalExpenses,
      icon: TrendingDown,
      color: 'text-expense',
      bgColor: 'bg-red-50 dark:bg-red-950',
    },
    {
      title: 'Current Balance',
      value: balance,
      icon: Wallet,
      color: 'text-primary',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-24" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                ${card.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}