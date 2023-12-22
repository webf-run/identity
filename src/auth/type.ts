import type { DbClient } from './db/client.js';
import type { HonoAuthMiddleware, OAuthCallbacks } from './hono/type.js';

export type AuthSystem = {
  auth: HonoAuthMiddleware;
  db: DbClient;
};

export type {
  HonoAuthMiddleware,
  DbClient,
  OAuthCallbacks,
};
