import postgres from 'postgres';

import type { Access, AuthContext } from '../../src/context.js';
import {  createToken, findUserByToken } from '../../src/dal.js';
import { init, type DbClient } from '../../src/db/client.js';
import { parseEnv } from './dbEnv.js';
import { findApiKeyByToken } from '../../src/dal/apiKeyDAL.js';

export type Connection = {
  db: DbClient;
  end: () => Promise<void>;
};

export function getDb(): Connection {
  // Parse environment variables
  const dbEnv = parseEnv();

  // Connect to database
  const sql = postgres({
    host: dbEnv.DB_HOST,
    port: dbEnv.DB_PORT,
    username: dbEnv.DB_USER,
    password: dbEnv.DB_PASSWORD,
    database: dbEnv.DB_NAME,
  });

  const { db } = init({ pgClient: sql });
  const end = () => sql.end();

  return { db, end };
}

export function getContext(db: DbClient, access: Access): AuthContext {

  return { db, access };
}

export async function getUserAccess(db: DbClient, userId: string): Promise<Access> {
  const token = await createToken(db, userId);

  if (!token) {
    throw new Error('User not found for token');
  }

  const user = await findUserByToken(db, token.id);

  if (!user) {
    throw new Error('User not found for token');
  }

  const access: Access = {
    type: 'user',
    user,
  };

  return access;
}

export async function getClientAccess(db: DbClient, token: string): Promise<Access> {

  const key = await findApiKeyByToken(db, token);

  const access: Access = {
    type: 'client',
    key,
  };

  return access;
}

export function getPublicAccess(): Access {
  const access: Access = {
    type: 'public',
  };

  return access;
}
