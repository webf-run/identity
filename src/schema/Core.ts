import { extendType, inputObjectType, nullable, objectType } from 'nexus';

import { createNewPublication } from '../domain/core/project';
import { R } from '../domain/R';

import { errorUnion } from './helper';


export const QuotaInput = inputObjectType({
  name: 'QuotaInput',
  description: 'Project/Publication quota',
  definition(t) {
    t.int('assetSize');
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
    t.nullable.string('password');
  }
});


export const PublicationInput = inputObjectType({
  name: 'PublicationInput',
  definition(t) {
    t.string('name');
    t.string('publicUrl');
    t.string('fromEmail');
    t.field('firstUser', { type: 'UserInput' });
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
    t.field('createPublication', {
      type: 'NewPublicationResponse',
      args: {
        input: 'PublicationInput'
      },
      resolve(_root, args, ctx) {
        return R.unpack(createNewPublication(ctx, args.input));
      }
    });
  }
});
