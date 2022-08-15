import { PublicationRole } from '../../data/constant';
import { buildUserInvite } from '../../data/invitation';
import { DbContext } from '../DbContext';
import { UserInput } from '../Input';
import { Invitation } from '../Output';


export const ONE_MINUTE_MS = 60 * 1000;
export const ONE_HOUR_MS = 60 * ONE_MINUTE_MS;
export const ONE_DAY_MS = 24 * ONE_HOUR_MS;


export async function inviteUser(db: DbContext, newUser: UserInput, publicationId: bigint, role: PublicationRole): Promise<Invitation | null> {

  const results = await db.invitation.createInvitation({
    ...buildUserInvite(newUser, role),
    publicationId: publicationId.toString(),
    createdAt: new Date(),
    updatedAt: new Date()
  });

  if (results.at(0)) {
    return {
      ...results[0],
      publicationId: BigInt(results[0].publicationId)
    };
  }

  return null;
}

export async function deleteInvitation(db: DbContext, invitationId: string): Promise<boolean> {
  const results = await db.invitation.deleteById({ invitationId });

  return results.length > 0;
}


export async function getInvitationById(db: DbContext, invitationId: string): Promise<Invitation | null> {
  const results = await db.invitation.getById({ invitationId });

  if (results.at(0)) {
    return {
      ...results[0],
      publicationId: BigInt(results[0].publicationId)
    };
  }

  return null;
}


export async function findInvitationByCode(db: DbContext, code: string): Promise<Invitation | null> {

  const results = await db.invitation.findByCode({
    code,
    expiryAt: new Date()
  });

  if (results.at(0)) {
    return {
      ...results[0],
      publicationId: BigInt(results[0].publicationId)
    };
  }

  return null;
}


export async function extendInvitationExpiry(db: DbContext, invitation: Invitation): Promise<Invitation | null> {
  const results = await db.invitation.updateExpirty({
    invitationId: invitation.id,
    newExpiry: new Date(Date.now() + invitation.duration)
  });

  if (results.at(0)) {
    return {
      ...results[0],
      publicationId: BigInt(results[0].publicationId)
    };
  }

  return null;
}
