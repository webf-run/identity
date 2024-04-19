import type { Tenant } from '../../contract/DbType.js';
import type { AuthContext } from '../../contract/Type.js';
import * as tenantDAL from '../../dal/tenantDAL.js';
import type { Nil } from '../../result.js';
import { isClient } from '../access.js';


export async function deleteTenant(ctx: AuthContext, tenantId: string): Promise<Nil<Tenant>> {
  const { access, db } = ctx;

  if (!isClient(access)) {
    throw 'Invalid access';
  }

  const result = await tenantDAL.deleteTenant(db, tenantId);

  return result;
}
