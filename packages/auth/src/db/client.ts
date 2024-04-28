import { Sql } from 'postgres';
import { PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js/driver';

import * as schema from '../schema/identity.js';

export type DBConnectionOptions = {
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
};

export type DbClient = PostgresJsDatabase<typeof schema>;

export type DbOptions = {
  pgClient: Sql;
  logger?: boolean;
};

export type DbResponse = {
  db: DbClient;
}

export function init(options: DbOptions): DbResponse {
  const db = drizzle(options.pgClient, { schema, logger: options.logger });

  return { db };
}
