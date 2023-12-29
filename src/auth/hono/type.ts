import type { Context, Hono, MiddlewareHandler } from 'hono';

import type { AuthContext } from '../core/type.js';
import type { OAuthProfile } from '../oauth/client.js';
import type { ApiKey, User, UserWithMembership } from '../db/model.js';
import type { InitOptions, DbClient } from '../db/client.js';

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
};

export type AuthOptions = {
  /**
   * Path to the SQLite database file.
   * File will be opened in WAL mode.
   */
  db: InitOptions
};

export type OAuthCallbacks = {

  errorUrl: string;

  /**
   * The URL to redirect to after login.
  */
  onLogin: (user: User, profile: OAuthProfile) => Promise<string>;
  onLoginNoUser: (profile: OAuthProfile) => Promise<string>;

  onLoginError?: (error: unknown) => Promise<string>;
  onSignup?: (user: OAuthProfile) => Promise<void>;
};


export interface UserAccess {
  readonly type: 'user';
  readonly user: UserWithMembership;
}

export interface ClientAppAccess {
  readonly type: 'client';
  readonly key: ApiKey;
}

export interface PublicAccess {
  readonly type: 'public';
}


export type Access = UserAccess | ClientAppAccess | PublicAccess;
