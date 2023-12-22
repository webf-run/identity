import Database from 'better-sqlite3';
import { BetterSQLite3Database, drizzle } from 'drizzle-orm/better-sqlite3/driver';

import * as schema from './schema.js';

export type DbClient = BetterSQLite3Database<typeof schema>;

export function init(dbUri: string): DbClient {
  const client = new Database(dbUri);
  const db = drizzle(client, { schema });

  return db;
}
