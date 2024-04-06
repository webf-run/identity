import { claimInvitation } from "@webf/auth/context";
import { findInvitationByCode } from "@webf/auth/dal";
import { z } from "zod";

import type { HonoAuthApp } from "./type.js";

const InvitationClaimDTO = z.object({
  code: z.string(),
  password: z.string(),
});

export async function claimAndAcceptInvitation(
  app: HonoAuthApp
): Promise<void> {
  app.get("/invitations/:code", async (c) => {
    const code = c.req.param("code");
    const request = await findInvitationByCode(c.var.authContext.db, code);

    return c.json(request);
  });
}
