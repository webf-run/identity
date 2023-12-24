import { z } from 'zod';

import { authenticate, forgotPassword, resetPassword } from '../core/password.js';
import { HonoAuthApp } from './type.js';
import { setSession } from './session.js';

const credentialsDTO = z.object({
  username: z.string(),
  password: z.string(),
});

const forgotPassDTO = z.object({
  username: z.string(),
});

const resetPassDTO = z.object({
  code: z.string(),
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
    const result = await authenticate(context, parsed.data);

    if (result.ok) {
      const token = result.value;
      setSession(c, token);
      c.status(200);
    } else {
      c.status(404);
    }

    return c.json(result.value);
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

    c.status(result.ok ? 200 : 404);

    return c.json({ value: result.value });
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
    const result = await resetPassword(c.var.authContext, dto.code, dto.newPassword);

    c.status(result.ok ? 200 : 404);

    return c.json({ value: result.value });
  });
}
