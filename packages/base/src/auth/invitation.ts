import { findInvitationByCode } from '@webf/auth/dal';

import type { HonoAuthApp } from './type.js';

export async function claimAndAcceptInvitation(
  app: HonoAuthApp
): Promise<void> {
  app.get('/invitations/:code', async (c) => {
    const code = c.req.param('code');
    const request = await findInvitationByCode(c.var.authContext.db, code);

    return c.json(request);
  });
}
