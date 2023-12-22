import { Hono } from 'hono';

import { init } from './db/client.js';
import { addOpenIDStrategy } from './hono/oauth.js';
import { addPasswordStrategy } from './hono/password.js';
import type { HonoAuthMiddleware, AuthOptions } from './hono/type.js';
import type { AuthSystem } from './type.js';

export async function makeAuth(options: AuthOptions): Promise<AuthSystem> {
  const auth: HonoAuthMiddleware = new Hono();
  const db = init(options.dbFile);

  // Inject the auth context into the request.
  auth.use('*', async (c, next) => {
    const context = { db };

    c.set('authContext', context);
    await next();
  });

  return { auth, db };
}

export {
  addOpenIDStrategy,
  addPasswordStrategy
};
