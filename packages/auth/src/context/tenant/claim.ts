import { nanoid } from 'nanoid';

import { createEmail } from '../../dal/emailDAL.js';
import { deleteInvitation, findInvitationByCode } from '../../dal/invitationDAL.js';
import { createLocalLogin, createSocialLogin } from '../../dal/loginDAL.js';
import { createTenantUser } from '../../dal/tenantDAL.js';
import { createUser, findUserByEmail, findUserBySocialId } from '../../dal/userDAL.js';
import type { User } from '../../contract/DbType.js';
import type { Nil } from '../../result.js';
import { tenantUser } from '../../schema/identity.js';
import type { AuthContext, ExternalProfile } from '../../contract/Type.js';


export async function claimInvitation(ctx: AuthContext, code: string, password: string): Promise<Nil<User>> {
  const { db } = ctx;
  const invitation = await findInvitationByCode(db, code);

  if (!invitation) {
    throw 'Invitation not found';
  }

  const user = await findUserByEmail(db, invitation.email);

  if (user) {
    throw 'User already exists';
  }

  return await db.transaction(async (tx) => {
    const user = await createUser(db, invitation);

    await createEmail(db, user.id, invitation.email, true);
    await createTenantUser(db, invitation.tenantId, user.id);

    if (password) {
      const username = invitation.email;
      await createLocalLogin(db, user.id, username, password);
    }
    await deleteInvitation(tx, invitation.id);

    return user;
  });
}


export async function claimWithSocial(ctx: AuthContext, inviteCode: string, profile: ExternalProfile): Promise<Nil<User>> {
  const { db } = ctx;
  const invitation = await findInvitationByCode(db, inviteCode);

  if (!invitation) {
    throw 'Invitation not found';
  }

  const user = await findUserBySocialId(db, profile.provider, profile.subjectId);

  if (user) {
    throw 'User already exists';
  }

  const newUser = await db.transaction(async (tx) => {
    // Step 1: Create user
    const user = await createUser(db, invitation);

    // Step 2: Add email
    await createEmail(db, user.id, invitation.email, true);

    // If the claimed email is different from the invitation email, add the claimed email as well.
    if (profile.email !== invitation.email) {
      await createEmail(db, user.id, profile.email, profile.emailVerified);
    }

    // Step 3: add user to the tenant.
    await createTenantUser(db, invitation.tenantId, user.id);

    // Step 4: Create social login
    await createSocialLogin(db, user.id, profile.provider, profile.subjectId);

    // Step 5: Delete invitation
    await deleteInvitation(tx, invitation.id);

    return user;
  });

  return newUser;
}

export async function acceptInvitation(ctx: AuthContext, code: string, userId: string) {
  const { db } = ctx;
  const invitation = await findInvitationByCode(db, code);

  if (!invitation) {
    throw 'Invitation not found';
  }

  const now = new Date();
  const tenantId = invitation.tenantId;

  await db.transaction(async (tx) => {
    await tx.insert(tenantUser)
      .values({
        id: nanoid(),
        userId,
        tenantId,
        createdAt: now,
        updatedAt: now,
      });

    await deleteInvitation(tx, invitation.id);
  });
}
