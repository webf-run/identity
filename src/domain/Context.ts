import type { PrismaClient } from '@prisma/client';

import { Either } from '../util/Either';
import { Access, makePublicAccess } from './Access';
import { validateToken } from './core/auth';
import { R } from './R';


export interface Context {
  db: PrismaClient;
  access: Access;
}


export async function makeContext(db: PrismaClient, tokenId?: string, scope?: string): DomainResult<Context> {

  if (!tokenId) {
    return R.of({ db, access: makePublicAccess() });
  }

  const result = await validateToken(db, tokenId, scope);

  if (Either.isRight(result)) {
    const access = result.value;

    return R.of({ db, access });
  }

  return result;
}
