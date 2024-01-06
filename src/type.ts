import type { DbClient } from './db/client.js';
import type { HonoAuthApp, OAuthCallbacks } from './web/hono/type.js';

export type AuthSystem = {
  auth: HonoAuthApp;
  db: DbClient;
};

export type {
  HonoAuthApp,
  DbClient,
  OAuthCallbacks,
};
