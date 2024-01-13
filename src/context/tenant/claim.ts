import { nanoid } from 'nanoid';
import type { User } from '../../db/model.js';
import type { Nil } from '../../result.js';
import { tenantUser } from '../../schema/identity.js';
import type { AuthContext } from '../type.js';
import { createNewUserByInvitation } from '../user/create.js';
import { findUserByEmail } from '../user/find.js';
import { findInvitationByCode } from '../../dal.js';
import { deleteInvitation } from '../../dal/invitationDAL.js';

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

export async function acceptInvitation(ctx: AuthContext, code: string, userId: string) {
  const { db } = ctx;
  const invitation = await findInvitationByCode(ctx, code);

  if (!invitation) {
    throw 'Invitation not found';
  }

  const now = new Date();
  const tenantId = invitation.tenantId;

  await db.insert(tenantUser)
    .values({
      id: nanoid(),
      userId,
      tenantId,
      createdAt: now,
      updatedAt: now,
    });

  await deleteInvitation(db, invitation.id);
}
