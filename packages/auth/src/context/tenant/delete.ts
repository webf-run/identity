import type { Tenant } from '../../contract/DbType.js';
import type { AuthContext } from '../../contract/Type.js';
import * as inviteDAL from '../../dal/invitationDAL.js';
import * as tenantDAL from '../../dal/tenantDAL.js';
import type { Nil } from '../../result.js';
import { isClient, isMember } from '../access.js';


export async function deleteTenant(ctx: AuthContext, tenantId: string): Promise<Nil<Tenant>> {
  const { access, db } = ctx;

  if (!isClient(access)) {
    throw 'Invalid access';
  }

  const result = await tenantDAL.deleteTenant(db, tenantId);

  return result;
}


export async function deleteInvitation(ctx: AuthContext, inviteId: string): Promise<boolean> {
  const { access, db } = ctx;

  const invitation = await inviteDAL.getInvitationById(db, inviteId);

  if (!invitation) {
    throw 'Invitation not found';
  }

  if (!isMember(access, invitation.tenantId)) {
    throw 'Invalid access';
  }

  const isDeleted = await inviteDAL.deleteInvitation(db, inviteId);

  return isDeleted;
}
