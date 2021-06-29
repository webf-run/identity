import { Prisma, PrismaClient } from '@prisma/client';

import { UserInput } from '../domain/Input';
import { generateInviteCode } from './code';


const ONE_MINUTE_MS = 60 * 1000;
const ONE_HOUR_MS = 60 * ONE_MINUTE_MS;
const ONE_DAY_MS = 24 * ONE_HOUR_MS;



export async function createAdminInvite(db: PrismaClient, admin: UserInput) {
  return db.invitation.create({
    data: buildAdminInvite(admin)
  });
}


export function buildAdminInvite(newUser: UserInput): Prisma.InvitationCreateInput {
  // Admin invitation is valid for 30 minutes
  return {
    code: generateInviteCode(),
    email: newUser.email,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    duration: 30 * ONE_MINUTE_MS
  };
}


export function buildUserInvite(newUser: UserInput): Prisma.InvitationCreateInput {
  // User invitation is valid for 3 days
  return {
    code: generateInviteCode(),
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    email: newUser.email,
    duration: 3 * ONE_DAY_MS
  };
}


export function deleteInvitation(db: PrismaClient, invitationId: bigint) {
  return db.invitation.delete({
    where: { id: invitationId }
  });
}


export function findInvitation(db: PrismaClient, code: string) {
  return db.invitation.findUnique({
    where: {
      code
    }
  });
}
