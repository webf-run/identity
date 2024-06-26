import {
  authenticate,
  forgotPassword,
  resetPassword,
  getResetTokenInfo,
} from '@webf/auth/context';
import { z } from 'zod';

import { setSession } from './session.js';
import type { HonoAuthApp } from './type.js';

const credentialsDTO = z.object({
  username: z.string(),
  password: z.string(),
});

const forgotPassDTO = z.object({
  username: z.string(),
});

const resetPassDTO = z.object({
  token: z.string(),
  newPassword: z.string(),
});

export async function addPasswordStrategy(app: HonoAuthApp): Promise<void> {
  // Exchange username and password
  app.post('/login/password', async (c) => {
    const body = await c.req.json();
    const parsed = credentialsDTO.safeParse(body);

    if (!parsed.success) {
      c.status(422);

      // TODO: Error handling.
      return c.json({ issues: parsed.error.issues });
    }

    const context = c.var.authContext;

    // Check if the username and password exists in the database.
    try {
      const token = await authenticate(context, parsed.data);
      await setSession(c, token);

      c.status(200);
      return c.json(token);
    } catch (e) {
      c.status(404);
      return c.json({ value: e });
    }
  });

  // Request a password reset
  app.post('/forgot-password', async (c) => {
    const body = await c.req.json();
    const parsed = forgotPassDTO.safeParse(body);

    if (!parsed.success) {
      c.status(422);

      // TODO: Error handling.
      return c.json({ issues: parsed.error.issues });
    }

    const dto = parsed.data;
    const result = await forgotPassword(c.var.authContext, dto.username);

    c.status(result ? 200 : 404);

    return c.json({ value: result });
  });

  app.get('/reset-password/:token', async (c) => {
    const token = c.req.param('token');
    const request = await getResetTokenInfo(c.var.authContext, token);

    // TODO: Error handling.
    return c.json(request);
  });

  // Reset password
  app.post('/reset-password', async (c) => {
    const body = await c.req.json();
    const parsed = resetPassDTO.safeParse(body);

    if (!parsed.success) {
      c.status(422);

      // TODO: Error handling.
      return c.json({ issues: parsed.error.issues });
    }

    const dto = parsed.data;
    const result = await resetPassword(c.var.authContext, dto.token, dto.newPassword);

    c.status(result ? 200 : 404);

    return c.json({ value: result });
  });
}
