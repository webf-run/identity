import { and, eq, gt } from 'drizzle-orm';

import type { Invitation } from '../contract/DbType.js';
import type { DbClient } from '../db/client.js';
import { invitation } from '../schema/identity.js';
import type { Nil } from '../result.js';

export async function findInvitationByCode(db: DbClient, code: string): Promise<Invitation | null> {
  const results = await db.select()
    .from(invitation)
    .where(and(
      eq(invitation.code, code),
      gt(invitation.expiryAt, new Date())));

  return results.at(0) ?? null;
}

export async function getInvitationById(db: DbClient, invitationId: string): Promise<Invitation | null> {
  const results = await db.select()
    .from(invitation)
    .where(eq(invitation.id, invitationId));

  return results.at(0) ?? null;
}

export async function deleteInvitation(db: DbClient, invitationId: string): Promise<boolean> {
  const results = await db.delete(invitation)
    .where(eq(invitation.id, invitationId))
    .returning();

  return results.length > 0;
}

export async function addInvitation(db: DbClient, newInvitation: Invitation): Promise<Invitation> {
  await db.insert(invitation)
    .values(newInvitation);

  return newInvitation;
}

export async function changeExpiry(db: DbClient, invitationId: string, expiryAt: Date): Promise<Nil<Invitation>> {
  const results = await db.update(invitation)
    .set({
      expiryAt,
      updatedAt: new Date(),
    })
    .where(eq(invitation.id, invitationId))
    .returning();

  return results.at(0);
}
