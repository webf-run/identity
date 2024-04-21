import { acceptInvitation, claimInvitation, inviteUser, getUsers, createNewTenantWithInvite, getTenants, getInvitationInfo, getResetTokenInfo, resetPassword, forgotPassword } from '@webf/auth/context';

import { builder } from './builder.js';

// INPUT TYPES
builder.inputType('NewTenantInput', {
  fields: (t) => ({
    name: t.string({ required: true }),
    description: t.string({ required: true }),
    firstName: t.string({ required: true }),
    lastName: t.string({ required: true }),
    email: t.string({ required: true }),
  }),
});

builder.inputType('NewInvitationInput', {
  fields: (t) => ({
    firstName: t.string({ required: true }),
    lastName: t.string({ required: true }),
    email: t.string({ required: true }),
  }),
});

// OBJECT TYPES
builder.objectType('User', {
  fields: (t) => ({
    id: t.exposeID('id'),
    firstName: t.exposeString('firstName'),
    lastName: t.exposeString('lastName'),
  }),
});

builder.objectType('Tenant', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    description: t.exposeString('description'),
  }),
});

builder.objectType('Invitation', {
  fields: (t) => ({
    id: t.exposeID('id'),
    firstName: t.exposeString('firstName'),
    lastName: t.exposeString('lastName'),
  }),
});

builder.objectType('ResetPasswordRequest', {
  fields: (t) => ({
    id: t.exposeID('id'),
    userId: t.exposeID('userId')
  }),
});

// MUTATION OBJECT TYPES
builder.objectType('NewTenantResponse', {
  fields: (t) => ({
    id: t.exposeID('id'),
    description: t.exposeString('description'),
  }),
});

// QUERY API
builder.queryFields((t) => ({

  getTenants: t.field({
    type: ['Tenant'],

    async resolve(_parent, _args, context) {
      try {
        const page = { number: 1, size: 50 };
        const response = await getTenants(context, page);

        return response;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  }),

  getUsers: t.field({
    type: ['User'],

    args: {
      tenantId: t.arg({ type: 'String', required: true }),
    },
    async resolve(_parent, args, context) {
      try {
        const _page = {
          number: 1,
          size: 50,
        };

        const response = await getUsers(context, args.tenantId);

        return response;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  }),

  getInvitationInfo: t.field({
    type: 'Invitation',
    
    args: {
      invitationCode: t.arg({type: 'String', required: true}),
    },
    async resolve(_parent, args, context) {
      try {
        const response = await getInvitationInfo(context, args.invitationCode);

        if(response){
          return response;
        }
        throw 'Not found'
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  }),

  getResetTokenInfo: t.field({
    type: 'ResetPasswordRequest',

    args: {
      resetToken: t.arg({type: 'String', required: true}),
    },
    async resolve(_parent, args, context) {
      try {
        const response = await getResetTokenInfo(context, args.resetToken)

        if(response){
          return response;
        }
        throw 'Not found'
      } catch (error) {
        console.log(error);
        throw error;
        
      }
    },
  }),
}));

// MUTATION API
builder.mutationFields((t) => ({
  createTenant: t.field({
    type: 'NewTenantResponse',
    args: {
      input: t.arg({ type: 'NewTenantInput', required: true }),
    },
    async resolve(_parent, args, context) {
      try {
        const { input } = args;

        const payload = {
          name: input.name,
          description: input.description,
          invitation: {
            firstName: input.firstName,
            lastName: input.lastName,
            email: input.email,
          },
        };

        const response = await createNewTenantWithInvite(context, payload);

        return {
          id: response.tenant.id,
          description: response.tenant.description,
        };
      } catch (error) {
        // TODO:
        console.error(error);
        throw error;
      }
    },
  }),

  claimInvitation: t.field({
    type: 'Boolean',
    args: {
      inviteCode: t.arg({ type: 'String', required: true }),
      password: t.arg({ type: 'String', required: true }),
    },
    async resolve(_parent, args, context) {
      try {
        const response = await claimInvitation(context, args.inviteCode, args.password);

        return !!response;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  }),

  acceptInvitation: t.field({
    type: 'Boolean',
    args: {
      inviteId: t.arg({ type: 'String', required: true }),
    },
    async resolve(_parent, args, context) {
      try {
        await acceptInvitation(context, args.inviteId);

        return true;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  }),

  inviteUser: t.field({
    type: 'Boolean',
    args: {
      tenantId: t.arg({ type: 'String', required: true }),
      input: t.arg({ type: 'NewInvitationInput', required: true }),
    },
    async resolve(_parent, args, context) {
      try {
        const response = await inviteUser(context, args.input, args.tenantId);

        return !!response;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  }),

  resetPassword: t.field({
    type: 'Boolean',
    args: {
      resetToken: t.arg({type: 'String', required: true}),
      newPassword: t.arg({type: 'String', required: true}),
    },
    async resolve(_parent, args, context) {
      try {
        const response = await resetPassword(context, args.resetToken, args.newPassword);

        return response;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  }),

  forgotPassword: t.field({
    type: 'Boolean',
    args: {
      userName: t.arg({type: 'String', required: true}),
    },
    async resolve(_parent, args, context) {
      try {
        const response = await forgotPassword(context, args.userName);

        return response;
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
  })
}));
