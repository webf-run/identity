import type { Context, Hono, MiddlewareHandler } from 'hono';

import type { User } from '../../contract/DbType.js';
import type { AuthContext } from '../../contract/Type.js';
import type { InitOptions, DbClient } from '../../db/client.js';
import { Nil } from '../../result.js';
import type { OAuthProfile, OAuthState } from '../oauth/client.js';

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

  errorUrl: string;

  /**
   * The URL to redirect to after login.
  */
  onLogin: (user: User, profile: OAuthProfile) => Promise<string>;
  onLoginNoUser: (profile: OAuthProfile) => Promise<string>;

  onLoginError?: (error: unknown) => Promise<string>;
  onSignup?: (user: OAuthProfile, state: OAuthState) => Promise<void>;
};
