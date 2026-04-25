import { getServerSession } from 'better-auth/server';
import { db } from '@/lib/db';
import { transactions } from '@/drizzle/schema';
import { eq, desc, and, gte, lte } from 'drizzle-orm';

export async function getTransactions(filters?: {
  startDate?: string;
  endDate?: string;
  type?: string;
  category?: string;
}) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  let query = db.select().from(transactions).where(eq(transactions.userId, session.user.id as string));

  if (filters?.startDate) {
    query = query.where(and(eq(transactions.userId, session.user.id as string), gte(transactions.date, filters.startDate)));
  }

  if (filters?.endDate) {
    query = query.where(and(eq(transactions.userId, session.user.id as string), lte(transactions.date, filters.endDate)));
  }

  if (filters?.type) {
    query = query.where(and(eq(transactions.userId, session.user.id as string), eq(transactions.type, filters.type)));
  }

  if (filters?.category) {
    query = query.where(and(eq(transactions.userId, session.user.id as string), eq(transactions.category, filters.category)));
  }

  return query.orderBy(desc(transactions.date));
}

export async function createTransaction(data: {
  date: string;
  type: string;
  category: string;
  amount: number;
  notes?: string;
}) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const [transaction] = await db
    .insert(transactions)
    .values({
      userId: session.user.id as string,
      date: new Date(data.date),
      type: data.type,
      category: data.category,
      amount: data.amount.toString(),
      notes: data.notes || null,
    })
    .returning();

  return transaction;
}

export async function updateTransaction(id: string, data: {
  date?: string;
  type?: string;
  category?: string;
  amount?: number;
  notes?: string;
}) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const [transaction] = await db
    .update(transactions)
    .set({
      ...(data.date && { date: new Date(data.date) }),
      ...(data.type && { type: data.type }),
      ...(data.category && { category: data.category }),
      ...(data.amount && { amount: data.amount.toString() }),
      ...(data.notes !== undefined && { notes: data.notes }),
      updatedAt: new Date(),
    })
    .where(and(eq(transactions.id, id), eq(transactions.userId, session.user.id as string)))
    .returning();

  return transaction;
}

export async function deleteTransaction(id: string) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  await db.delete(transactions).where(and(eq(transactions.id, id), eq(transactions.userId, session.user.id as string)));
}