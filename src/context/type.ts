import type { DbClient } from '../db/client.js';

export type InitResponse = {
  apiKey: string;
};

export interface AuthContext {
  db: DbClient;
}

export type AuthToken = {
  id: string;
  generatedAt: Date;
  duration: number;
  type: 'bearer';
};

export type Credentials =
  | { username: string; password: string; }
  | { email: string; password: string; };


export type Tenant = {
  id: string;
  name: string;
  description: string;
  key: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Invitation = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  code: string;
  firstName: string;
  lastName: string;
  email: string;
  duration: number;
  expiryAt: Date;
  tenantId: string;
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
