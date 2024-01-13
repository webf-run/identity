import { nanoid } from 'nanoid';

import { DbClient } from '../db/client';
import { tenantUser } from '../schema/identity';


export async function createTenantUser(db: DbClient, tenantId: string, userId: string) {
  const now = new Date();

  const newTenantUser = {
    id: nanoid(),
    userId,
    tenantId,
    createdAt: now,
    updatedAt: now,
  };

  await db.insert(tenantUser)
    .values(newTenantUser);

  return newTenantUser;
}
