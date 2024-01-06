import { and, eq } from 'drizzle-orm';

import { Nil } from '../../result.js';
import { providerLogin, tenantUser, user, userToken } from '../../schema/identity.js';
import { bearerToken } from '../../data/code.js';
import { DbClient } from '../../db/client.js';
import type { User, UserToken } from '../../db/model.js';
import { UserWithMembership } from '../access.js';
import { AuthToken } from '../type.js';


export async function createBearerToken(db: DbClient, userId: string): Promise<AuthToken> {
  // Generate a token for the user.
  const token = await createToken(db, userId);

  return {
    ...token!,
    type: 'bearer',
  };
}


export async function findUserBySocialId(db: DbClient, providerId: string, subjectId: string): Promise<Nil<User>> {
  const result = await db
    .select()
    .from(providerLogin)
    .innerJoin(user, eq(providerLogin.userId, user.id))
    .where(and(eq(providerLogin.providerId, providerId), eq(providerLogin.subjectId, subjectId)));

  return result.at(0)?.user;
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
    ...found.user,
    tenants,
  };
}

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
