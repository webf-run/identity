import { Invitation } from '@prisma/client';

import { deleteInvitation, findInvitation } from '../../data/invitation';
import { addUserToAdmin, addUserToStaff, createAdminWithNewUser, createStaffWithNewUser, findUserByEmail } from '../../data/user';

import { isUser } from '../Access';
import { ErrorCode } from '../AppError';
import { Context } from '../Context';
import { Result } from '../Output';
import { R } from '../R';


export async function acceptInvitation(ctx: Context, code: string): DomainResult<Result> {

  const { db, access } = ctx;

  if (!isUser(access)) {
    return invalidInvite();
  }

  const invitation = await findInvitation(db, code);

  if (!invitation) {
    return invalidInvite();
  }

  const { user } = access;
  const canClaim = user.email === invitation.email;

  if (!canClaim) {
    return invalidInvite();
  }

  if (invitation.projectId) {
    const request = addUserToStaff(db, invitation.projectId, user.id);
    const cleanup = deleteInvitation(db, invitation.id);

    await db.$transaction([request, cleanup]);
  } else {
    const request = addUserToAdmin(db, user.id);
    const cleanup = deleteInvitation(db, invitation.id);

    await db.$transaction([request, cleanup]);
  }

  return R.of({ status: true });
}


export async function claimInvitation(ctx: Context, code: string, password: string): DomainResult<Result> {

  const { db } = ctx;
  const invitation = await findInvitation(db, code);

  if (!invitation) {
    return invalidInvite();
  }

  const user = await findUserByEmail(db, invitation.email);

  if (user) {
    return userExists();
  }

  // TODO: Password validation pending

  if (invitation.projectId) {
    return (await createStaffMember(ctx, invitation, password));
  } else {
    return (await createAdmin(ctx, invitation, password));
  }
}


async function createStaffMember(ctx: Context, invitation: Invitation, password: string) {

  const { db } = ctx;

  try {
    const request = (await createStaffWithNewUser(db, invitation, password))();
    const cleanup = deleteInvitation(db, invitation.id);

    await db.$transaction([request, cleanup]);

    return R.of({ status: true });
  } catch (error) {

    // Currently, it is not possible to cleanly map the errors occurred during transaction.
    return R.of({ status: false });
  }
}


async function createAdmin(ctx: Context, invitation: Invitation, password: string) {

  const { db } = ctx;

  try {
    const request = (await createAdminWithNewUser(db, invitation, password))();
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
