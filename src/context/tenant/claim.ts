import type { User } from '../../db/model.js';
import type { Nil } from '../../result.js';
import type { AuthContext } from '../type.js';
import { createNewUserByInvitation } from '../user/create.js';
import { findUserByEmail } from '../user/find.js';
import { findInvitationByCode } from './invitation.js';

export async function claimInvitation(ctx: AuthContext, code: string, password: string): Promise<Nil<User>> {
  const invitation = await findInvitationByCode(ctx, code);

  if (!invitation) {
    throw 'Invitation not found';
  }

  const user = await findUserByEmail(ctx, invitation.email);

  if (user) {
    throw 'User already exists';
  }

  return createNewUserByInvitation(ctx, invitation, password);
}
