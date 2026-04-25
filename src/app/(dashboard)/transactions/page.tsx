'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TransactionForm } from '@/components/transactions/transaction-form';
import { TransactionTable } from '@/components/transactions/transaction-table';
import { DeleteDialog } from '@/components/transactions/delete-dialog';
import { Plus, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/utils';

interface Transaction {
  id: string;
  date: string;
  type: string;
  category: string;
  amount: number;
  notes: string | null;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Transaction | undefined>(undefined);
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    startDate: '',
    endDate: '',
  });

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.type !== 'all') params.set('type', filters.type);
      if (filters.category !== 'all') params.set('category', filters.category);
      if (filters.startDate) params.set('startDate', filters.startDate);
      if (filters.endDate) params.set('endDate', filters.endDate);

      const res = await fetch(`/api/transactions?${params}`);
      const data = await res.json();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleEdit = (transaction: Transaction) => {
    setEditData(transaction);
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await fetch(`/api/transactions?id=${deleteId}`, { method: 'DELETE' });
      setDeleteId(null);
      fetchTransactions();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const handleFormSuccess = () => {
    setFormOpen(false);
    setEditData(undefined);
    fetchTransactions();
  };

  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="text-muted-foreground">Manage your income and expenses</p>
        </div>
        <Button onClick={() => setFormOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Transaction
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select value={filters.type} onValueChange={(v) => setFilters({ ...filters, type: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filters.category} onValueChange={(v) => setFilters({ ...filters, category: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Salary">Salary</SelectItem>
                  <SelectItem value="Freelance">Freelance</SelectItem>
                  <SelectItem value="Food">Food</SelectItem>
                  <SelectItem value="Rent">Rent</SelectItem>
                  <SelectItem value="Utilities">Utilities</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                placeholder="Start Date"
              />
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                placeholder="End Date"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="grid grid-cols-2 gap-4"
      >
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Total Income</div>
            <div className="text-2xl font-bold text-income">+{formatCurrency(totalIncome)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Total Expenses</div>
            <div className="text-2xl font-bold text-expense">-{formatCurrency(totalExpenses)}</div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card>
          <CardContent className="p-0">
            <TransactionTable transactions={transactions} onEdit={handleEdit} onDelete={setDeleteId} />
          </CardContent>
        </Card>
      </motion.div>

      <TransactionForm open={formOpen} onOpenChange={setFormOpen} onSuccess={handleFormSuccess} editData={editData} />
      <DeleteDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} onConfirm={handleDelete} />
    </div>
  );
}