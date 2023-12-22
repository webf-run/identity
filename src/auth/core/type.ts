import type { DbClient } from '../db/client.js';

export interface AuthContext {
  db: DbClient;
}

export interface AuthToken {
  id: string;
  generatedAt: Date;
  duration: number;
  type: 'bearer';
}

export type Credentials =
  | { username: string; password: string; }
  | { email: string; password: string; };
