import { hash } from 'argon2';
import { and, eq } from 'drizzle-orm';

import type { Nil } from '../../result.js';
import { localLogin, userEmail } from '../../schema/identity.js';
import type { DbClient } from '../../type.js';
import { UserLocalLogin } from '../../db/model.js';

export async function changePassword(db: DbClient, userId: string, newPassword: string): Promise<Nil<any>> {
  const [password, hashFn] = await hash(newPassword);

  const result = await db
    .update(localLogin)
    .set({
      password,
      hashFn
    })
    .where(eq(localLogin.userId, userId))
    .returning();

  return result.at(0)
}


export async function findLoginByEmail(db: DbClient, email: string): Promise<Nil<UserLocalLogin>> {
  const result = await db
    .select({
      userId: userEmail.userId,
      loginId: userEmail.email,
      password: localLogin.password,
      hashFn: localLogin.hashFn,
    })
    .from(userEmail)
    .innerJoin(localLogin, eq(userEmail.userId, localLogin.userId))
    .where(
      and(
        eq(userEmail.email, email),
        eq(userEmail.verified, true)));

  return result.at(0);
}


export async function findLoginByUsername(db: DbClient, username: string): Promise<Nil<UserLocalLogin>> {
  const result = await db
    .select({
      userId: localLogin.userId,
      loginId: localLogin.username,
      password: localLogin.password,
      hashFn: localLogin.hashFn,
    })
    .from(localLogin)
    .where(eq(localLogin.username, username));

  return result.at(0);
}
