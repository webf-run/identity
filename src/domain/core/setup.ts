import { getUpdatedInitization } from '../../data/app';
import { hashPassword } from '../../data/code';
import { updateEmailConfig } from '../../data/email';
import { isUniqueConstraint } from '../../data/error';
import { Either } from '../../util/Either';
import { apply, concat, inSet, maxLen, notEmpty } from '../../util/validator';

import { ErrorCode } from '../AppError';
import { Context } from '../Context';
import { AppConfigInput, EmailConfigInput, UserInput } from '../Input';
import { Result } from '../Output';
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


export async function initializeApp(ctx: Context, admin: UserInput, password: string): DomainResult<Result> {

  const { db } = ctx;
  const cache = await getUpdatedInitization(db);

  // Allow the first admin to be created without any authentication.
  if (cache.isAppInitialized) {
    return R.ofError(ErrorCode.ALREADY_EXISTS, 'Application is already initialized');
  }

  // TODO: Payload validation pending

  const [passwordHashed, hashFn] = await hashPassword(password);

  try {
    // First user would always be super admin
    const _response = await db.admin.create({
      data: {
        superAdmin: true,
        user: {
          create: {
            email: admin.email,
            firstName: admin.firstName,
            lastName: admin.lastName,
            hashFn,
            password: passwordHashed
          }
        }
      }
    });

    return R.of({ status: true });

  } catch (error) {
    if (isUniqueConstraint(error, 'email')) {
      return R.ofError(ErrorCode.ALREADY_EXISTS, 'Application is already initialized');
    }

    throw error;
  }
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
