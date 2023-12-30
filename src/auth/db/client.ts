import { Sql } from 'postgres';
import { PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js/driver';

import * as schema from '../../schema/identity.js';

export type DbClient = PostgresJsDatabase<typeof schema>;

export type InitOptions = {
  pgClient: Sql;
};

export type DbResponse = {
  db: DbClient;
}

export function init(options: InitOptions): DbResponse {
  const db = drizzle(options.pgClient, { schema });

  return { db };
}
