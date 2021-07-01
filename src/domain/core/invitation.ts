import * as repo from '../../data/invitation';
import { isAdmin, isUser } from '../Access';
import { inviteNotFound, inviteNotYetExpired, noAccess } from '../AppError';
import { Context } from '../Context';
import { Result } from '../Output';
import { R } from '../R';


export async function deleteInvitation(ctx: Context, invitationId: bigint): DomainResult<Result> {

  const { db, access } = ctx;

  if (!isUser(access)) {
    return noAccess();
  }

  const invitation = await repo.getInvitationById(db, invitationId);

  if (!invitation) {
    return inviteNotFound();
  }

  try {
    if (access.publications.some((x) => x.id === invitation.projectId)) {
      // This is a project level invitation
      await repo.deleteInvitation(db, invitation.id);
    } else if (!invitation.projectId && isAdmin(access)) {
      // This is an admin invite.
      await repo.deleteInvitation(db, invitation.id);
    } else {
      return inviteNotFound();
    }
  } catch (error) {
    // TODO: Unknown error
    return R.of({ status: false });
  }

  return R.of({ status: true });
}


export async function retryInvitation(ctx: Context, invitationId: bigint): DomainResult<Result> {

  const { db, access } = ctx;

  if (!isUser(access)) {
    return noAccess();
  }

  const invitation = await repo.getInvitationById(db, invitationId);

  if (!invitation) {
    return inviteNotFound();
  }

  if (invitation.expiryAt.getTime() > Date.now()) {
    return inviteNotYetExpired();
  }

  // TODO: Pending work.
  try {
    if (access.publications.some((x) => x.id === invitation.projectId)) {
      // This is a project level invitation
      await repo.extendInvitationExpiry(db, invitation);

    } else if (!invitation.projectId && isAdmin(access)) {
      // This is an admin invite.
      await repo.extendInvitationExpiry(db, invitation);
    } else {
      return inviteNotFound();
    }
  } catch (error) {
    // TODO: Unknown error
    return R.of({ status: false });
  }

  return R.of({ status: true });
}
