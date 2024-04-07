import type { Access, UserAccess, ClientAppAccess, PublicAccess } from '../contract/Access.js';


export const isUser = (access: Access): access is UserAccess => access.type === 'user';
export const isClient = (access: Access): access is ClientAppAccess => access.type === 'client';
export const isPublic = (access: Access): access is PublicAccess => access.type === 'public';

export const isMember = (access: Access, tenantId: string): access is UserAccess =>
  isUser(access) && access.user.tenants.includes(tenantId);
