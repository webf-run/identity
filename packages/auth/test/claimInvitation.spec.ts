import assert, { rejects } from 'node:assert';
import { after, describe, it } from 'node:test';

import { claimInvitation, createNewTenantWithInvite } from '../src/context.js';
import { getClientAccess, getContext, getDb, getPublicAccess } from './helper/context.js';
import { createRandomTenant } from './helper/newTenant.js';

const { db, end } = getDb();

describe('Claim Invitation', () => {

  it('should not claim invitation for `ClientAccess`', async () => {
    // Setup Data
    const input = createRandomTenant();
    const access = await getClientAccess(db);
    const context = getContext(db, access);
    const tenantResponse = await createNewTenantWithInvite(context, input);

    // SUT - System Under Test
    const response = claimInvitation(context, tenantResponse.invitation.code, 'test_password');

    // Verify - Result
    await rejects(response);
  });

  it('should not be able to claim invitation for `PublicAccess`', async () => {
    // Setup Data
    const input = createRandomTenant();
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

  it('should not claim if user with given email already exists in the system', async () => {
    // If the user already exists in the system, then the invitation should not be claimed.
    // Instead, it should be accepted by the user with proper access token.

    // Setup Data
    const input = createRandomTenant();
    const access = await getClientAccess(db);
    const context = getContext(db, access);
    const tenant = await createNewTenantWithInvite(context, input);

    const claimAccess = getPublicAccess();
    const claimContext = getContext(db, claimAccess);

    // All the invitation to be claimed for the first time.
    await claimInvitation(claimContext, tenant.invitation.code, 'test_password');

    // SUT - System Under Test
    // Create new tenant and invite same user. The claim should fail.
    const claimTenant = await createNewTenantWithInvite(context, input);
    const response = claimInvitation(claimContext, claimTenant.invitation.code, 'test_password');

    // Verify - Result
    await rejects(response, 'Claim should not proceed if user already exists in the system.');
  });
});

after(end);
