import type { DbClient } from '../db/client.js';
import { apiKey } from '../schema/identity.js';
import { apiKeyId, apiKeyToken } from '../util/code.js';

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
