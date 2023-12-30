import { sql } from 'drizzle-orm';

import { ok, err } from '../../result.js';
import { apiKey } from '../../schema/identity.js';
import { generateApiKey } from './apiKey.js';
import { AuthContext, InitResponse } from './type.js';

/**
 * An app is initialized if it has at least one API key in the database.
 * @param context
 */
export async function hasAppInitialized(context: AuthContext): Promise<boolean> {
  const { db } = context;

  const result = await db
    .select({
      count: sql<number>`cast(count(${apiKey.id}) as int)`,
    })
    .from(apiKey);

  const count = result.at(0)?.count ?? 0;

  return count > 0;
}

export async function initialize(context: AuthContext): AsyncResult<InitResponse> {
  const { db } = context;

  const apiKey = await db.transaction(async (tx) => {

    const initialized = await hasAppInitialized({ db: tx });

    if (initialized) {
      return;
    }

    const apiKey = await generateApiKey({ db: tx }, 'First API key');

    return apiKey;
  });

  if (apiKey) {
    return ok({
      apiKey,
    });
  } else {
    return err('INTERNAL_ERROR', 'App already initialized.');
  }

}
