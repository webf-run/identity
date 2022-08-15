import { Client, ConnectionConfig } from 'pg';
import { DbClientImpl } from './db/Db';

import { DbClient } from './domain/DbContext';

const DB_KEY = Symbol.for('bisa.db2');

export async function initialize(config: ConnectionConfig): Promise<DbClient> {

  const obj = global as any;

  if (!obj[DB_KEY]) {
    const dbClient = new DbClientImpl(config);
    obj[DB_KEY] = dbClient;

    return dbClient;
  } else {
    return obj[DB_KEY];
  }
}


export function getClient(): Client {
  return (global as any)[DB_KEY];
}
