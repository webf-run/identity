import type { Tenant } from '../../contract/DbType.js';
import type { AuthContext } from '../../contract/Type.js';
import type { Page } from '../../contract/Utility.js';
import * as TenantDAL from '../../dal/tenantDAL.js';
import { isClient, isUser } from '../access.js';

/**
 * Get a list of all the tenants in the system.
 * Only `client` access type can access the tenant list.
 */
export async function getTenants(context: AuthContext, page: Page): Promise<Tenant[]> {
  const { access, db } = context;

  if (!isClient(access)) {
    throw 'Not authorized';
  }

  const tenants = await TenantDAL.getTenants(db, page);

  return tenants;
}

/**
 * Get a list of tenants that the user is a member of.
 * User can only access the tenants they are a member of.
 */
export async function getUserTenants(context: AuthContext): Promise<Tenant[]> {
  const { access, db } = context;

  if (!isUser(access)) {
    throw 'Not authorized';
  }

  const tenants = await TenantDAL.getUserTenants(db, access.user.id);

  return tenants;
}
