import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate as baseMigrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

export type MigrationConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;

  /**
   * Migrations folder.
   */
  folder: string;
};

export async function migrate(config: MigrationConfig) {
  const pgClient = postgres({
    host: config.host,
    port: config.port,
    username: config.user,
    password: config.password,
    database: config.database,

    // As per recommendation from drizzle about connection pool size:
    // https://orm.drizzle.team/docs/get-started-postgresql#postgresjs
    max: 1,
  });

  const db = drizzle(pgClient);

  await baseMigrate(db, {
    migrationsFolder: config.folder,

    // Note: Drizzle is not using this.
    // It always uses `__drizzle_migrations` table.
    migrationsTable: 'migration',
  });

  await pgClient.end();
}
