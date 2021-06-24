import { enumType, extendType, inputObjectType } from 'nexus';
import { updateAppConfig } from '../domain/core/setup';
import { R } from '../domain/R';


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


export const setupMutation = extendType({
  type: 'Mutation',
  definition(t) {
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
