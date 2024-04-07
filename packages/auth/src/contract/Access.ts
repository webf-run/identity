import type { ApiKey } from './DbType.js';
import type { UserWithMembership } from './Type.js';


export type UserAccess = {
  readonly type: 'user';
  readonly user: UserWithMembership;
};

export type ClientAppAccess = {
  readonly type: 'client';
  readonly key: ApiKey;
};

export type PublicAccess = {
  readonly type: 'public';
};


export type Access = UserAccess | ClientAppAccess | PublicAccess;
