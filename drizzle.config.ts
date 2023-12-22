import type { Config } from 'drizzle-kit';

export default {
  schema: './src/auth/db/schema.ts',
  out: './migrations/auth',
  driver: 'better-sqlite',
  dbCredentials: {
    url: './migrate.fixture.db'
  },
  verbose: true,
  strict: true,
} satisfies Config;
