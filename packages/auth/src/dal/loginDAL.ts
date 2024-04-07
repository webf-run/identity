import { eq, and } from 'drizzle-orm';

import { UserLocalLogin } from '../contract/DbType.js';
import { DbClient } from '../db/client.js';
import { Nil } from '../result.js';
import { localLogin, providerLogin, userEmail } from '../schema/identity.js';
import { pk } from '../util/code.js';
import { hash } from '../util/hash.js';

export async function changePassword(db: DbClient, userId: string, newPassword: string): Promise<Nil<boolean>> {
  const [password, hashFn] = await hash(newPassword);

  await db
    .update(localLogin)
    .set({
      password,
      hashFn
    })
    .where(eq(localLogin.userId, userId))
    .returning();

  return true;
}

export async function createLocalLogin(db: DbClient, userId: string, username: string, password: string) {
  const now = new Date();

  const [passwordHashed, hashFn] = await hash(password);

  const newLogin = {
    id: pk(),
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
    id: pk(),
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
