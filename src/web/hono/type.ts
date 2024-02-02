import type { Context, Hono, MiddlewareHandler } from 'hono';

import type { User } from '../../contract/DbType.js';
import type { AuthContext, OAuthProfile, OAuthState } from '../../contract/Type.js';
import type { InitOptions, DbClient } from '../../db/client.js';
import type { Nil } from '../../result.js';

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

export type LoginNRegisterProps = {
  c: HonoAuthContext;
  db: DbClient;
  user: Nil<User>;
  profile: OAuthProfile;
  callbacks: OAuthCallbacks;
  state: OAuthState;
};

export type AuthOptions = {
  /**
   * Path to the SQLite database file.
   * File will be opened in WAL mode.
   */
  db: InitOptions;
};

export type OAuthCallbacks = {
  /**
   * The URL to redirect to after login.
  */
  onLogin: (user: User, profile: OAuthProfile) => Promise<string>;
  onError: (error: unknown) => Promise<string>;
};
