import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './db';
import * as schema from './drizzle/schema';
import { eq } from 'drizzle-orm';
import { createHash } from 'crypto';

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const sha256Hash = createHash('sha256').update(password).digest('hex');
  return sha256Hash === hash;
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    async verifyCredentials(email: string, password: string) {
      const [user] = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, email));
      
      if (!user || !user.passwordHash) {
        return null;
      }

      const isValid = await verifyPassword(password, user.passwordHash);
      if (!isValid) {
        return null;
      }

      return { id: user.id, email: user.email, name: user.name };
    },
  },
  trustedOrigins: [
    'http://localhost:3000',
    'https://accounting-app-omega-five.vercel.app',
    'https://accounting-jk6xwlgf5-maherattaulhaqs-projects.vercel.app',
  ],
  secret: process.env.BETTER_AUTH_SECRET || 'default-secret-key-change-in-production',
});