import { ok } from '../../result.js';
import { generateApiKeyId, generateApiKeyToken } from '../data/code.js';
import { apiKey } from '../db/schema.js';
import { AuthContext } from './type.js';

export async function generateApiKey(context: AuthContext, description: string): AsyncResult<string> {
  const { db } = context;

  const id = generateApiKeyId();
  const token = await generateApiKeyToken();

  await db.insert(apiKey).values({
    id,
    description,
    hashFn: token.hashFn,
    isActive: true,
    token: token.secret,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return ok(`${id}.${token.secret}`);
}
