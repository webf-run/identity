import { and, eq, gt } from 'drizzle-orm';

import type { AuthContext, Invitation } from '../context';
import { invitation } from '../schema/identity';
import { DbClient } from '../db/client';

export async function findInvitationByCode(context: AuthContext, code: string): Promise<Invitation | null> {
  const { db } = context;

  const results = await db.select()
    .from(invitation)
    .where(and(
      eq(invitation.code, code),
      gt(invitation.expiryAt, new Date())));

  return results.at(0) ?? null;
}


export async function getInvitationById(context: AuthContext, invitationId: string): Promise<Invitation | null> {
  const { db } = context;

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
