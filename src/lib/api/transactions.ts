import { db } from '../db';
import { transactions } from '@/lib/drizzle/schema';
import { eq, desc, and, gte, lte } from 'drizzle-orm';

export async function getTransactions(userId: string, filters?: {
  startDate?: string;
  endDate?: string;
  type?: string;
  category?: string;
}) {
  const conditions = [eq(transactions.userId, userId)];

  if (filters?.startDate) {
    conditions.push(gte(transactions.date, filters.startDate));
  }

  if (filters?.endDate) {
    conditions.push(lte(transactions.date, filters.endDate));
  }

  if (filters?.type) {
    conditions.push(eq(transactions.type, filters.type));
  }

  if (filters?.category) {
    conditions.push(eq(transactions.category, filters.category));
  }

  const query = db
    .select()
    .from(transactions)
    .where(and(...conditions))
    .orderBy(desc(transactions.date));

  return query;
}

export async function createTransaction(userId: string, data: {
  date: string;
  type: string;
  category: string;
  amount: number;
  notes?: string;
}) {
  const [transaction] = await db
    .insert(transactions)
    .values({
      userId: userId,
      date: data.date as any,
      type: data.type,
      category: data.category,
      amount: data.amount.toString(),
      notes: data.notes || null,
    })
    .returning();

  return transaction;
}

export async function updateTransaction(userId: string, id: string, data: {
  date?: string;
  type?: string;
  category?: string;
  amount?: number;
  notes?: string;
}) {
  const [transaction] = await db
    .update(transactions)
    .set({
      ...(data.date && { date: data.date as any }),
      ...(data.type && { type: data.type }),
      ...(data.category && { category: data.category }),
      ...(data.amount && { amount: data.amount.toString() }),
      ...(data.notes !== undefined && { notes: data.notes }),
      updatedAt: new Date(),
    })
    .where(and(eq(transactions.id, id), eq(transactions.userId, userId)))
    .returning();

  return transaction;
}

export async function deleteTransaction(userId: string, id: string) {
  await db.delete(transactions).where(and(eq(transactions.id, id), eq(transactions.userId, userId)));
}