import { extendType, inputObjectType, objectType } from 'nexus';

import { claimInvitation } from '../domain/core/claim';
import { deleteInvitation, retryInvitation } from '../domain/core/invitation';

import { addMemberToPublication, createNewPublication } from '../domain/publication/new';
import { R } from '../domain/R';

import { errorUnion } from './helper';


export const QuotaInput = inputObjectType({
  name: 'QuotaInput',
  description: 'Project/Publication quota',
  definition(t) {
    t.int('assetSize', { description: 'Maximum storage space allowed for assets in MBs.' });
    t.int('maxCapacity');
  }
});


export const UserInput = inputObjectType({
  name: 'UserInput',
  description: 'New User Input',
  definition(t) {
    t.string('firstName');
    t.string('lastName');
    t.string('email');
  }
});


export const NewPublicationInput = inputObjectType({
  name: 'NewPublicationInput',
  definition(t) {
    t.string('name');
    t.string('publicUrl');
    t.string('fromEmail');
    t.field('firstUser', { type: 'UserInput' });
    t.nullable.string('password');
    t.field('quota', { type: 'QuotaInput' });
  }
});


export const Publication = objectType({
  name: 'Publication',
  definition(t) {
    t.id('id', { resolve: (x) => x.id.toString() });
    // TODO: Publication should have name
    t.string('name', { resolve: (x) => '' });
    t.string('fromEmail', { resolve: (x) => x.fromEmail });
    t.string('publicUrl');
  }
});


export const NewPublicationResponse = errorUnion('NewPublicationResponse', 'Publication');


export const CoreQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('getPublications', {
      type: 'Publication',
      resolve(_root, _args, ctx) {
        throw 'pending work';
      }
    });
  }
});

export const CoreMutation = extendType({
  type: 'Mutation',
  definition(t) {

    t.field('createPublication', {
      type: 'NewPublicationResponse',
      args: {
        input: 'NewPublicationInput'
      },
      resolve(_root, args, ctx) {
        return R.unpack(createNewPublication(ctx, args.input));
      }
    });

    t.field('addMemberToPublication', {
      type: 'ResultResponse',
      args: {
        user: 'UserInput'
      },
      resolve(_root, args, ctx) {
        return R.unpack(addMemberToPublication(ctx, args.user));
      }
    });

    t.field('claimInvitation', {
      type: 'ResultResponse',
      args: {
        code: 'String',
        password: 'String'
      },
      resolve(_root, args, ctx) {
        return R.unpack(claimInvitation(ctx, args.code, args.password));
      }
    });

    t.field('deleteInvitation', {
      type: 'ResultResponse',
      args: {
        invitationId: 'ID'
      },
      resolve(_root, args, ctx) {
        // TODO: Exception handling for bigint
        return R.unpack(deleteInvitation(ctx, args.invitationId));
      }
    });

    t.field('retryInvitation', {
      type: 'ResultResponse',
      description: 'Extend the validity of already expired invitation',
      args: {
        invitationId: 'ID'
      },
      resolve(_root, args, ctx) {
        // TODO: Exception handling for bigint
        return R.unpack(retryInvitation(ctx, args.invitationId));
      }
    });

  }
});
