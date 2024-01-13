import { deleteInvitation } from '../../dal/invitationDAL.js';
import { createNewUser, createToken } from '../../dal/userDAL.js';
import type { User } from '../../db/model.js';
import type { Nil } from '../../result.js';
import type { AuthContext, AuthToken, Invitation } from '../type.js';


export type UserInput = {
  firstName: string;
  lastName: string;
  email: string;
  tenantId: string;
};


export async function createNewUserByInvitation(ctx: AuthContext, invitation: Invitation, password: string): Promise<Nil<User>> {
  // TODO: Transaction scope
  const user = await createNewUser(ctx, invitation, password);
  await deleteInvitation(ctx.db, invitation.id);

  return user;
}


export async function createBearerToken(context: AuthContext, userId: string): Promise<AuthToken> {
  const { db } = context;
  // Generate a token for the user.
  const token = await createToken(db, userId);

  return {
    ...token!,
    type: 'bearer',
  };
}
