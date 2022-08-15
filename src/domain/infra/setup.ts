import { updateEmailConfig } from './email';

import { Either } from '../../util/Either';
import { apply, concat, inSet, maxLen, notEmpty } from '../../util/validator';
import { isClientApp } from '../Access';
import { ErrorCode } from '../AppError';
import { Context } from '../Context';
import { AppConfigInput, EmailConfigInput } from '../Input';
import { ClientApp } from '../Output';
import { R } from '../R';
import { DbContext } from '../DbContext';
import { AppCache, getCache, updateCache } from '../../cache';
import { v4 } from 'uuid';
import { generateClientSecret, hashPassword } from '../../data/code';


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


export async function getUpdatedInitization(db: DbContext): Promise<AppCache> {
  const cache = getCache();

  if (cache.isAppInitialized) {
    return cache;
  }

  const isAppInitialized = await checkAppInitialized(db);

  return updateCache({ isAppInitialized });
}


async function checkAppInitialized(db: DbContext): Promise<boolean> {
  const result = await db.client.getTotalCount();

  return (result[0].count ?? 0) > 0;
}


export async function findClientApp(db: DbContext, id: string): Promise<ClientApp> {
  const result = await db.client.getById({ id });

  return result[0];
}


async function createClientApp(db: DbContext, description: string): Promise<ClientApp> {

  const secret = generateClientSecret();

  const [hashedPassword, hashFn] = await hashPassword(secret);

  const result = await db.client.createClientApp({
    id: v4(),
    description,
    secret: hashedPassword,
    hashFn,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  // Must send original generated secret.
  return {
    ...result[0],
    secret
  };
}
