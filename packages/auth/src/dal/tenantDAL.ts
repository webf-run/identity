import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

import type { Tenant } from '../contract/DbType.js';
import { Page } from '../contract/Utility.js';
import { DbClient } from '../db/client.js';
import { tenant, tenantUser } from '../schema/identity.js';
import { pk } from '../util/code.js';
import type { Nil } from '../result.js';


export type AddTenantInput = {
  name: string;
  description: string;
  key?: string;
};

export async function addTenant(db: DbClient, input: AddTenantInput): Promise<Tenant> {
  const tenantId = pk();
  const now = new Date();

  const newTenant = {
    id: tenantId,
    name: input.name,
    description: input.description,
    key: input.key ?? nanoid(24),
    createdAt: now,
    updatedAt: now,
  };

  await db.insert(tenant)
    .values(newTenant);

  return newTenant;
}


export async function addTenantUser(db: DbClient, tenantId: string, userId: string) {
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


export async function getTenants(db: DbClient, page: Page): Promise<Tenant[]> {
  const results = await db
    .select()
    .from(tenant)
    .limit(page.size)
    .offset(page.number * page.size);

  return results;
}


/** Retrives a list of tenants for a given `userId`. */
export async function getUserTenants(db: DbClient, userId: string): Promise<Tenant[]> {
  const results = await db
    .select()
    .from(tenantUser)
    .innerJoin(tenant, eq(tenant.id, tenantUser.tenantId))
    .where(eq(tenantUser.userId, userId));

  return results.map((r) => r.tenant);
}


export async function deleteTenant(db: DbClient, tenantId: string): Promise<Nil<Tenant>> {
  const result = await db
    .delete(tenant)
    .where(eq(tenant.id, tenantId))
    .returning();

  return result.at(0);
}
