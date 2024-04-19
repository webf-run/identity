import { and, eq } from 'drizzle-orm';

import type { ApiKey } from '../../contract/DbType.js';
import type { AuthContext } from '../../contract/Type.js';
import { generateApiKey } from '../../dal/apiKeyDAL.js';
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
