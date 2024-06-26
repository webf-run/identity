import cryptoRandomString from 'crypto-random-string';
import { sql, eq, and, gte } from 'drizzle-orm';

import type { ResetPasswordRequest } from '../contract/DbType.js';
import type { DbClient } from '../db/client.js';
import type { Nil } from '../result.js';
import { resetPasswordRequest, userEmail } from '../schema/identity.js';
import { pk } from '../util/code.js';

export type ResetCount = { userId: string; count: number };

export async function findResetPasswordRequestByEmail(db: DbClient, email: string): Promise<Nil<ResetCount>> {
  const result = await db
    .select({
      userId: userEmail.userId,
      count: sql<number>`cast(count(${resetPasswordRequest.id}) as int)`,
    })
    .from(userEmail)
    .leftJoin(resetPasswordRequest, eq(userEmail.userId, resetPasswordRequest.userId))
    .where(eq(userEmail.email, email))
    .groupBy(userEmail.userId);

  return result.at(0);
}

export async function createResetPasswordRequest(db: DbClient, userId: string) {
  return await db
    .insert(resetPasswordRequest)
    .values({
      id: pk(),
      code: cryptoRandomString({ length: 96, type: 'url-safe' }),
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();
}

export async function findResetPasswordRequestByCode(db: DbClient, code: string, validTime: Date): Promise<Nil<ResetPasswordRequest>> {
  const result = await db
    .select()
    .from(resetPasswordRequest)
    .where(
      and(
        eq(resetPasswordRequest.code, code),
        gte(resetPasswordRequest.updatedAt, validTime)));

  return result.at(0);
}

export async function deleteResetPasswordRequest(db: DbClient, id: string): Promise<void> {
  await db
    .delete(resetPasswordRequest)
    .where(eq(resetPasswordRequest.id, id));
}
