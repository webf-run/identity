import argon2 from 'argon2';
import cryptoRandomString from 'crypto-random-string';

import { generateAuthToken, hashPassword } from '../../data/code';
import { Access } from '../Access';
import { ErrorCode } from '../AppError';
import { Context } from '../Context';
import { TokenInput } from '../Input';
import { AuthToken } from '../Output';
import { R } from '../R';


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

  const verified = await verifyPassword(user.password, password, user.hashFn);

  // Use with given email found but not password match.
  if (!verified) {
    return R.ofError(ErrorCode.INVALID_CRD, 'Invalid user credentials');
  }

  const token = await generateAuthToken(ctx.db, user.id, 'u');

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


export async function resetPassword(ctx: Context, code: string, newPassword: string): DomainResult<boolean> {

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
    return R.ofError(ErrorCode.INVALID_AUTH_REQUEST, '');
  }

  const [password, hashFn] = await hashPassword(newPassword);

  const changePasswordT = ctx.db.user.update({
    where: {
      id: resetReqeust.userId
    },
    data: { password, hashFn }
  });

  const deleteRequestT = ctx.db.resetPasswordRequest.delete({
    where: {
      id: resetReqeust.id
    }
  });

  await ctx.db.$transaction([changePasswordT, deleteRequestT]);

  return R.of(true);
}


export async function validateToken(db: Context['db'], tokenId: string, scope?: string): DomainResult<Access> {

  // TODO: Do not select password related sensitive data
  const token = await db.userToken.findUnique({
    where: {
      id: tokenId
    },
    include: {
      user: {
        include: {
          staff: {
            include: {
              publication: {
                include: {
                  project: true
                }
              }
            }
          }
        }
      }
    }
  });


  const isTokenValid = token && (token.generatedAt.getTime() + token.duration) >= Date.now();

  if (!isTokenValid) {
    return R.ofError(ErrorCode.INVALID_TOKEN, 'Invalid authentication token');
  }

  const publications = token!.user.staff.map((x) => x.publication);


  const access: Access = {
    type: 'user',
    user: token!.user,
    publications: publications
  };

  // Check and find for any scope
  if (scope) {
    const publication = publications
      .find((x) => x.publicUrl === scope || x.id.toString() === scope);

    if (!publication) {
      return R.ofError(ErrorCode.FORBIDDEN, 'Trying to access unknown publication');
    }

    access.scope = publication;
  }

  return R.of(access);
}



function verifyPassword(hash: string, password: string, algo: string): Promise<boolean> {
  if (algo === 'argon2id') {
    return argon2.verify(hash, password, { type: argon2.argon2id })
  }

  throw 'Only argon2id hashing is supported';
}
