import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { db } from './db';
import { users } from '@/lib/drizzle/schema';
import { eq } from 'drizzle-orm';

const secretKey = process.env.BETTER_AUTH_SECRET || 'default-secret-key-change-in-production';
const encodedKey = new TextEncoder().encode(secretKey);

export async function createToken(userId: string): Promise<string> {
  return await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey);
}

export async function verifyToken(token: string): Promise<{ userId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, encodedKey);
    return payload as { userId: string };
  } catch {
    return null;
  }
}

export async function getSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session-token')?.value;
    
    if (!token) return null;
    
    const payload = await verifyToken(token);
    if (!payload) return null;
    
    const [user] = await db.select().from(users).where(eq(users.id, payload.userId));
    
    if (!user) return null;
    
    return { user: { id: user.id, name: user.name, email: user.email, image: user.image } };
  } catch (error) {
    console.error('getSession error:', error);
    return null;
  }
}