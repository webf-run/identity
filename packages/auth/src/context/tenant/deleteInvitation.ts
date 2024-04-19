import { isMember, type AuthContext } from '../../context.js';
import { deleteInvitation as deleteInvite, getInvitationById } from '../../dal/invitationDAL.js';


export async function deleteInvitation(ctx: AuthContext, inviteId: string): Promise<boolean> {
  const { access, db } = ctx;

  const invitation = await getInvitationById(db, inviteId);

  if (!invitation) {
    throw 'Invitation not found';
  }

  if (!isMember(access, invitation.tenantId)) {
    throw 'Invalid access';
  }

  const isDeleted = await deleteInvite(db, inviteId);

  return isDeleted;
}
