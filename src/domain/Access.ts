import { Role, User } from '@prisma/client';

import { PublicationRole } from '../data/constant';
import { Publication } from './Output';


export type UserInfo =
  Omit<User, 'password' | 'passwordHash' | 'hashFn'>
  & { role?: Role; };

export interface UserAccess {
  type: 'user';
  user: UserInfo;
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

export function isAuthor(access: UserAccess) {
  return access.user.role?.id === PublicationRole.Author;
}

export function isEditor(access: UserAccess) {
  return access.user.role?.id === PublicationRole.Editor;
}

export function isOwner(access: UserAccess) {
  return access.user.role?.id === PublicationRole.Owner;
}
