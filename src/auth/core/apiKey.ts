import { and, eq } from 'drizzle-orm';

import { generateApiKeyId, generateApiKeyToken } from '../data/code.js';
import { verify } from '../data/hash.js';
import { ApiKey } from '../db/model.js';
import { apiKey } from '../db/schema.js';
import { AuthContext } from './type.js';

export async function generateApiKey(context: AuthContext, description: string): Promise<string> {
  const { db } = context;

  const id = generateApiKeyId();
  const token = await generateApiKeyToken();

  await db
    .insert(apiKey)
    .values({
      id,
      description,
      hashFn: token.hashFn,
      isActive: true,
      token: token.secret,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

  const serialized = `${id}.${token.secret}`;

  return serialized;
}

export async function findApiKeyByToken(context: AuthContext, token: string): Promise<ApiKey> {
  const { db } = context;

  const [id, secret] = token.split('.');

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
