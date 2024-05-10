import assert, { rejects } from 'node:assert';
import { after, describe, it } from 'node:test';

import { createNewTenantWithInvite, deleteTenant, getTenants } from '../src/context.js';
import { getClientAccess, getContext, getDb, getPublicAccess } from './helper/context.js';
import { createRandomTenant } from './helper/newTenant.js';

const { db, end } = getDb();

describe('Get Tenants', () => {
  
  it('should not get tenant for `PublicAccess`', async () => {
    // Setup Data
    const input = createRandomTenant();
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
  
  it('should get tenant for `ClientAccess`', async () => {
    // Setup Data
    const input = createRandomTenant();
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
