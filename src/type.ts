import type { DbClient } from './db/client.js';
import type { HonoAuthApp, OAuthCallbacks } from './web/hono/type.js';
import type { OAuthProfile, OAuthState } from './web/oauth/client.js';

export type AuthSystem = {
  auth: HonoAuthApp;
  db: DbClient;
};

export type {
  HonoAuthApp,
  DbClient,
  OAuthCallbacks,
  OAuthProfile,
  OAuthState,
};
