import { eq, and } from 'drizzle-orm';
import { nanoid } from 'nanoid';

import { UserLocalLogin } from '../context/DbType';
import { DbClient } from '../db/client';
import { Nil } from '../result';
import { localLogin, providerLogin, userEmail } from '../schema/identity';
import { hash } from '../util/hash';

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

export async function createLocalLogin(db: DbClient, userId: string, username: string, password: string) {
  const now = new Date();

  const [passwordHashed, hashFn] = await hash(password);

  const newLogin = {
    id: nanoid(),
    userId,
    username,
    password: passwordHashed,
    hashFn,
    createdAt: now,
    updatedAt: now,
  };

  await db.insert(localLogin)
    .values(newLogin);

  return newLogin;
}

export async function createSocialLogin(db: DbClient, userId: string, providerId: string, subjectId: string) {
  const newLogin = {
    id: nanoid(),
    userId,
    providerId,
    subjectId,
  };

  await db.insert(providerLogin)
    .values(newLogin);

  return newLogin;
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
