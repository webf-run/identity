import path from 'node:path';

import postgres from 'postgres';
import { z } from 'zod';

import { initialize } from '../../src/context.js';
import { migrate } from '../../src/db/migrator.js';
import { init, type DBConnectionOptions } from '../../src/db/client.js';

const dbConfigDecoder = z.object({
  DB_HOST: z.string(),
  DB_PORT: z.coerce.number(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
});

export function parseEnv(): DBConnectionOptions {
  return dbConfigDecoder.parse(process.env);
}

export async function runMigrations(dbEnv: DBConnectionOptions) {
  const migrationsFolder = path.join(process.cwd(), 'migrations');

  await migrate({
    host: dbEnv.DB_HOST,
    port: dbEnv.DB_PORT,
    user: dbEnv.DB_USER,
    password: dbEnv.DB_PASSWORD,
    database: dbEnv.DB_NAME,
    folder: migrationsFolder,
  });
}

export function makePGClient(dbEnv: DBConnectionOptions, useDb: boolean) {
  // Connect to database
  const sql = postgres({
    host: dbEnv.DB_HOST,
    port: dbEnv.DB_PORT,
    username: dbEnv.DB_USER,
    password: dbEnv.DB_PASSWORD,
    database: useDb ? dbEnv.DB_NAME : undefined,
  });

  return { sql };
}

export async function setupCleanDb(dbEnv: DBConnectionOptions) {
  // Parse environment variables and connect to database
  const { sql } = makePGClient(dbEnv, false);

  // Create a new database
  await sql`CREATE DATABASE ${sql(dbEnv.DB_NAME)}`;

  // Disconnect from database
  await sql.end();

}

export async function seedApiKey(dbEnv: DBConnectionOptions) {
  // Connect to the new database
  const pgClient = makePGClient(dbEnv, true).sql;

  const { db } = init({ pgClient });

  // Initialize the system with first API Key.
  const response = await initialize(db);

  // Disconnect from database
  await pgClient.end();

  return response;
}

export async function teardownDb(dbEnv: DBConnectionOptions) {
  // Parse environment variables and connect to database
  const { sql } = makePGClient(dbEnv, false);

  try {
    // Drop database
    await sql`DROP DATABASE ${sql(dbEnv.DB_NAME)}`;
  } finally {
    // Disconnect from database
    await sql.end();
  }
}
