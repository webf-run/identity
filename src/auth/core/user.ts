import { createToken } from '../data/user';
import { DbClient } from '../type';
import { AuthToken } from './type';

export async function createBearerToken(db: DbClient, userId: string): Promise<AuthToken> {
  // Generate a token for the user.
  const token = await createToken(db, userId);

  return {
    ...token!,
    type: 'bearer',
  };
}
