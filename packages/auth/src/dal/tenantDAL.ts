import { eq } from 'drizzle-orm';

import { Tenant } from '../context.js';
import { DbClient } from '../db/client.js';
import { tenant, tenantUser } from '../schema/identity.js';
import { pk } from '../util/code.js';


export async function createTenantUser(db: DbClient, tenantId: string, userId: string) {
  const now = new Date();

  const newTenantUser = {
    id: pk(),
    userId,
    tenantId,
    createdAt: now,
    updatedAt: now,
  };

  await db
    .insert(tenantUser)
    .values(newTenantUser);

  return newTenantUser;
}


export async function getTenantsForUser(db: DbClient, userId: string): Promise<Tenant[]> {
  const results = await db
    .select()
    .from(tenantUser)
    .innerJoin(tenant, eq(tenant.id, tenantUser.tenantId))
    .where(eq(tenantUser.userId, userId));

  return results.map((r) => r.tenant);
}
