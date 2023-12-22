import type { Context, Hono } from 'hono';

import type { AuthContext } from '../core/type.js';
import type { OAuthProfile } from '../oauth/client.js';
import { User } from '../db/model.js';

export type HonoAuthVariables = {
  authContext: AuthContext;
};

export type HonoAuthMiddleware = Hono<{
  Variables: HonoAuthVariables;
}>;

export type HonoAuthContext = Context<{
  Variables: HonoAuthVariables;
}>;


export type LoginNRegisterProps = {
  c: HonoAuthContext;
  user: Nil<User>;
  profile: OAuthProfile;
  callbacks: OAuthCallbacks;
};

export type AuthOptions = {
  /**
   * Path to the SQLite database file.
   * File will be opened in WAL mode.
   */
  dbFile: string;
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
