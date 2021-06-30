import { deleteInvitation as deleteInvite, getInvitationById } from '../../data/invitation';
import { isAdmin, isUser } from '../Access';
import { inviteNotFound, noAccess } from '../AppError';
import { Context } from '../Context';
import { Result } from '../Output';
import { R } from '../R';


export async function deleteInvitation(ctx: Context, invitationId: bigint): DomainResult<Result> {

  const { db, access } = ctx;

  if (!isUser(access)) {
    return noAccess();
  }

  const invitation = await getInvitationById(db, invitationId);

  if (!invitation) {
    return inviteNotFound();
  }

  try {
    if (access.publications.some((x) => x.id === invitation.projectId)) {
      // This is a project level invitation
      await deleteInvite(db, invitation.id);
    } else if (!invitation.projectId && isAdmin(access)) {
      // This is an admin invite.
      await deleteInvite(db, invitation.id);
    } else {
      return inviteNotFound();
    }
  } catch (error) {
    // TODO: Unknown error
    return R.of({ status: false });
  }

  return R.of({ status: true });
}


export async function retryInvitation(ctx: Context, invitationId: bigint) {

  const { db, access } = ctx;

  if (!isUser(access)) {
    return noAccess();
  }

  const invitation = await getInvitationById(db, invitationId);

  if (!invitation) {
    return inviteNotFound();
  }

  // TODO: Pending work.
  try {
    if (access.publications.some((x) => x.id === invitation.projectId)) {
      // This is a project level invitation

    } else if (!invitation.projectId && isAdmin(access)) {
      // This is an admin invite.

    } else {

    }
  } catch (error) {
    // TODO: Unknown error
    return R.of({ status: false });
  }

  return R.of({ status: true });
}
