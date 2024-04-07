import { nanoid } from 'nanoid';

import { ONE_DAY_MS } from '../../constant.js';
import type { Tenant } from '../../contract/DbType.js';
import type { AuthContext, NewTenantInput, NewTenantResponse } from '../../contract/Type.js';
import { getTenantsForUser } from '../../dal/tenantDAL.js';
import { inviteCode, pk } from '../../util/code.js';
import * as schema from '../../schema/identity.js';
import { isClient, isUser } from '../access.js';

/**
 * Creates a new tenant with an invitation. Uses transaction scope!
 */
export async function createNewTenantWithInvite(context: AuthContext, payload: NewTenantInput): Promise<NewTenantResponse> {
  const { access, db } = context;

  if (!isClient(access)) {
    throw new Error('Invalid access');
  }

  const { invitation } = payload;

  const tenantId = pk();
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

export async function getTenants(context: AuthContext): Promise<Tenant[]> {
  const { access, db } = context;

  if (!isUser(access)) {
    throw 'Not authorized';
  }

  const tenants = await getTenantsForUser(db, access.user.id);

  return tenants;
}
