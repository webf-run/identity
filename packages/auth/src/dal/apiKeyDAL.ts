import { and, eq } from 'drizzle-orm';

import type { ApiKey } from '../contract/DbType.js';
import type { DbClient } from '../db/client.js';
import { apiKey } from '../schema/identity.js';
import { apiKeyId, apiKeyToken } from '../util/code.js';
import { verify } from '../util/hash.js';

export async function generateApiKey(db: DbClient, description: string): Promise<string> {
  const id = apiKeyId();
  const token = await apiKeyToken();

  await db
    .insert(apiKey)
    .values({
      id,
      description,
      hashFn: token.hashFn,
      isActive: true,
      token: token.hash,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

  const serialized = `${id}.${token.secret}`;

  return serialized;
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
