import { Invitation, Prisma, PrismaClient } from '@prisma/client';

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

  const duration = 30 * ONE_MINUTE_MS;

  // Admin invitation is valid for 30 minutes
  return {
    code: generateInviteCode(),
    email: newUser.email,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    duration,
    expiryAt: new Date(Date.now() + duration)
  };
}


export function buildUserInvite(newUser: UserInput): Prisma.InvitationCreateInput {

  const duration = 4 * ONE_DAY_MS;

  // User invitation is valid for 4 days
  return {
    code: generateInviteCode(),
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    email: newUser.email,
    duration,
    expiryAt: new Date(Date.now() + duration)
  };
}


export function deleteInvitation(db: PrismaClient, invitationId: bigint) {
  return db.invitation.delete({
    where: { id: invitationId }
  });
}


export function getActiveInvitationById(db: PrismaClient, invitationId: bigint) {
  return db.invitation.findFirst({
    where: {
      id: invitationId,
      expiryAt: {
        gt: new Date()
      }
    }
  });
}


export function getInvitationById(db: PrismaClient, invitationId: bigint) {
  return db.invitation.findUnique({
    where: {
      id: invitationId
    }
  });
}


export function findInvitationByCode(db: PrismaClient, code: string) {
  return db.invitation.findFirst({
    where: {
      code,
      expiryAt: {
        gt: new Date()
      }
    }
  });
}


export function extendInvitationExpiry(db: PrismaClient, invitation: Invitation) {
  return db.invitation.update({
    data: {
      expiryAt: new Date(Date.now() + invitation.duration)
    },
    where: {
      id: invitation.id
    }
  });
}
