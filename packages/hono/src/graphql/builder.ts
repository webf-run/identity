import SchemaBuilder from '@pothos/core';
import type {
  AuthContext,
  Invitation,
  NewInvitationInput,
  ResetPasswordRequest,
  Tenant,
  User,
} from '@webf/auth/context';

import type {
  NewTenantInput,
  NewTenantResponse,
} from '../context/tenant.js';

export type GraphQLSchema = {
  Context: AuthContext;
  Objects: {
    Invitation: Invitation;
    ResetPasswordRequest: ResetPasswordRequest;
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
