import { hash } from 'argon2';
import { nanoid } from 'nanoid';
import { AuthContext, UserInput } from '../context.js';
import type { User, UserToken } from '../db/model.js';
import type { Nil } from '../result.js';
import * as schema from '../schema/identity.js';
import type { DbClient } from '../type.js';
import { bearerToken } from '../util/code.js';

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
    .insert(schema.userToken)
    .values({
      id: tokenId,
      userId,
      duration: 3600 * 1000 * 72,
      generatedAt: new Date(),
    })
    .returning();

  return added.at(0);
}


export async function createNewUser(ctx: AuthContext, input: UserInput, password: string): Promise<User | null> {
  const { db } = ctx;
  const [passwordHashed, hashFn] = await hash(password);
  const now = new Date();

  // TODO: Email and Password validation pending2
  const user = {
    id: nanoid(),
    firstName: input.firstName,
    lastName: input.lastName,
    createdAt: now,
    updatedAt: now,
  };

  const userEmail = {
    id: nanoid(),
    userId: user.id,
    email: input.email,
    verified: true,
  };

  const localLogin = {
    id: nanoid(),
    userId: user.id,
    username: input.email,
    password: passwordHashed,
    hashFn,
    createdAt: now,
    updatedAt: now,
  };

  const tenantUser = {
    id: nanoid(),
    userId: user.id,
    tenantId: input.tenantId,
    createdAt: now,
    updatedAt: now,
  };

  await db.transaction(async (tx) => {
    await tx.insert(schema.user)
      .values(user);

    await tx.insert(schema.userEmail)
      .values(userEmail);

    await tx.insert(schema.localLogin)
      .values(localLogin);

    await tx.insert(schema.tenantUser)
      .values(tenantUser);
  });

  return user;
}
