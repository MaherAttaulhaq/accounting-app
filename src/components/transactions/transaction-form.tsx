'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { motion } from 'framer-motion';

const transactionSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  type: z.enum(['income', 'expense']),
  category: z.string().min(1, 'Category is required'),
  amount: z.coerce.number().min(0.01, 'Amount must be greater than 0'),
  notes: z.string().optional(),
});

const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Business', 'Other Income'];
const expenseCategories = ['Food', 'Rent', 'Utilities', 'Transportation', 'Entertainment', 'Shopping', 'Healthcare', 'Education', 'Miscellaneous'];

interface TransactionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  editData?: {
    id: string;
    date: string;
    type: string;
    category: string;
    amount: number;
    notes: string | null;
  };
}

export function TransactionForm({ open, onOpenChange, onSuccess, editData }: TransactionFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: editData
      ? {
          date: editData.date,
          type: editData.type as 'income' | 'expense',
          category: editData.category,
          amount: editData.amount,
          notes: editData.notes || '',
        }
      : {
          date: new Date().toISOString().split('T')[0],
          type: 'expense',
          category: '',
          amount: 0,
          notes: '',
        },
  });

  const type = form.watch('type');
  const categories = type === 'income' ? incomeCategories : expenseCategories;

  const onSubmit = async (data: z.infer<typeof transactionSchema>) => {
    setLoading(true);
    try {
      const url = editData ? `/api/transactions?id=${editData.id}` : '/api/transactions';
      const method = editData ? 'PUT' : 'POST';

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      onOpenChange(false);
      onSuccess();
      form.reset();
    } catch (error) {
      console.error('Error saving transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px]">
        <SheetHeader>
          <SheetTitle>{editData ? 'Edit Transaction' : 'Add Transaction'}</SheetTitle>
        </SheetHeader>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Add notes..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? 'Saving...' : editData ? 'Update' : 'Add'}
                </Button>
              </div>
            </form>
          </Form>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}