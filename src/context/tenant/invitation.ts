import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

import { ONE_DAY_MS } from '../../constant.js';
import { Invitation } from '../../contract/DbType.js';
import type { AuthContext, NewInvitation } from '../../contract/Type.js';
import * as schema from '../../schema/identity.js';
import { inviteCode } from '../../util/code.js';


export async function inviteUser(context: AuthContext, input: NewInvitation, tenantId: string): Promise<Invitation | null> {
  const { db } = context;
  const invitation = buildInvitation(input, tenantId);

  await db.insert(schema.invitation)
    .values(invitation);

  return invitation;
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

function buildInvitation(invitation: NewInvitation, tenantId: string): Invitation {
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
