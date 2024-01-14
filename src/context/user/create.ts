import { createToken } from '../../dal/userDAL.js';
import type { AuthContext, AuthToken } from '../../contract/Type.js';


export async function createBearerToken(context: AuthContext, userId: string): Promise<AuthToken> {
  const { db } = context;
  // Generate a token for the user.
  const token = await createToken(db, userId);

  return {
    ...token!,
    type: 'bearer',
  };
}
