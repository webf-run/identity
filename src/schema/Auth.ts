import { enumType, extendType, inputObjectType, objectType } from 'nexus';

import { authenticate, forgotPassword, resetPassword } from '../domain/auth/auth';
import { R } from '../domain/R';

import { errorUnion } from './helper';


export const GrantType = enumType({
  name: 'GrantType',
  description: 'Access token request type',
  members: ['USER', 'CLIENT']
});


export const Credentials = inputObjectType({
  name: 'Credentials',
  description: `For USER grant, use email and password. For CLIENT grant, use client id and client secret.`,
  definition(t) {
    t.string('id');
    t.string('secret');
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


export const AuthTokenResponse = errorUnion('AuthTokenResponse', 'AuthToken');


export const AuthMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('authenticate', {
      description: 'Generate a token using user or client credentials',
      type: 'AuthTokenResponse',
      args: {
        grantType: 'GrantType',
        input: 'Credentials'
      },
      resolve(_root, args, ctx) {
        return R.unpack(authenticate(ctx, args.grantType, args.input));
      }
    });

    t.field('forgotPassword', {
      type: 'Boolean',
      args: { username: 'String' },
      async resolve(_root, args, ctx) {
        // Currently consume all the errors.
        const res = await R.unpack(forgotPassword(ctx, args.username));

        return typeof res === 'boolean' ? res : false;
      }
    });

    t.field('resetPassword', {
      type: 'Boolean',
      args: { code: 'String', password: 'String' },
      async resolve(_root, args, ctx) {
        // Currently consume all the errors.
        const res = await R.unpack(resetPassword(ctx, args.code, args.password));

        return typeof res === 'boolean' ? res : false;
      }
    });
  }
});
