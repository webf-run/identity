import { User } from '@prisma/client';

import { Publication } from './Output';


export type UserSafe = Omit<User, 'password' | 'passwordHash'>;

export interface UserAccess {
  type: 'user';
  user: UserSafe;
  scope?: Publication;
  scopeId?: bigint;
}

export interface ClientAppAccess {
  type: 'client';
  scope?: Publication;
  scopeId?: bigint;
}


export interface PublicAccess {
  type: 'public';
  scope?: Publication;
  scopeId?: bigint;
}


export type Access = UserAccess | ClientAppAccess | PublicAccess;


export function isUser(access: Access): access is UserAccess {
  return access.type === 'user';
}

export function isClientApp(access: Access) {
  return access.type === 'client';
}

export function makePublicAccess(scopeId?: bigint): PublicAccess {
  return { type: 'public', scopeId };
}
