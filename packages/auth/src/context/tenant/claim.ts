import type { User } from '../../contract/DbType.js';
import type { AuthContext, ExternalProfile } from '../../contract/Type.js';
import { createEmail } from '../../dal/emailDAL.js';
import { deleteInvitation, findInvitationByCode } from '../../dal/invitationDAL.js';
import { createLocalLogin, createSocialLogin } from '../../dal/loginDAL.js';
import { addTenantUser } from '../../dal/tenantDAL.js';
import { createUser, findUserByEmail, findUserBySocialId } from '../../dal/userDAL.js';
import { isPublic, isUser } from '../access.js';


export async function claimInvitation(ctx: AuthContext, code: string, password: string): Promise<User> {
  const { access, db } = ctx;

  if (!isPublic(access)) {
    throw new Error('Invalid access');
  }

  const invitation = await findInvitationByCode(db, code);

  if (!invitation) {
    throw 'Invitation not found';
  }

  const user = await findUserByEmail(db, invitation.email);

  if (user) {
    throw 'User already exists';
  }

  return await db.transaction(async (tx) => {
    const user = await createUser(tx, invitation);

    await createEmail(tx, user.id, invitation.email, true);
    await addTenantUser(tx, invitation.tenantId, user.id);

    if (password) {
      const username = invitation.email;
      await createLocalLogin(tx, user.id, username, password);
    }

    await deleteInvitation(tx, invitation.id);

    return user;
  });
}


export async function claimWithSocial(ctx: AuthContext, inviteCode: string, profile: ExternalProfile): Promise<User> {
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
    const user = await createUser(tx, invitation);

    // Step 2: Add email
    await createEmail(tx, user.id, invitation.email, true);

    // If the claimed email is different from the invitation email, add the claimed email as well.
    if (profile.email !== invitation.email) {
      await createEmail(tx, user.id, profile.email, profile.emailVerified);
    }

    // Step 3: add user to the tenant.
    await addTenantUser(tx, invitation.tenantId, user.id);

    // Step 4: Create social login
    await createSocialLogin(tx, user.id, profile.provider, profile.subjectId);

    // Step 5: Delete invitation
    await deleteInvitation(tx, invitation.id);

    return user;
  });

  return newUser;
}

export async function acceptInvitation(ctx: AuthContext, code: string): Promise<boolean> {
  const { access, db } = ctx;

  if (!isUser(access)) {
    throw new Error('Invalid access');
  }

  const userId = access.user.id;
  const invitation = await findInvitationByCode(db, code);

  if (!invitation) {
    throw 'Invitation not found';
  }

  const tenantId = invitation.tenantId;

  await db.transaction(async (tx) => {
    await addTenantUser(tx, tenantId, userId);
    await deleteInvitation(tx, invitation.id);
  });

  return true;
}
