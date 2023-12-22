import { and, eq } from 'drizzle-orm';

import { DbClient } from '../db/client.js';
import { User, UserLocalLogin, UserToken } from '../db/model.js';
import { localLogin, providerLogin, user, userEmail, userToken } from '../db/schema.js';
import { generateUserToken, hashPassword } from './code.js';

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


export async function findUserBySocialId(db: DbClient, providerId: string, subjectId: string): Promise<Nil<User>> {
  const result = await db
    .select()
    .from(providerLogin)
    .innerJoin(user, eq(providerLogin.userId, user.id))
    .where(and(eq(providerLogin.providerId, providerId), eq(providerLogin.subjectId, subjectId)));

  return result.at(0)?.user;
}


export async function createToken(db: DbClient, userId: string): Promise<Nil<UserToken>> {
  const tokenId = generateUserToken();

  // Create a user token
  const added = await db.insert(userToken).values({
    id: tokenId,
    userId,
    duration: 3600 * 1000 * 72,
    generatedAt: new Date(),
  }).returning();

  return added.at(0);
}

export async function changePassword(db: DbClient, userId: string, newPassword: string): Promise<Nil<any>> {
  const [password, hashFn] = await hashPassword(newPassword);

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
