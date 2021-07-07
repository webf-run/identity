import { Invitation, Prisma, PrismaClient } from '@prisma/client';

import { hashPassword } from './code';


export function findUserByEmail(db: PrismaClient, email: string, projectId: bigint) {
  return db.user.findUnique({
    where: {
      projectId_email: {
        email, projectId
      }
    }
  });
}

export async function isUserMemberOf(db: PrismaClient, publicationId: bigint, email: string) {
  const user = await findUserByEmail(db, email, publicationId);

  return !!user;
}


export async function createNewUser(db: PrismaClient, invitation: Invitation, password: string) {

  const userPayload = await buildNewUser(invitation, password);

  return () => {

    if (!invitation.projectId) {
      throw 'Invitation must belong to some publication';
    }

    return db.user.create({
      data: userPayload
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


async function buildNewUser(invitation: Invitation, password: string): Promise<Prisma.UserCreateInput> {

  // What to do with an async password?
  const [passwordHashed, hashFn] = await hashPassword(password);

  return {
    email: invitation.email,
    firstName: invitation.firstName,
    lastName: invitation.lastName,
    password: passwordHashed,
    hashFn,
    project: {
      connect: {
        id: invitation.projectId
      }
    },
    role: {
      create: {
        roleId: invitation.roleId
      }
    }
  };
}
