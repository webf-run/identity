import { updateEmailConfig } from '../../data/email';
import { Either } from '../../util/Either';
import { apply, concat, inSet, maxLen, notEmpty } from '../../util/validator';
import { ErrorCode } from '../AppError';
import { Context } from '../Context';
import { AppConfigInput, EmailConfigInput } from '../Input';
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
