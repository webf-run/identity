import { Invitation, Prisma } from '@prisma/client';

import { hashPassword } from '../../data/code';
import { findUserByEmail } from '../../data/user';

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

  const invitation = await findInvitation(ctx, code);

  if (!invitation) {
    return invalidInvite();
  }

  const { user } = access;
  const canClaim = user.email === invitation.email;

  if (!canClaim) {
    return invalidInvite();
  }

  if (invitation.projectId) {
    const request = addUserToStaff(ctx, invitation.projectId, user.id);
    const cleanup = deleteInvitation(ctx, invitation);

    await db.$transaction([request, cleanup]);
  } else {
    const request = addUserToAdmin(ctx, user.id);
    const cleanup = deleteInvitation(ctx, invitation);

    await db.$transaction([request, cleanup]);
  }

  return R.of({ status: true });
}


export async function claimInvitation(ctx: Context, code: string, password: string): DomainResult<Result> {

  const invitation = await findInvitation(ctx, code);

  if (!invitation) {
    return invalidInvite();
  }

  const user = await findUserByEmail(ctx.db, invitation.email);

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
  const [passwordHashed, hashFn] = await hashPassword(password);

  try {
    const request = db.staff.create({
      data: {
        publication: {
          connect: {
            id: invitation.projectId!
          }
        },
        user: {
          create: buildUser(invitation, passwordHashed, hashFn)
        }
      }
    });

    const cleanup = deleteInvitation(ctx, invitation);

    await db.$transaction([request, cleanup]);

    return R.of({ status: true });
  } catch (error) {

    // Currently, it is not possible to cleannly map the errors occured during transaction.
    return R.of({ status: false });
  }
}


async function createAdmin(ctx: Context, invitation: Invitation, password: string) {

  const { db } = ctx;
  const [passwordHashed, hashFn] = await hashPassword(password);

  try {
    const request = ctx.db.admin.create({
      data: {
        superAdmin: false,
        user: {
          create: buildUser(invitation, passwordHashed, hashFn)
        }
      }
    });

    const cleanup = deleteInvitation(ctx, invitation);

    await db.$transaction([request, cleanup]);

    return R.of({ status: true });

  } catch (error) {
    // Currently, it is not possible to cleannly map the errors occured during transaction.
    return R.of({ status: false });
  }
}


function buildUser(invitation: Invitation, hash: string, hashFn: string): Prisma.UserCreateInput {

  return {
    email: invitation.email,
    firstName: invitation.firstName,
    lastName: invitation.lastName,
    password: hash,
    hashFn
  }
}


function addUserToAdmin(ctx: Context, userId: bigint) {
  return ctx.db.admin.create({
    data: {
      superAdmin: false,
      id: userId
    }
  });
}


function addUserToStaff(ctx: Context, publicationId: bigint, userId: bigint) {
  return ctx.db.staff.create({
    data: { publicationId, userId }
  });
}


function findInvitation(ctx: Context, code: string) {
  return ctx.db.invitation.findUnique({
    where: {
      code
    }
  });
}


function deleteInvitation(ctx: Context, invitation: Invitation) {
  return ctx.db.invitation.delete({
    where: { id: invitation.id }
  });
}


function invalidInvite() {
  return R.ofError(ErrorCode.NOT_FOUND, 'Invalid invitation');
}


function userExists() {
  return R.ofError(ErrorCode.ALREADY_EXISTS, 'User already exists');
}
