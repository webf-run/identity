import { eq } from 'drizzle-orm';

import { ONE_DAY_MS } from '../../constant.js';
import { Invitation } from '../../contract/DbType.js';
import type { AuthContext, NewInvitationInput } from '../../contract/Type.js';
import { addInvitation } from '../../dal/invitationDAL.js';
import { Nil } from '../../result.js';
import * as schema from '../../schema/identity.js';
import { inviteCode, pk } from '../../util/code.js';
import { isMember } from '../access.js';


export async function inviteUser(context: AuthContext, input: NewInvitationInput, tenantId: string): Promise<Nil<Invitation>> {
  const { access, db } = context;

  if (!isMember(access, tenantId)) {
    throw new Error('Invalid access');
  }

  const invitation = buildInvitation(input, tenantId);

  await addInvitation(db, invitation);

  return invitation;
}

export async function extendInvitationExpiry(context: AuthContext, invitation: Invitation): Promise<Nil<Invitation>> {
  const { db } = context;

  if (!isMember(context.access, invitation.tenantId)) {
    throw new Error('Invalid access');
  }

  const results = await db.update(schema.invitation)
    .set({
      expiryAt: new Date(Date.now() + invitation.duration),
      updatedAt: new Date(),
    })
    .where(eq(schema.invitation.id, invitation.id));

  return results.at(0) ?? null;
}

function buildInvitation(invitation: NewInvitationInput, tenantId: string): Invitation {
  const duration = invitation.duration ?? 4 * ONE_DAY_MS;
  const now = new Date();
  const expiryAt = new Date(now.getTime() + duration);

  const newInvitation = {
    id: pk(),
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
