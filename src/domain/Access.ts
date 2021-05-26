import { User } from '@prisma/client';

import { Publication } from './Output';


export type UserSafe = Omit<User, 'password' | 'passwordHash'>;


export interface UserAccess {
  type: 'user';
  user: UserSafe;
  scope?: Publication;
  publications: Publication[];
}


export interface PublicAccess {
  type: 'public';
  scope: Publication;
  publications: Publication[];
}


export type Access = UserAccess | PublicAccess;


export function isUser(access: Access): access is UserAccess {
  return access.type === 'user';
}
