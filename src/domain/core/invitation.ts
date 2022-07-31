import * as repo from '../../data/invitation';
import { isUser } from '../Access';
import { inviteNotFound, inviteNotYetExpired, noAccess } from '../AppError';
import { Context } from '../Context';
import { Result } from '../Output';
import { R } from '../R';


export async function deleteInvitation(ctx: Context, invitationId: string): DomainResult<Result> {

  const { db, access } = ctx;

  if (!isUser(access)) {
    return noAccess();
  }

  const invitation = await repo.getInvitationById(db, invitationId);

  if (!invitation) {
    return inviteNotFound();
  }

  try {
    if (access.scope?.id === invitation.publicationId) {
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


export async function retryInvitation(ctx: Context, invitationId: string): DomainResult<Result> {

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
    if (access.scope?.id === invitation.publicationId) {
      // This is a project level invitation
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
