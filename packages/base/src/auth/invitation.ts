import { claimInvitation } from '@webf/auth/context';
import { findInvitationByCode } from '@webf/auth/dal';
import { z } from 'zod';

import type { HonoAuthApp } from './type.js';

const InvitationClaimDTO = z.object({
    code: z.string(),
    password: z.string(),
  });

export async function addInvitationStrategy(app: HonoAuthApp): Promise<void> {
    // app.post('/claim-invitation', async (c) => {
    //     const body = await c.req.json();
    //     const parsed = InvitationClaimDTO.safeParse(body);

    //     if (!parsed.success) {
    //     c.status(422);

    //     // TODO: Error handling.
    //     return c.json({ issues: parsed.error.issues });
    //     }

    //     const dto = parsed.data;
    //     const result = await claimInvitation(c.var.authContext, dto.code, dto.password)
    //     c.status(result? 200 : 400);

    //     return c.json({ value: result });
    // })

    app.get('/invitations/:code', async (c) => {
        const code = c.req.param('code');
        const request = await findInvitationByCode(c.var.authContext.db, code);

        return c.json(request);
    })
}