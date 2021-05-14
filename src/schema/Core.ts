import { extendType, inputObjectType, nullable, objectType } from 'nexus';
import { authenticate } from '../domain/core/auth';

import { createNewBlog } from '../domain/core/project';
import { R } from '../domain/R';

import { errorUnion } from './helper';


export const InputToken = inputObjectType({
  name: 'InputToken',
  definition(t) {
    t.string('username');
    t.string('password');
  }
});


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


export const NewBlogInput = inputObjectType({
  name: 'NewBlogInput',
  definition(t) {
    t.string('name');
    t.string('publicUrl');
    t.string('fromEmail');
    t.field('firstUser', { type: nullable(UserInput), });
  }
});


export const AuthToken = objectType({
  name: 'AuthToken',
  definition(t) {
    t.string('type');
    t.string('id');
    t.datetime('generatedAt');
    t.int('duration');
  }
});


export const Blog = objectType({
  name: 'Blog',
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
    t.list.field('getBlogs', {
      type: 'Blog',
      resolve(_root, _args, ctx) {
        return ctx.db.blog.findMany({
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

export const CreateBlogResponse = errorUnion('CreateBlogResponse', 'Blog');
export const AuthTokenReponse = errorUnion('AuthTokenReponse', 'AuthToken');

export const CoreMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createBlog', {
      type: 'CreateBlogResponse',
      args: {
        input: NewBlogInput
      },
      resolve(_root, args, ctx) {
        const input = args.input;
        return R.unpack(createNewBlog(ctx, input));
      }
    });

    t.field('authenticateUser', {
      type: 'AuthTokenReponse',
      args: {
        input: InputToken
      },
      resolve(_root, args, ctx) {
        return R.unpack(authenticate(ctx, args.input));
      }
    })
  }
});
