import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import postgres from 'postgres';

import { makeAuth } from './auth/system.js';
import { google } from './oauth/providers.js';
import { addOpenIDStrategy } from './auth/oauth.js';
import { addPasswordStrategy } from './auth/password.js';


export async function main() {
  const app = new Hono();

  app.get('/', (c) => c.text('Hello Hono!'));

  const pgClient = postgres({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'base',
  });

  const { auth } = await makeAuth({
    db: { pgClient },
  });

  const googleClient = await google({
    clientId: 'clientId',
    clientSecret: 'clientSecret',
    redirectUri: 'http://localhost:8080/callback',
    scope: 'email profile',
  });

  await addPasswordStrategy(auth);
  await addOpenIDStrategy(auth, googleClient, {
    onLogin(user, profile) {
      return Promise.resolve('/');
    },
    onError(error) {
      return Promise.resolve('/');
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
