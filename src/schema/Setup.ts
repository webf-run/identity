import { enumType, extendType, inputObjectType, objectType } from 'nexus';

import { initializeApp, registerNewClientApp, updateAppConfig } from '../domain/infra/setup';
import { R } from '../domain/R';
import { errorUnion } from './helper';


export const EmailServiceType = enumType({
  name: 'EmailServiceType',
  description: 'Supported email services. Currently only sendgrid.',
  members: ['sendgrid']
});


export const EmailConfigInput =  inputObjectType({
  name: 'EmailConfigInput',
  definition(t) {
    t.field('service', { type: 'EmailServiceType' });
    t.string('fromName');
    t.string('fromEmail');
    t.string('apiKey');
  }
});


export const AppConfigInput = inputObjectType({
  name: 'AppConfigInput',
  description: 'App configuration object',
  definition(t) {
    t.nullable.field('email', { type: 'EmailConfigInput' });
  }
});


export const ClientApp = objectType({
  name: 'ClientApp',
  definition(t) {
    t.id('id');
    t.string('description');
    t.string('secret');
  }
});

export const ClientAppResponse = errorUnion('ClientAppResponse', 'ClientApp');

export const setupMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('initialize', {
      type: 'ClientAppResponse',
      args: {
        description: 'String'
      },
      resolve(_root, args, ctx) {
        return R.unpack(initializeApp(ctx, args.description));
      }
    });

    t.field('registerClientApp', {
      type: 'ClientAppResponse',
      args: {
        description: 'String'
      },
      resolve(_root, args, ctx) {
        return R.unpack(registerNewClientApp(ctx, args.description));
      }
    });

    t.field('updateAppConfig', {
      type: 'ResultResponse',
      args: {
        config: 'AppConfigInput'
      },
      async resolve(_root, args, ctx) {
        const value = await R.unpack(updateAppConfig(ctx, args.config));

        if (typeof value === 'boolean') {
          return { status: value };
        } else {
          return value;
        }
      }
    });
  }
});
