import { Hono } from 'hono';

import { hasAppInitialized, initialize } from '../context/system/system.js';
import { init, DbClient } from '../db/client.js';
import { addOpenIDStrategy } from './hono/oauth.js';
import { addPasswordStrategy } from './hono/password.js';
import { session } from './hono/session.js';
import type { HonoAuthApp, AuthOptions } from './hono/type.js';

export type AuthSystem = {
  auth: HonoAuthApp;
  db: DbClient;
};

/**
 * Builds a Hono app that handles only authentication.
 * @param options
 * @returns
 */
export async function makeAuth(options: AuthOptions): Promise<AuthSystem> {
  const auth: HonoAuthApp = new Hono();
  const { db } = init(options.db);

  // Inject the auth context into the request.
  auth.use('*', async function authContextM(c, next) {
    const context = { db };

    c.set('authContext', context);
    await next();
  });

  try {
    const initialized = await hasAppInitialized({ db });

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
  } catch (err) {
    console.warn('Failed to check if app is initialized.');
  }

  return { auth, db };
}

export {
  addOpenIDStrategy,
  addPasswordStrategy,
  session,
};
