'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';

interface BarChartData {
  month: string;
  income: number;
  expense: number;
}

interface IncomeExpenseBarChartProps {
  data: BarChartData[];
}

export function IncomeExpenseBarChart({ data }: IncomeExpenseBarChartProps) {
  if (data.length === 0) {
    return <div className="text-center text-muted-foreground py-8">No data available</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
          <Legend />
          <Bar dataKey="income" fill="#10B981" name="Income" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expense" fill="#EF4444" name="Expense" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}