import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3/driver';
import { migrate as baseMigrate } from 'drizzle-orm/better-sqlite3/migrator';

export type MigrationConfig = {
  /**
   * The SQLite file containing databse.
   */
  dbFile: string;

  /**
   * Migrations folder.
   */
  folder: string;
};

export function migrate(config: MigrationConfig) {
  const dbClient = new Database(config.dbFile);
  const db = drizzle(dbClient);

  baseMigrate(db, {
    migrationsFolder: config.folder,

    // Note: Drizzle is not using this.
    // It always uses `__drizzle_migrations` table.
    migrationsTable: 'migration',
  });

  return { db };
}
