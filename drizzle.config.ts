import type { Config } from 'drizzle-kit';

export default {
  schema: './src/auth/db/schema.ts',
  out: './migrations/auth',
  driver: 'pg',
  dbCredentials: {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'base',
  },
  verbose: true,
  strict: true,
} satisfies Config;
