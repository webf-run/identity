import { Invitation, PrismaClient } from '@prisma/client';

import { UserInput } from '../domain/Input';
import { hashPassword } from './code';


export function findUserByEmail(db: PrismaClient, email: string) {
  return db.user.findUnique({
    where: {
      email
    }
  });
}

export async function isUserMemberOf(db: PrismaClient, publicationId: bigint, email: string) {
  const user = await db.user.findFirst({
    where: { email },
    include: {
      staff: {
        where: {
          publicationId
        }
      }
    }
  });

  return !!user?.staff && user.staff.length > 0;
}


export function addUserToAdmin(db: PrismaClient, userId: bigint) {
  return db.admin.create({
    data: {
      superAdmin: false,
      id: userId
    }
  });
}


export function addUserToStaff(db: PrismaClient, publicationId: bigint, userId: bigint) {
  return db.staff.create({
    data: { publicationId, userId }
  });
}


export async function createAdminWithNewUser(db: PrismaClient, input: UserInput, password: string, superAdmin: boolean = false) {

  const userPayload = await buildNewUser(input, password);

  return () =>
    db.admin.create({
      data: {
        superAdmin,
        user: { create: userPayload }
      }
    });
}


export async function createStaffWithNewUser(db: PrismaClient, invitation: Invitation, password: string) {

  const userPayload = await buildNewUser(invitation, password);

  return () => {

    if (!invitation.projectId) {
      throw 'Invitation must belong to some publication';
    }

    return db.staff.create({
      data: {
        publication: {
          connect: {
            id: invitation.projectId
          }
        },
        user: {
          create: userPayload
        }
      }
    });
  };
}


export async function changePassword(db: PrismaClient, userId: bigint, newPassword: string) {

  const [password, hashFn] = await hashPassword(newPassword);

  return () =>
    db.user.update({
      where: {
        id: userId
      },
      data: { password, hashFn }
    });
}


async function buildNewUser(invitation: UserInput, password: string) {

  // What to do with an async password?
  const [passwordHashed, hashFn] = await hashPassword(password);

  return {
    email: invitation.email,
    firstName: invitation.firstName,
    lastName: invitation.lastName,
    password: passwordHashed,
    hashFn
  };
}
