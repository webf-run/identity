import { ClientAppToken, UserToken } from '@prisma/client';
import argon2 from 'argon2';
import cryptoRandomString from 'crypto-random-string';

import { findClientApp } from '../../data/client';
import { generateClientToken, generateUserToken } from '../../data/code';
import { findUserToken } from '../../data/token';
import { changePassword, findUserByEmail } from '../../data/user';

import { Access, ClientAppAccess, UserAccess } from '../Access';
import { ErrorCode } from '../AppError';
import { Context } from '../Context';
import { GrantType, TokenInput } from '../Input';
import { AuthToken } from '../Output';
import { R } from '../R';


export async function authenticate(ctx: Context, grantType: GrantType, input: TokenInput): DomainResult<AuthToken> {

  const { db, access } = ctx;
  const { username, password } = input;

  if (grantType === 'USER') {

    if (!access.scopeId) {
      return R.ofError(ErrorCode.INVALID_SCOPE, 'Correct scope is required to authenticate');
    }

    const user = await findUserByEmail(db, username, access.scopeId);

    // User with given email not found.
    if (!user) {
      return R.ofError(ErrorCode.INVALID_CRD, 'Invalid user credentials');
    }

    const verified = await verifyPassword(user.password, password, user.hashFn);

    // Use with given email found but not password match.
    if (!verified) {
      return R.ofError(ErrorCode.INVALID_CRD, 'Invalid user credentials');
    }

    const token = await generateUserToken(db, user.id);

    return R.of({ ...token, type: 'Bearer' });

  } else if (grantType === 'CLIENT') {

    const app = await findClientApp(db, username);

    // User with given email not found.
    if (!app) {
      return R.ofError(ErrorCode.INVALID_CRD, 'Invalid client credentials');
    }

    const verified = await verifyPassword(app.secret, password, app.hashFn);

    // Use with given email found but not password match.
    if (!verified) {
      return R.ofError(ErrorCode.INVALID_CRD, 'Invalid client credentials');
    }

    const token = await generateClientToken(db, app.id);

    return R.of({ ...token, type: 'Bearer' });
  }

  return R.ofError(ErrorCode.INVALID_AUTH_REQUEST, '');
}


export async function forgotPassword(ctx: Context, username: string): DomainResult<boolean> {

  const { db, access } = ctx;

  if (!access.scopeId) {
    return R.ofError(ErrorCode.INVALID_SCOPE, 'Correct scope is required to reset password');
  }

  const user = await db.user.findUnique({
    where: {
      projectId_email: {
        email: username,
        projectId: access.scopeId
      }
    },
    include: {
      resetRequest: true
    }
  });

  if (!user) {
    return R.of(true);
  }

  if (!user.resetRequest) {
    user.resetRequest = await db.resetPasswordRequest.create({
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
  const { db } = ctx;
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


  const changePasswordT = (await changePassword(db, resetReqeust.userId, newPassword))();

  const deleteRequestT = ctx.db.resetPasswordRequest.delete({
    where: {
      id: resetReqeust.id
    }
  });

  await ctx.db.$transaction([changePasswordT, deleteRequestT]);

  return R.of(true);
}


// TODO: Rename the method name to getAccessForToken or similar.
export async function getAccessForToken(db: Context['db'], tokenId: string, scope?: bigint): DomainResult<Access> {
  if (tokenId.startsWith('u')) {
    return getUserAccess(db, tokenId, scope);
  } else if (tokenId.startsWith('c')) {
    return getClientAppAccess(db, tokenId, scope);
  }

  return invalidToken();
}


async function getUserAccess(db: Context['db'], tokenId: string, scope?: bigint): DomainResult<UserAccess> {

  // TODO: Do not select password related sensitive data
  const token = await findUserToken(db, tokenId);

  if (!isTokenValid(token)) {
    return invalidToken();
  }

  const publication = token.user.project.publication ?? undefined;

  if (scope && scope !== publication?.id) {
    return R.ofError(ErrorCode.FORBIDDEN, 'Trying to access unknown publication');
  }

  const access: UserAccess = {
    type: 'user',
    user: token.user,
    scope: publication
  };

  return R.of(access);
}

async function getClientAppAccess(
  db: Context['db'], tokenId: string, scope?: bigint): DomainResult<ClientAppAccess> {

  const token = await db.clientAppToken.findUnique({
    where: { id: tokenId },
    include: {
      clientApp: true
    }
  });

  if (!isTokenValid(token)) {
    return invalidToken();
  }

  const access: ClientAppAccess = {
    type: 'client',
    scopeId: scope
  };

  if (scope) {
    const publication = await db.publication.findUnique({
      where: { id: scope },
      include: { project: true }
    });

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


function isTokenValid<T extends UserToken | ClientAppToken>(token: null | T): token is T {
  return !!token && (token.generatedAt.getTime() + token.duration) >= Date.now();
}

function invalidToken() {
  return R.ofError(ErrorCode.INVALID_TOKEN, 'Invalid authentication token');
}
