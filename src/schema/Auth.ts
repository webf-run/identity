import { extendType, inputObjectType, objectType } from 'nexus';

import { authenticate, forgotPassword, resetPassword } from '../domain/core/auth';
import { R } from '../domain/R';

import { errorUnion } from './helper';


export const AuthToken = objectType({
  name: 'AuthToken',
  definition(t) {
    t.string('type');
    t.string('id');
    t.datetime('generatedAt');
    t.int('duration');
  }
});


export const InputToken = inputObjectType({
  name: 'InputToken',
  definition(t) {
    t.string('username');
    t.string('password');
  }
});


export const AuthTokenReponse = errorUnion('AuthTokenReponse', 'AuthToken');


export const AuthMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('authenticateUser', {
      type: 'AuthTokenReponse',
      args: { input: InputToken },
      resolve(_root, args, ctx) {
        return R.unpack(authenticate(ctx, args.input));
      }
    }),
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
