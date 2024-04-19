import type { AuthContext, NewTenantInput, NewTenantResponse } from '../../contract/Type.js';
import { isClient } from '../access.js';
import { addTenant } from '../../dal/tenantDAL.js';
import { addInvitation } from '../../dal/invitationDAL.js';
import { buildInvitation } from './invite.js';

/**
 * Creates a new tenant with an invitation. Uses transaction scope!
 */
export async function createNewTenantWithInvite(context: AuthContext, payload: NewTenantInput): Promise<NewTenantResponse> {
  const { access, db } = context;

  if (!isClient(access)) {
    throw new Error('Invalid access');
  }

  const result = await db.transaction(async (tx) => {

    const { invitation } = payload;

    const newTenant = await addTenant(tx, payload);

    const newInvitation = buildInvitation(invitation, newTenant.id);

    await addInvitation(tx, newInvitation);

    return {
      tenant: newTenant,
      invitation: newInvitation,
    };
  });

  return result;
}
