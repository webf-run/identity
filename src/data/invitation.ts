import { Invitation, Prisma, PrismaClient, Publication } from '@prisma/client';

import { UserInput } from '../domain/Input';
import { generateInviteCode } from './code';
import { PublicationRole } from './constant';


export type InvitationAndPub = Invitation & {
  publication: Publication;
};

export const ONE_MINUTE_MS = 60 * 1000;
export const ONE_HOUR_MS = 60 * ONE_MINUTE_MS;
export const ONE_DAY_MS = 24 * ONE_HOUR_MS;


export function inviteUser(db: PrismaClient, newUser: UserInput, projectId: bigint, role: PublicationRole) {
  return db.quota.update({
    where: { id: projectId },
    data: {
      occupied: { increment: 1 },
      publication: {
        update: {
          invitations: {
            create: buildUserInvite(newUser, role)
          }
        }
      }
    }
  });
}


export function buildUserInvite(newUser: UserInput, role: PublicationRole) {

  const duration = 4 * ONE_DAY_MS;

  // User invitation is valid for 4 days
  const payload: Prisma.InvitationCreateWithoutPublicationInput = {
    code: generateInviteCode(),
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    email: newUser.email,
    duration,
    role: {
      connect: { id: role }
    },
    expiryAt: new Date(Date.now() + duration)
  };

  return payload;
}


export function deleteInvitation(db: PrismaClient, invitationId: string) {
  return db.invitation.delete({
    where: { id: invitationId }
  });
}


export function getInvitationById(db: PrismaClient, invitationId: string) {
  return db.invitation.findUnique({
    where: {
      id: invitationId
    }
  });
}


export function findInvitationByCode(db: PrismaClient, code: string): Promise<InvitationAndPub | null> {
  return db.invitation.findFirst({
    where: {
      code,
      expiryAt: {
        gt: new Date()
      }
    },
    include: {
      publication: {
        include: {
          tenant: true
        }
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
