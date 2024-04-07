import { isClient, createNewTenantWithInvite, type Tenant, isUser, type AuthContext } from '@webf/auth/context';
import { getTenantsForUser } from '@webf/auth/dal';


export type NewTenantInput = {
  name: string;
  description: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type NewTenantResponse = {
  id: string;
  description: string;
};
