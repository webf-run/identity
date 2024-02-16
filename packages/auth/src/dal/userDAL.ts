import { eq, and } from 'drizzle-orm';
import { nanoid } from 'nanoid';

import type { Page, User, UserToken } from '../contract/DbType.js';
import type { UserInput, UserWithMembership } from '../contract/Type.js';
import type { DbClient } from '../db/client.js';
import type { Nil } from '../result.js';
import { providerLogin, tenantUser, user, userEmail, userToken } from '../schema/identity.js';
import { bearerToken } from '../util/code.js';
import { aggregate } from '../util/map.js';

/**
 * Generate a cryptographically secure token for the user that can be used to make
 * API calls.
 * @param db
 * @param userId
 * @returns
 */
export async function createToken(db: DbClient, userId: string): Promise<Nil<UserToken>> {
  const tokenId = bearerToken();

  // Create a user token
  const added = await db
    .insert(userToken)
    .values({
      id: tokenId,
      userId,
      duration: 3600 * 1000 * 72,
      generatedAt: new Date(),
    })
    .returning();

  return added.at(0);
}

export async function deleteToken(db: DbClient, token: string): Promise<void> {
  const _ = await db
    .delete(userToken)
    .where(eq(userToken.id, token));
}


export async function createUser(db: DbClient, input: UserInput) {
  const now = new Date();

  const newUser = {
    id: nanoid(),
    firstName: input.firstName,
    lastName: input.lastName,
    createdAt: now,
    updatedAt: now,
  };

  await db.insert(user)
    .values(newUser);

  return newUser;
}

export async function findUserByEmail(db: DbClient, email: string): Promise<Nil<User>> {
  const result = await db
    .select()
    .from(userEmail)
    .innerJoin(user, eq(userEmail.userId, user.id))
    .where(eq(userEmail.email, email));

  return result.at(0)?.app_user;
}


export async function findUserBySocialId(db: DbClient, providerId: string, subjectId: string): Promise<Nil<User>> {
  const result = await db
    .select()
    .from(providerLogin)
    .innerJoin(user, eq(providerLogin.userId, user.id))
    .where(and(eq(providerLogin.providerId, providerId), eq(providerLogin.subjectId, subjectId)));

  return result.at(0)?.app_user;
}


export async function findUserByToken(db: DbClient, token: string): Promise<Nil<UserWithMembership>> {
  const result = await db
    .select()
    .from(userToken)
    .innerJoin(user, eq(userToken.userId, user.id))
    .innerJoin(tenantUser, eq(userToken.userId, tenantUser.userId))
    .where(eq(userToken.id, token));

  const found = result.at(0);

  if (!found) {
    return null;
  }

  const tenants: string[] = result.map((x) => x.tenant_user.tenantId);

  return {
    ...found.app_user,
    tenants,
  };
}

export async function getUsersByTenant(db: DbClient, tenantId: string, page: Page): Promise<User[]> {
  const result = await db
    .select()
    .from(tenantUser)
    .innerJoin(user, eq(tenantUser.userId, user.id))
    .where(eq(tenantUser.tenantId, tenantId))
    .limit(page.size)
    .offset(page.number * page.size);


  const results = aggregate(result, (x) => x.app_user.id, (x) => x.app_user);

  return results;
}
