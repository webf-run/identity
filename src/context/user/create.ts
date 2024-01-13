import { nanoid } from 'nanoid';

import { bearerToken } from '../../data/code.js';
import { hash } from '../../data/hash.js';
import type { User, UserToken } from '../../db/model.js';
import type { Nil } from '../../result.js';
import * as schema from '../../schema/identity.js';
import { deleteInvitation } from '../tenant/invitation.js';
import type { AuthContext, AuthToken, Invitation } from '../type.js';


export type UserInput = {
  firstName: string;
  lastName: string;
  email: string;
};


export async function createNewUserByInvitation(ctx: AuthContext, invitation: Invitation, password: string): Promise<Nil<User>> {
  const { db } = ctx;

  // TODO: Transaction scope
  const user = await createNewUser(ctx, invitation, password);
  await deleteInvitation(ctx, invitation.id);

  return user;
}


export async function createBearerToken(context: AuthContext, userId: string): Promise<AuthToken> {
  // Generate a token for the user.
  const token = await createToken(context, userId);

  return {
    ...token!,
    type: 'bearer',
  };
}


/**
 * Generate a cryptographically secure token for the user that can be used to make
 * API calls.
 * @param db
 * @param userId
 * @returns
 */
export async function createToken(context: AuthContext, userId: string): Promise<Nil<UserToken>> {
  const { db } = context;
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

  await db.transaction(async (tx) => {
    await db.insert(schema.user)
      .values(user);

    await db.insert(schema.userEmail)
      .values(userEmail);

    await db.insert(schema.localLogin)
      .values(localLogin);
  });

  return user;
}
