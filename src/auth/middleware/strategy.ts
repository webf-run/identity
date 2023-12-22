import { z } from 'zod';

import { authenticate, forgotPassword, resetPassword } from '../core/password.js';
import { OAuth2Options, OAuth2Client } from '../oauth/client.js';
import { makeGoogleClient, makeZohoClient } from '../oauth/providers.js';
import type { AuthMiddleware } from './type.js';

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


export async function addGoogleStrategy(app: AuthMiddleware, options: OAuth2Options): Promise<OAuth2Client> {
  const googleClient = await makeGoogleClient(options);

  app.get('/login/google', async (c) => {
    const loginUrl = await googleClient.makeLoginUrl();

    return c.redirect(loginUrl.toString(), 307);
  });

  app.get('/login/google/callback', async (c) => {
    const response = await googleClient.exchangeAuthorizationCode(new URLSearchParams(c.req.query()));
  });

  return googleClient;
}

export async function addZohoStrategy(app: AuthMiddleware, options: OAuth2Options): Promise<OAuth2Client> {
  const zohoClient = await makeZohoClient(options);

  app.get('/login/zoho', async (c) => {
    const loginUrl = await zohoClient.makeLoginUrl();

    return c.redirect(loginUrl.toString(), 307);
  });

  app.get('/login/zoho/callback', async (c) => {
    const response = await zohoClient.exchangeAuthorizationCode(new URLSearchParams(c.req.query()));
  });

  return zohoClient;
}


export function addPasswordStrategy(app: AuthMiddleware) {

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

    c.status(result.ok ? 200 : 401);

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
