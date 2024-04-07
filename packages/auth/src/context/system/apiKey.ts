import { and, eq } from 'drizzle-orm';

import type { ApiKey } from '../../contract/DbType.js';
import type { AuthContext } from '../../contract/Type.js';
import { generateApiKey } from '../../dal/apiKey.js';
import type { DbClient } from '../../db/client.js';
import { apiKey } from '../../schema/identity.js';
import { verify } from '../../util/hash.js';
import { isClient } from '../access.js';

export async function createNewApiKey(context: AuthContext, description: string): Promise<string> {
  const { access, db } = context;

  if (!isClient(access)) {
    throw 'not authorized';
  }

  const key = await generateApiKey(db, description);

  return key;
}

export async function findApiKeyByToken(db: DbClient, token: string): Promise<ApiKey> {
  const [id, ...rest] = token.split('.');
  const secret = rest.join('');

  const result = await db
    .select()
    .from(apiKey)
    .where(and(eq(apiKey.id, id), eq(apiKey.isActive, true)));

  const key = result.at(0);

  if (!key) {
    // TODO: Error handling
    throw 'key not found';
  }

  const valid = await verify(key.token, secret, key.hashFn);

  if (!valid) {
    // TODO: Error handling
    throw 'key not valid';
  }

  return key;
}
