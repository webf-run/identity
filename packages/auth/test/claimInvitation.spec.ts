import assert, { rejects } from 'node:assert';
import { after, describe, it } from 'node:test';

import { claimInvitation, createNewTenantWithInvite } from '../src/context.js';
import { getClientAccess, getContext, getDb, getPublicAccess } from './helper/context.js';
import { createRandomTenant } from './helper/newTenant.js';

const { db, end } = getDb();

describe('Claim Invitation', () => {
  const input = new Array(1).fill(0).map(createRandomTenant)[0];

  it('should not claim invitation for `ClientAccess`', async () => {
    // Setup Data
    const access = await getClientAccess(db);
    const context = getContext(db, access);
    const tenantResponse = await createNewTenantWithInvite(context, input);

    // SUT - System Under Test
    const response = claimInvitation(context, tenantResponse.invitation.code, 'test_password');

    
    // Verify - Result
    await rejects(response);
  });

  it('should claim invitation for `PublicAccess`', async () => {
    // Setup Data
    const access = await getClientAccess(db);
    const context = getContext(db, access);
    const tenantResponse = await createNewTenantWithInvite(context, input);
    const claimAccess = getPublicAccess();
    const claimContext = getContext(db, claimAccess);

    // SUT - System Under Test
    const response = await claimInvitation(claimContext, tenantResponse.invitation.code, 'test_password');

    
    // Verify - Result
    assert(response);
  });
  
  it('should not claim if the tenant already exists', async () => {

    const access = await getClientAccess(db);
    const context = getContext(db, access);
    const tenant = await createNewTenantWithInvite(context, input);
    const claimAccess = getPublicAccess();
    const claimContext = getContext(db, claimAccess);
    
    // SUT - System Under Test
    const response = claimInvitation(claimContext, tenant.invitation.code, 'test_password');

    // Verify - Result
    await rejects(response);
  });

})

after(end);
