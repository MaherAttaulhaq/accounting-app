'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface Transaction {
  id: string;
  date: string;
  type: string;
  category: string;
  amount: number;
  notes: string | null;
}

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export function TransactionTable({ transactions, onEdit, onDelete }: TransactionTableProps) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No transactions found. Add your first transaction to get started.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Notes</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction, index) => (
          <motion.tr
            key={transaction.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            className="hover:bg-muted/50"
          >
            <TableCell>{formatDate(transaction.date)}</TableCell>
            <TableCell>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  transaction.type === 'income'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}
              >
                {transaction.type}
              </span>
            </TableCell>
            <TableCell>{transaction.category}</TableCell>
            <TableCell className={`font-medium ${transaction.type === 'income' ? 'text-income' : 'text-expense'}`}>
              {transaction.type === 'income' ? '+' : '-'}${formatCurrency(transaction.amount)}
            </TableCell>
            <TableCell className="text-muted-foreground max-w-[200px] truncate">
              {transaction.notes || '-'}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                <Button variant="ghost" size="icon" onClick={() => onEdit(transaction)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(transaction.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </TableCell>
          </motion.tr>
        ))}
      </TableBody>
    </Table>
  );
}