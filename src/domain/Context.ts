import type { PrismaClient } from '@prisma/client';

import { Either } from '../util/Either';
import { Access } from './Access';
import { validateToken } from './core/auth';
import { R } from './R';


export interface Context {
  db: PrismaClient;
  access: Access;
}


export async function makeContext(db: PrismaClient, tokenId: string): DomainResult<Context> {

  const result = await validateToken(db, tokenId);

  if (Either.isRight(result)) {
    const access = result.value;

    return R.of({ db, access });
  }

  return result;
}
