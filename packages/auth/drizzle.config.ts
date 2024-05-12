import type { Config } from 'drizzle-kit';

export default {
  dialect: 'postgresql',
  schema: [
    './src/schema/identity.ts',
  ],
  out: './migrations',
  dbCredentials: {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'base',
  },
  migrations: {
    schema: 'public',
    table: 'migrations',
  },
  verbose: true,
  strict: true,
} satisfies Config;
