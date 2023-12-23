import { generateApiKeyId, generateApiKeyToken } from '../data/code.js';
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
