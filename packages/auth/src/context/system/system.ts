import { sql } from 'drizzle-orm';

import type { InitResponse } from '../../contract/Type.js';
import { generateApiKey } from '../../dal/apiKeyDAL.js';
import type { DbClient } from '../../db/client.js';
import type { Nil } from '../../result.js';
import { apiKey } from '../../schema/identity.js';

/**
 * An app is initialized if it has at least one API key in the database.
 * @param context
 */
export async function hasAppInitialized(db: DbClient): Promise<boolean> {

  const result = await db
    .select({
      count: sql<number>`cast(count(${apiKey.id}) as int)`,
    })
    .from(apiKey);

  const count = result.at(0)?.count ?? 0;

  return count > 0;
}

export async function initialize(db: DbClient): Promise<Nil<InitResponse>> {
  const apiKey = await db.transaction(async (tx) => {
    const initialized = await hasAppInitialized(tx);

    if (initialized) {
      return;
    }

    const apiKey = await generateApiKey(tx, 'First API key');

    return apiKey;
  });

  if (apiKey) {
    return { apiKey };
  }

  return null;
}
