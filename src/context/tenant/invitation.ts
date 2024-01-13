import { and, eq, gt } from 'drizzle-orm';
import { nanoid } from 'nanoid';

import { ONE_DAY_MS } from '../../constant.js';
import { inviteCode } from '../../data/code';
import * as schema from '../../schema/identity.js';
import type { AuthContext, Invitation } from '../type.js';


export type NewInvitation = {
  firstName: string;
  lastName: string;
  email: string;
  duration?: number;
};

export async function inviteUser(context: AuthContext, input: NewInvitation, tenantId: string): Promise<Invitation | null> {
  const { db } = context;
  const invitation = buildInvitation(input, tenantId);

  await db.insert(schema.invitation)
    .values(invitation);

  return invitation;
}

export async function deleteInvitation(context: AuthContext, invitationId: string): Promise<boolean> {
  const { db } = context;

  const results = await db.delete(schema.invitation)
    .where(eq(schema.invitation.id, invitationId))
    .returning();

  return results.length > 0;
}


export async function getInvitationById(context: AuthContext, invitationId: string): Promise<Invitation | null> {
  const { db } = context;

  const results = await db.select()
    .from(schema.invitation)
    .where(eq(schema.invitation.id, invitationId));

  return results.at(0) ?? null;
}


export async function findInvitationByCode(context: AuthContext, code: string): Promise<Invitation | null> {
  const { db } = context;

  const results = await db.select()
    .from(schema.invitation)
    .where(and(
      eq(schema.invitation.code, code),
      gt(schema.invitation.expiryAt, new Date())));

  return results.at(0) ?? null;
}


export async function extendInvitationExpiry(context: AuthContext, invitation: Invitation): Promise<Invitation | null> {
  const { db } = context;

  const results = await db.update(schema.invitation)
    .set({
      expiryAt: new Date(Date.now() + invitation.duration),
      updatedAt: new Date(),
    })
    .where(eq(schema.invitation.id, invitation.id));

  return results.at(0) ?? null;
}

export function buildInvitation(invitation: NewInvitation, tenantId: string) {
  const duration = invitation.duration ?? 4 * ONE_DAY_MS;
  const now = new Date();
  const expiryAt = new Date(now.getTime() + duration);

  const newInvitation = {
    id: nanoid(),
    code: inviteCode(),
    firstName: invitation.firstName,
    lastName: invitation.lastName,
    email: invitation.email,
    duration,
    expiryAt,
    tenantId,
    createdAt: now,
    updatedAt: now,
  };

  return newInvitation;
}
