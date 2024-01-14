import type { User } from '../contract/DbType.js';
import type { AuthContext, AuthToken, UserInput } from '../contract/Type.js';
import { createToken, createUser } from '../dal/userDAL.js';
import { createLocalLogin } from '../dal/loginDAL.js';
import { createTenantUser } from '../dal/tenantDAL.js';

/**
 * Issue a new bearer token for the user.
 */
export async function createBearerToken(context: AuthContext, userId: string): Promise<AuthToken> {
  const { db } = context;
  // Generate a token for the user.
  const token = await createToken(db, userId);

  return {
    ...token!,
    type: 'bearer',
  };
}

/**
 * Create new user in a given tenant. Also, creates a local login for the user.
 */
export async function createNewUser(context: AuthContext, input: UserInput, password: string): Promise<User> {
  const { db } = context;

  const user = await db.transaction(async (tx) => {
    const user = await createUser(tx, input);
    const _login = await createLocalLogin(tx, user.id, input.email, password);
    const _tenantUser = await createTenantUser(tx, input.tenantId, user.id);

    return user;
  });

  return user;
}
