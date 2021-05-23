import { UserToken } from '@prisma/client';
import argon2 from 'argon2';
import cryptoRandomString from 'crypto-random-string';

import { Context } from '../../context';

import { ErrorCode } from '../AppError';
import { R } from '../R';

import { TokenInput } from '../Input';
import { AuthToken } from '../Output';


export async function authenticate(ctx: Context, input: TokenInput): DomainResult<AuthToken> {

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

  const verified = await verifyPassword(user.password, password, user.passwordHash);

  // Use with given email found but not password match.
  if (!verified) {
    return R.ofError(ErrorCode.INVALID_CRD, 'Invalid user credentials');
  }

  const token = await generateToken(ctx.db, user.id, 'u');

  return R.of({ ...token, type: 'Bearer' });
}


export async function forgotPassword(ctx: Context, username: string): DomainResult<boolean> {

  const user = await ctx.db.user.findUnique({
    where: {
      email: username
    },
    include: {
      resetRequest: true
    }
  });

  if (!user) {
    return R.of(true);
  }

  if (!user.resetRequest) {
    user.resetRequest = await ctx.db.resetPasswordRequest.create({
      data: {
        code: cryptoRandomString({ length: 96, type: 'url-safe' }),
        userId: user.id
      }
    });
  }

  // TODO: Send the email again

  return R.of(true);
}


export async function resetPassword(ctx: Context, code: string, password: string): DomainResult<boolean> {

  // Token is valid for 30 minutes only
  const validTime = new Date(Date.now() - 30 * 60000);

  const resetReqeust = await ctx.db.resetPasswordRequest.findFirst({
    where: {
      AND: {
        code,
        updatedAt: {
          gte: validTime
        }
      }
    }
  });

  if (!resetReqeust) {
    return R.ofError(ErrorCode.INVALID_REQUEST, '');
  }

  const [hash, algo] = await hashPassword(password);

  const changePasswordT = ctx.db.user.update({
    where: {
      id: resetReqeust.userId
    },
    data: {
      password: hash,
      passwordHash: algo
    }
  });

  const deleteRequestT = ctx.db.resetPasswordRequest.delete({
    where: {
      id: resetReqeust.id
    }
  });

  await ctx.db.$transaction([changePasswordT, deleteRequestT]);

  return R.of(true);
}


export async function hashPassword(password: string): Promise<[string, string]> {
  const hash = await argon2.hash(password, { type: argon2.argon2id });

  return [hash, 'argon2id'];
}


function generateToken(db: Context['db'], userId: bigint, prefix: 'u'): Promise<UserToken> {
  const tokenId = prefix + '-' + cryptoRandomString({ length: 32, type: 'url-safe' });

  return db.userToken.create({
    data: {
      id: tokenId,
      duration: 3600 * 72,
      userId
    }
  });
}

function verifyPassword(hash: string, password: string, algo: string): Promise<boolean> {
  if (algo === 'argon2id') {
    return argon2.verify(hash, password, { type: argon2.argon2id })
  }

  throw 'argon2id supported';
}
