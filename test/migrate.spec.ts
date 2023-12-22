import { it } from 'node:test';
import { deepEqual } from 'node:assert';

import { sql } from 'drizzle-orm';

import { migrate } from '../src/auth/db/migrator';

type Migration = {
  id: string | null;
  hash: string;
  created_at: string;
};

it('Migration', async (t) => {

  await t.test('migrate()', async () => {
    // SUT - System Under Test
    const { db } = migrate({
      dbFile: ':memory:',
      folder: './migrations/auth',
    });

    // Verify - Result
    const statement = sql`select * from __drizzle_migrations`;
    const results: Migration[] = db.all(statement);
    const applied = results.map((result) => result.created_at);

    deepEqual(applied, [1703172646911]);
  });
});
