import postgres from 'postgres';
import { PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js/driver';

import * as schema from './schema.js';

export type DbClient = PostgresJsDatabase<typeof schema>;

export type InitOptions = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
};

export type DbResponse = {
  db: DbClient;
}

export function init(options: InitOptions): DbResponse {
  const pgClient = postgres(options);
  const db = drizzle(pgClient, { schema });

  return { db };
}
