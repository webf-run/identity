import { deleteInvitation, findInvitationByCode, InvitationAndPub } from '../../data/invitation';
import { createNewUser, findUserByEmail } from '../../data/user';

import { ErrorCode } from '../AppError';
import { Context } from '../Context';
import { Result } from '../Output';
import { R } from '../R';


export async function claimInvitation(ctx: Context, code: string, password: string): DomainResult<Result> {

  const { db } = ctx;
  const invitation = await findInvitationByCode(db, code);

  if (!invitation) {
    return invalidInvite();
  }

  const user = await findUserByEmail(db, invitation.email);

  if (user) {
    return userExists();
  }

  // TODO: Password validation pending

  return (await createStaffMember(ctx, invitation, password));
}


async function createStaffMember(ctx: Context, invitation: InvitationAndPub, password: string) {

  const { db } = ctx;

  try {
    const request = (await createNewUser(db, invitation, password))();
    const cleanup = deleteInvitation(db, invitation.id);

    await db.$transaction([request, cleanup]);

    return R.of({ status: true });
  } catch (error) {

    // Currently, it is not possible to cleanly map the errors occurred during transaction.
    return R.of({ status: false });
  }
}


function invalidInvite() {
  return R.ofError(ErrorCode.NOT_FOUND, 'Invalid invitation');
}


function userExists() {
  return R.ofError(ErrorCode.ALREADY_EXISTS, 'User already exists');
}
