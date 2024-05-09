import assert, { rejects } from 'node:assert';
import { after, describe, it } from 'node:test';

import { claimInvitation, createNewTenantWithInvite, deleteTenant, getTenants } from '../src/context.js';
import { getClientAccess, getContext, getDb, getPublicAccess } from './helper/context.js';
import { createRandomTenant } from './helper/newTenant.js';

const { db, end } = getDb();

describe('Get Tenants', () => {
  const input = new Array(1).fill(0).map(createRandomTenant)[0];

  it('should not get tenant for `PublicAccess`', async () => {
    // Setup Data
    const access = await getClientAccess(db);
    const context = getContext(db, access);
    const tenantResponse = await createNewTenantWithInvite(context, input);
    const publicAccess = getPublicAccess();
    const publicContext = getContext(db, publicAccess);

    // SUT - System Under Test
    const response = getTenants(publicContext, {number: 1, size:1});

    // Verify - Result
    await rejects(response);
  });

  it('should delete tenant for `ClientAccess`', async () => {
    // Setup Data
    const clientAccess = await getClientAccess(db);
    const clientContext = getContext(db, clientAccess);
    const tenantResponse = await createNewTenantWithInvite(clientContext, input);

    // SUT - System Under Test
    const response = await getTenants(clientContext, {number: 1, size:1});

    // Verify - Result
    assert(response, 'Tenant ID is missing');
  });
})

after(end);
