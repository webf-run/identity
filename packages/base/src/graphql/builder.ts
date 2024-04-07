import SchemaBuilder from '@pothos/core';
import type { NewInvitationInput, Tenant, User, AuthContext } from '@webf/auth/context';

import type {
  NewTenantInput,
  NewTenantResponse
} from '../context/tenant.js';

export type GraphQLSchema = {
  Context: AuthContext;
  Objects: {
    // Identity Types
    NewTenantResponse: NewTenantResponse;
    User: User;
    Tenant: Tenant;
  };
  Inputs: {
    NewTenantInput: NewTenantInput;
    NewInvitationInput: Omit<NewInvitationInput, 'duration'>;
  };
  DefaultFieldNullability: false;
  DefaultInputFieldRequiredness: true;
};

export const builder = new SchemaBuilder<GraphQLSchema>({
  defaultInputFieldRequiredness: true,
});


// GraphQL query
builder.queryType({});

// GraphQL mutation
builder.mutationType({});
