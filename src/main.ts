import { serve } from '@hono/node-server';
import { Hono } from 'hono';

import { addOpenIDStrategy, addPasswordStrategy, makeAuth } from './auth/auth.js';
import { google } from './auth/oauth/providers.js';

export async function main() {
  const app = new Hono();

  app.get('/', (c) => c.text('Hello Hono!'));

  const { auth } = await makeAuth({
    dbFile: './auth.sqlite3',
  });

  const googleClient = await google({
    clientId: 'clientId',
    clientSecret: 'clientSecret',
    redirectUri: 'http://localhost:8080/callback',
    scope: 'email profile',
  });

  await addPasswordStrategy(auth);
  await addOpenIDStrategy(auth, googleClient, {
    errorUrl: '/error',
    onLogin(user, profile) {
      return Promise.resolve('/');
    },
    onLoginNoUser(profile) {
      return Promise.resolve('/');
    },
    onSignup(user) {
      return Promise.resolve();
    },
  });

  // Authentication endpoints
  app.route('/internal/auth', auth);

  serve({
    fetch: app.fetch,
    port: 4001,
  }, (info) => {
    console.log(`🚀 Server ready at ${info.address}:${info.port}`);
  });
}

main().then(() => {});
