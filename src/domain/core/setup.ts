import { getUpdatedInitization } from '../../data/app';
import { createClientApp } from '../../data/client';
import { updateEmailConfig } from '../../data/email';
import { Either } from '../../util/Either';
import { apply, concat, inSet, maxLen, notEmpty } from '../../util/validator';
import { isClientApp } from '../Access';

import { ErrorCode } from '../AppError';
import { Context } from '../Context';
import { AppConfigInput, EmailConfigInput } from '../Input';
import { ClientApp } from '../Output';
import { R } from '../R';


const emailConfigVal = apply<EmailConfigInput>({
  apiKey: concat(
    notEmpty('apiKey is required'),
    maxLen(160, 'apiKey is too long')),
  service: inSet(['sendgrid'], `Service must be of type 'sendgrid'`),
  fromName: concat(
    notEmpty('fromName is required'),
    maxLen(160, 'fromName is too long')),
  fromEmail: concat(
    notEmpty('fromEmail is required'),
    maxLen(160, 'fromEmail is too long'))
});


export async function initializeApp(ctx: Context, description: string): DomainResult<ClientApp> {

  const { db } = ctx;
  const cache = await getUpdatedInitization(db);

  // Allow the first admin to be created without any authentication.
  if (cache.isAppInitialized) {
    return R.ofError(ErrorCode.ALREADY_EXISTS, 'Application is already initialized');
  }

  // TODO: Payload validation pending

  const app = await createClientApp(db, description);

  return R.of(app);
}


export async function updateAppConfig(ctx: Context, config: AppConfigInput): DomainResult<boolean> {

  const { db } = ctx;

  const { email } = config;

  if (!email) {
    return R.of(false);
  }

  const result = emailConfigVal(email);

  if (Either.isLeft(result)) {
    const errors = result.value;
    const message = errors.join('\n');

    return R.ofError(ErrorCode.INVALID_DATA, message);
  }

  await updateEmailConfig(db, email);

  return R.of(true);
}


export async function registerNewClientApp(ctx: Context, description: string): DomainResult<ClientApp> {

  const { db, access } = ctx;

  if (!isClientApp(access)) {
    return R.ofError(ErrorCode.FORBIDDEN, '');
  }

  const app = await createClientApp(db, description);

  return R.of(app);
}
