import { extendType, inputObjectType, objectType } from 'nexus';

import { addNewAdministrator } from '../domain/core/admin';

import { addMemberToPublication, createNewPublication } from '../domain/core/project';
import { R } from '../domain/R';

import { errorUnion } from './helper';


export const QuotaInput = inputObjectType({
  name: 'QuotaInput',
  description: 'Project/Publication quota',
  definition(t) {
    t.int('assetSize', { description: 'Maximum storage space allowed for assets in MBs.' });
    t.int('staffCapacity');
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
    t.string('name', { resolve: (x) => x.project.name });
    t.string('fromEmail', { resolve: (x) => x.project.fromEmail });
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
        return ctx.db.publication.findMany({
          include: {
            project: true
          }
        });
      }
    });
  }
});

export const CoreMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('addAdministrator', {
      type: 'ResultResponse',
      args: {
        admin: 'UserInput'
      },
      resolve(_root, args, ctx) {
        return R.unpack(addNewAdministrator(ctx, args.admin));
      }
    });
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
  }
});
