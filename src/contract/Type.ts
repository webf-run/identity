import type { DbClient } from '../db/client.js';
import { Invitation, Tenant } from './DbType.js';


export interface AuthContext {
  db: DbClient;
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

export type NewTenant = {
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
