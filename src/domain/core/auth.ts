import { UserToken } from '@prisma/client';
import argon2 from 'argon2';
// import cryptoRandomString from 'crypto-random-string';

import { Context } from '../../context';

import { ErrorCode } from '../AppError';
import { R } from '../R';

import { AuthToken, InputToken } from './type';


export async function authenticate(ctx: Context, input: InputToken): DomainResult<AuthToken> {

  const { username, password } = input;

  const user = await ctx.db.user.findUnique({
    where: {
      email: username
    }
  });

  // User with given email not found.
  if (!user) {
    return R.ofError(ErrorCode.INVALID_CRD, 'Invalid user credentials');
  }

  const verified = await argon2.verify(user.password, password, { type: argon2.argon2id });

  // Use with given email found but not password match.
  if (!verified) {
    return R.ofError(ErrorCode.INVALID_CRD, 'Invalid user credentials');
  }

  const token = await generateToken(ctx.db, user.id, 'u');

  // throw 'e';

  return R.of({
    id: token.id.toString(),
    type: 'Bearer',
    duration: token.duration,
    generatedAt: token.generatedAt
  });
}


function generateToken(db: Context['db'], userId: bigint, prefix: 'u'): Promise<UserToken> {
  const tokenId = prefix + '-'; // + cryptoRandomString({ length: 32, type: 'url-safe' });

  return db.userToken.create({
    data: {
      id: tokenId,
      duration: 3600 * 72,
      userId
    }
  }).then((x) => x)
}
