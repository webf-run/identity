import type { PrismaClient } from '@prisma/client';
import { getEmailConfig } from '../data/email';

import { EmailService } from '../infra/Email';
import { Either } from '../util/Either';
import { Access, makePublicAccess } from './Access';
import { getAccessForToken } from './core/auth';
import { R } from './R';


export interface Context {
  db: PrismaClient;
  access: Access;
  email: EmailService;
}


export async function makeContext(db: PrismaClient, tokenId?: string, scope?: bigint): DomainResult<Context> {

  const emailConfigCb = () => getEmailConfig(db);
  const email = new EmailService(emailConfigCb);

  if (!tokenId) {
    return R.of({
      db,
      access: makePublicAccess(scope),
      email
    });
  }

  const result = await getAccessForToken(db, tokenId, scope);

  if (Either.isRight(result)) {
    const access = result.value;

    return R.of({
      db,
      access,
      email
    });
  }

  return result;
}
