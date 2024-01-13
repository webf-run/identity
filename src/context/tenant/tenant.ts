import { nanoid } from 'nanoid';

import { ONE_DAY_MS } from '../../constant.js';
import { inviteCode } from '../../util/code.js';
import * as schema from '../../schema/identity.js';
import type { AuthContext, Invitation, Tenant } from '../type.js';
import { NewInvitation } from './invitation.js';


export type NewTenant = {
  name: string;
  description: string;
  key?: string;
  invitation: NewInvitation;
};

export type NewTenantResponse = {
  tenant: Tenant;
  invitation: Invitation;
};

/**
 * Creates a new tenant with an invitation. Uses transaction scope!
 */
export async function createNewTenantWithInvite(context: AuthContext, payload: NewTenant): Promise<NewTenantResponse> {
  const { db } = context;
  const { invitation } = payload;

  const tenantId = nanoid();
  const now = new Date();
  const duration = invitation.duration ?? 4 * ONE_DAY_MS;
  const expiryAt = new Date(now.getTime() + duration);

  const newTenant = {
    id: tenantId,
    name: payload.name,
    description: payload.description,
    key: payload.key ?? nanoid(24),
    createdAt: now,
    updatedAt: now,
  };

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

  await db.transaction(async (tx) => {
    await tx.insert(schema.tenant)
      .values(newTenant);

    await tx.insert(schema.invitation)
      .values(newInvitation);
  });

  return {
    tenant: newTenant,
    invitation: newInvitation,
  };
}
