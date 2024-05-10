import assert, { rejects } from 'node:assert';
import { after, describe, it } from 'node:test';

import { createNewTenantWithInvite, deleteTenant } from '../src/context.js';
import { getClientAccess, getContext, getDb, getPublicAccess } from './helper/context.js';
import { createRandomTenant } from './helper/newTenant.js';

const { db, end } = getDb();

describe('Delete Tenant', () => {
  const input = createRandomTenant();

  it('should not delete tenant for `PublicAccess`', async () => {
    // Setup Data
    const access = await getClientAccess(db);
    const context = getContext(db, access);
    const tenantResponse = await createNewTenantWithInvite(context, input);
    const publicAccess = getPublicAccess();
    const publicContext = getContext(db, publicAccess);

  // SUT - System Under Test
  const response = deleteTenant(publicContext, tenantResponse.tenant.id);

    // Verify - Result
    await rejects(response);
  });

  it('should delete tenant for `ClientAccess`', async () => {
    // Setup Data
    const clientAccess = await getClientAccess(db);
    const clientContext = getContext(db, clientAccess);
    const tenantResponse = await createNewTenantWithInvite(clientContext, input);

    // SUT - System Under Test
    const response = await deleteTenant(clientContext, tenantResponse.tenant.id);

    // Verify - Result
    assert(response, 'Tenant ID is missing');
  });

})

after(end);
