import { Prisma, PrismaClient } from '@prisma/client';

import { hashPassword } from './code';
import { InvitationAndPub } from './invitation';


export function findUserByEmail(db: PrismaClient, email: string) {
  return db.user.findUnique({
    where: {
      email
    }
  });
}


export async function isUserMemberOf(db: PrismaClient, publicationId: bigint, userId: string) {

  const user = await db.publicationUser.findUnique({
    where: {
      userId_publicationId: {
        userId,
        publicationId
      }
    }
  });

  return !!user;
}


export async function createNewUser(db: PrismaClient, invitation: InvitationAndPub, password: string) {
  // The await here is not compatible with Prisma's transaction API.
  // Thus, we need to return a function which then returns Prisma compatible
  // promise that $transaction API can consume.
  const userPayload = await buildNewUser(invitation, password);

  return () => {
    return db.user.create({
      data: userPayload
    });
  };
}


export async function changePassword(db: PrismaClient, userId: string, newPassword: string) {

  const [password, hashFn] = await hashPassword(newPassword);

  return () =>
    db.user.update({
      where: {
        id: userId
      },
      data: { password, hashFn }
    });
}


async function buildNewUser(invitation: InvitationAndPub, password: string): Promise<Prisma.UserCreateInput> {

  // TODO: What to do with an async password?
  const [passwordHashed, hashFn] = await hashPassword(password);

  return {
    email: invitation.email,
    firstName: invitation.firstName,
    lastName: invitation.lastName,
    password: passwordHashed,
    hashFn,
    publications: {
      create: {
        publicationId: invitation.publicationId
      }
    },
    tenants: {
      create: {
        tenantId: invitation.publication.tenantId
      }
    }
  };
}
