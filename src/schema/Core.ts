import { extendType, inputObjectType, nullable, objectType } from 'nexus';

import { createNewPublication } from '../domain/core/project';
import { R } from '../domain/R';

import { errorUnion } from './helper';


export const UserInput = inputObjectType({
  name: 'UserInput',
  description: 'New User Input',
  definition(t) {
    t.string('firstName');
    t.string('lastName');
    t.string('email');
    t.string('password');
  }
});


export const NewPublication = inputObjectType({
  name: 'NewPublication',
  definition(t) {
    t.string('name');
    t.string('publicUrl');
    t.string('fromEmail');
    t.field('firstUser', { type: nullable(UserInput), });
  }
});


export const Publication = objectType({
  name: 'Publication',
  definition(t) {
    t.id('id');
    t.string('name');
    t.string('fromEmail');
    t.string('publicUrl');
  }
});


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
        }).then((x) =>
          x.map((y) => ({
            id: y.project.id.toString(),
            name: y.project.name,
            fromEmail: y.project.fromEmail,
            publicUrl: y.publicUrl
          })));
      }
    })
  }
});

export const NewPublicationResponse = errorUnion('NewPublicationResponse', 'Publication');


export const CoreMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createPublication', {
      type: 'NewPublicationResponse',
      args: {
        input: NewPublication
      },
      resolve(_root, args, ctx) {
        const input = args.input;
        return R.unpack(createNewPublication(ctx, input));
      }
    });
  }
});
