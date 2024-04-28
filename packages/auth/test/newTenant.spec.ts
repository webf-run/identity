import assert, { rejects } from 'node:assert';
import { after, describe, it } from 'node:test';

import { createNewTenantWithInvite, type NewTenantInput } from '../src/context.js';
import { getClientAccess, getContext, getDb, getPublicAccess } from './helper/context.js';

const { db, end } = getDb();


describe('New Tenant Creation', () => {
  const input: NewTenantInput = {
    name: 'Test Tenant',
    description: 'Test Tenant Description',
    invitation: {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@webf.run',
    },
  };

  it('should not create a new teant for `PublicAccess`', async () => {
    // Setup Data
    const access = getPublicAccess();
    const context = getContext(db, access);

    // SUT - System Under Test
    const response = createNewTenantWithInvite(context, input);

    // Verify - Result
    await rejects(response);
  });

  it('should create a new tenant for `ClientAccess`', async () => {
    // Setup Data
    const access = await getClientAccess(db);
    const context = getContext(db, access);

    // SUT - System Under Test
    const response = await createNewTenantWithInvite(context, input);

    // Verify - Result
    assert(response.tenant.id, 'Tenant ID is missing');
  });

});

after(end);
