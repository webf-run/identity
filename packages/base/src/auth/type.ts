import type { AuthContext, OAuthProfile, User } from '@webf/auth/context';
import type { InitOptions } from '@webf/auth/db';

import type { Context, Hono, MiddlewareHandler } from 'hono';

export type HonoAuthVariables = {
  authContext: AuthContext;
};

export type HonoAuthApp = Hono<{
  Variables: HonoAuthVariables;
}>;

export type HonoAuthContext = Context<{
  Variables: HonoAuthVariables;
}>;

// export type HonoSessionVariables = {};

export type HonoSessionMiddleware = MiddlewareHandler<{
  Variables: HonoAuthVariables;
}>;

export type AuthOptions = {
  /**
   * Path to the SQLite database file.
   * File will be opened in WAL mode.
   */
  db: InitOptions;
};

export type OAuthCallbacks = {
  onLogin: (user: User, profile: OAuthProfile) => Promise<string>;
  onError: (error: unknown) => Promise<string>;
};
