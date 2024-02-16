import { hasAppInitialized, initialize, type Access } from '@webf/auth/context';
import { init, DbClient, type DbOptions } from '@webf/auth/db';
import { Hono, type MiddlewareHandler } from 'hono';
import { createMiddleware } from 'hono/factory';

import type { OAuth2Client } from '../oauth/client.js';
import { addOpenIDStrategy } from './oauth.js';
import { addPasswordStrategy } from './password.js';
import { session } from './session.js';
import type { HonoAuthApp, HonoAuthContext, OAuthCallbacks } from './type.js';

export type AuthOptions = {

  /**
   * The main parent app to inject Hono Authentication.
   */
  app: Hono<any, any, any>;

  /**
   * Database configuration. The postgres driver.
   */
  db: DbOptions;

  /**
   * If the app should use password authentication.
   */
  usePassword: boolean;

  /**
   * The OAuth strategies to add to the authentication app.
   */
  strategies: Array<{
    client: OAuth2Client;
    callbacks: OAuthCallbacks;
  }>;
};

export type AuthSystem = {
  auth: HonoAuthApp;
  db: DbClient;
};

declare module 'hono' {
  interface ContextVariableMap {
    session: Access;
  }
}

/**
 * Builds a Hono app that handles only authentication.
 * @param options
 * @returns
 */
export async function makeAuth(options: AuthOptions): Promise<AuthSystem> {
  const { app, strategies, usePassword } = options;
  const { db } = init(options.db);

  // Create the Hono app dedicated to authentication routes.
  const auth: HonoAuthApp = new Hono();

  // Inject the auth context into the request.
  auth.use('*', authContext(db));

  await addInitRoute(auth, db);

  // Add the OAuth strategies to the auth app.
  for (const { client, callbacks } of strategies) {
    await addOpenIDStrategy(auth, client, callbacks);
  }

  if (usePassword) {
    // Add password strategy to the auth app.
    await addPasswordStrategy(auth);
  }

  // Add session middleware to the app for every incoming request.
  app.use('*', session({ db }));

  // Add the auth app to the main app.
  app.route('/auth', auth);

  return { auth, db };
}

/**
 * Middleware to inject the identity database client into the request context.
 */
function authContext(db: DbClient): MiddlewareHandler {
  return createMiddleware(async function authContextM(c: HonoAuthContext, next) {
    const context = { db };

    c.set('authContext', context);
    await next();
  });
}

async function addInitRoute(auth: HonoAuthApp, db: DbClient): Promise<void> {
  try {
    const initialized = await hasAppInitialized({ db });

    if (!initialized) {
      auth.post('/init', async function init(c) {
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
}
