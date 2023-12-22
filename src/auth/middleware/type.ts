import type { Hono } from 'hono';

import type { AuthContext } from '../core/type.js';
import type { OAuth2Options } from '../oauth/client.js';

export type AuthMiddleware = Hono<{
  Variables: {
    authContext: AuthContext;
  };
}>;


export type AuthOptions = {
  /**
   * Path to the SQLite database file.
   * File will be opened in WAL mode.
   */
  dbFile: string;

  google?: OAuth2Options;
  zoho?: OAuth2Options;
  password?: boolean;
};
