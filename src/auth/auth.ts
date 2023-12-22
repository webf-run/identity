import { Hono } from 'hono';

import { init } from './db/client.js';
import { AuthMiddleware, AuthOptions } from './middleware/type.js';
import { addGoogleStrategy, addPasswordStrategy, addZohoStrategy } from './middleware/strategy.js';
import type { AuthSystem } from './type.js';

export async function makeAuth(options: AuthOptions): Promise<AuthSystem> {
  const auth: AuthMiddleware = new Hono();
  const db = init(options.dbFile);

  // Inject the auth context into the request.
  auth.use('*', async (c, next) => {
    const context = { db };

    c.set('authContext', context);
    await next();
  });


  if (options.google) {
    await addGoogleStrategy(auth, options.google);
  }

  if (options.zoho) {
    await addZohoStrategy(auth, options.zoho);
  }

  if (options.password) {
    addPasswordStrategy(auth);
  }

  return { auth, db };
}
