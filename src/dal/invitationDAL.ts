import { and, eq, gt } from 'drizzle-orm';

import type { Invitation } from '../context/Type.js';
import type { DbClient } from '../db/client';
import { invitation } from '../schema/identity';

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
