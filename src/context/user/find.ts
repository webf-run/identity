import { and, eq } from 'drizzle-orm';

import type { User } from '../../db/model.js';
import type { Nil } from '../../result.js';
import { providerLogin, tenantUser, user, userEmail, userToken } from '../../schema/identity.js';
import type { UserWithMembership } from '../access.js';
import type { AuthContext } from '../type.js';


export async function findUserByEmail(context: AuthContext, email: string): Promise<Nil<User>> {
  const { db } = context;

  const result = await db
    .select()
    .from(userEmail)
    .innerJoin(user, eq(userEmail.userId, user.id))
    .where(eq(userEmail.email, email));

  return result.at(0)?.user;
}


export async function findUserBySocialId(context: AuthContext, providerId: string, subjectId: string): Promise<Nil<User>> {
  const { db } = context;

  const result = await db
    .select()
    .from(providerLogin)
    .innerJoin(user, eq(providerLogin.userId, user.id))
    .where(and(eq(providerLogin.providerId, providerId), eq(providerLogin.subjectId, subjectId)));

  return result.at(0)?.user;
}


export async function findUserByToken(context: AuthContext, token: string): Promise<Nil<UserWithMembership>> {
  const { db } = context;

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
