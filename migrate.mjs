import { migrate } from 'postgres-migrations';

async function main() {
  const dbConfig = {
    database: process.env.PG_DATABASE,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    port: Number(process.env.PG_PORT),

    ensureDatabaseExists: true,

    // Default: 'postgres'
    // Used when checking/creating 'database-name'
    defaultDatabase: 'postgres'
  };

  await migrate(dbConfig, './migrations');
}

main();
