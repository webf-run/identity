import { serve } from '@hono/node-server';
import { Hono } from 'hono';

import { makeAuth } from './auth/hono.js';

export async function main() {
  const app = new Hono();

  app.get('/', (c) => c.text('Hello Hono!'));

  const { auth } = await makeAuth({
    dbFile: './auth.sqlite3',
    google: {
      clientId: 'clientId',
      clientSecret: 'clientSecret',
      redirectUri: 'http://localhost:8080/callback',
      scope: 'email profile',
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
