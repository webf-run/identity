import type { DbClient } from '../db/client.js';
import type { Access } from './Access.js';
import type { Invitation, Tenant } from './DbType.js';


export interface AuthContext {
  db: DbClient;
  access: Access;
}

export type ExternalProfile = {
  provider: string;
  subjectId: string;
  email: string;
  emailVerified: boolean;
};

export type InitResponse = {
  apiKey: string;
};

export type OAuthLogin = {
  type: 'login';
  redirectUrl?: string;
};

export type OAuthSignup = {
  type: 'signup';
  redirectUrl?: string;
  inviteCode?: string;
};

export type OAuthLink = {
  type: 'link';
  redirectUrl?: string;
}

export type OAuthState = OAuthLogin | OAuthSignup | OAuthLink;


export type OAuthProfile = {
  /**
   * The OAuth 2.0 provider like `google`, `zoho`, etc. to which this user belongs.
   */
  provider: string;
  subjectId: string;
  email: string;
  emailVerified: boolean;

  givenName: string;
  familyName: string;
  name: string;

  accessToken: string;
  tokenType: string;
};

export type AuthToken = {
  id: string;
  generatedAt: Date;
  duration: number;
  type: 'bearer';
};

export type Credentials =
  | { username: string; password: string; }
  | { email: string; password: string; };


export type NewInvitationInput = {
  firstName: string;
  lastName: string;
  email: string;
  duration?: number;
};

export type NewTenantInput = {
  name: string;
  description: string;
  key?: string;
  invitation: NewInvitationInput;
};

export type NewTenantResponse = {
  tenant: Tenant;
  invitation: Invitation;
};

export type UserInput = {
  firstName: string;
  lastName: string;
  email: string;
  tenantId: string;
};

export type UserWithMembership = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  firstName: string;
  lastName: string;
  tenants: string[];
};
