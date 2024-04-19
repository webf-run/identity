import type { User } from '../../contract/DbType.js';
import type { AuthContext, AuthToken, UserInput } from '../../contract/Type.js';
import { createToken, createUser, getUsersByTenant } from '../../dal/userDAL.js';
import { createLocalLogin } from '../../dal/loginDAL.js';
import { addTenantUser } from '../../dal/tenantDAL.js';
import { isMember } from '../access.js';

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
    const _tenantUser = await addTenantUser(tx, input.tenantId, user.id);

    return user;
  });

  return user;
}

/**
 * Get users in a given tenant.
 */
export async function getUsers(ctx: AuthContext, tenantId: string): Promise<User[]> {
  const { access, db } = ctx;

  if (!isMember(access, tenantId)) {
    throw 'Not authorized';
  }

  const users = await getUsersByTenant(db, tenantId, { number: 1, size: 50 });

  return users;
}
