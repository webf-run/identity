import { nanoid } from 'nanoid';

import { tenant } from '../../schema/identity';
import { AuthContext } from './type';

export type NewTenantPayload = {
  name: string;
  description: string;
  key?: string;
};

export async function createNewTenant(context: AuthContext, payload: NewTenantPayload) {
  const { db } = context;

  db.insert(tenant)
    .values({
      id: nanoid(24),
      name: payload.name,
      description: payload.description,
      key: payload.key ?? nanoid(24),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

  return tenant;
}
