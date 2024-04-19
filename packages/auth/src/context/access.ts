import type {
  Access,
  ClientAppAccess,
  PublicAccess,
  UserAccess,
} from '../contract/Access.js';
import type { UserWithMembership } from '../contract/Type.js';
import { findApiKeyByToken } from '../dal/apiKeyDAL.js';
import { findUserByToken } from '../dal/userDAL.js';
import type { DbClient } from '../db/client.js';
import type { Nil } from '../result.js';


export const isUser = (access: Access): access is UserAccess => access.type === 'user';
export const isClient = (access: Access): access is ClientAppAccess => access.type === 'client';
export const isPublic = (access: Access): access is PublicAccess => access.type === 'public';

export const isMember = (access: Access, tenantId: string): access is UserAccess =>
  isUser(access) && access.user.tenants.includes(tenantId);


export async function findAccess(db: DbClient, type: string, token: string): Promise<Nil<Access>> {
  if (type.toLowerCase() === 'bearer') {
    const user = await findUserByToken(db, token);

    if (!user) {
      return null;
    }

    return userAccess(user);
  } else if (type.toLowerCase() === 'ApiKey'.toLowerCase()) {
    const apiKey = await findApiKeyByToken(db, token);

    return clientAccess(apiKey);
  } else if (type) {
    return null;
  }

  return publicAccess();
}


function userAccess(user: UserWithMembership): UserAccess {
  return { type: 'user', user };
}

function publicAccess(): PublicAccess {
  return { type: 'public' };
}

function clientAccess(key: ClientAppAccess['key']): ClientAppAccess {
  return { type: 'client', key };
}
