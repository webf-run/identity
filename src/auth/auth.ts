import { Hono } from 'hono';

import { hasAppInitialized, initialize } from './core/system.js';
import { init } from './db/client.js';
import { addOpenIDStrategy } from './hono/oauth.js';
import { addPasswordStrategy } from './hono/password.js';
import { session } from './hono/session.js';
import type { HonoAuthApp, AuthOptions } from './hono/type.js';
import type { AuthSystem } from './type.js';

export async function makeAuth(options: AuthOptions): Promise<AuthSystem> {
  const auth: HonoAuthApp = new Hono();
  const { db } = init(options.db);
  const initialized = await hasAppInitialized({ db });

  // Inject the auth context into the request.
  auth.use('*', async (c, next) => {
    const context = { db };

    c.set('authContext', context);
    await next();
  });

  if (!initialized) {
    auth.post('/init', async (c) => {
      const context = c.var.authContext;
      const response = await initialize(context);

      if (response.ok) {
        c.status(200);
        return c.json(response.value);
      } else {
        c.status(404);
        return c.json({});
      }
    });
  }

  return { auth, db };
}

export {
  addOpenIDStrategy,
  addPasswordStrategy,
  session,
};
