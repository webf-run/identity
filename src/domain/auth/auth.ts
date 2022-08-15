import argon2 from 'argon2';
import cryptoRandomString from 'crypto-random-string';

import { generateClientToken, generateUserToken } from '../../data/code';

import { Access, ClientAppAccess, UserAccess, UserInfo } from '../Access';
import { ErrorCode } from '../AppError';
import { Context } from '../Context';
import { GrantType, Credentials } from '../Input';
import { AuthToken, ClientAppToken, UserToken } from '../Output';
import { R } from '../R';
import { findClientApp } from '../infra/setup';

import { changePassword, findUserByEmail, findUserToken } from './userHelper';
import { ONE_HOUR_MS } from '../../data/invitation';
import { v4 } from 'uuid';


export async function authenticate(ctx: Context, grantType: GrantType, input: Credentials): DomainResult<AuthToken> {

  const { db } = ctx;
  const { id, secret } = input;

  if (grantType === 'USER') {

    const user = await findUserByEmail(db, id);

    // User with given email not found.
    if (!user) {
      return R.ofError(ErrorCode.INVALID_CRD, 'Invalid user credentials');
    }

    const verified = await verifyPassword(user.password, secret, user.hashFn);

    // User with given email found but not password match.
    if (!verified) {
      return R.ofError(ErrorCode.INVALID_CRD, 'Invalid user credentials');
    }

    const tokenId = generateUserToken();

    const addedToken = await db.token.createUserToken({
      id: tokenId,
      duration: 3600 * 1000 * 72,
      userId: user.id,
      generatedAt: new Date()
    });

    const token = addedToken[0];

    return R.of({ ...token, type: 'bearer' as const });

  } else if (grantType === 'CLIENT') {

    const app = await findClientApp(db, id);

    // App with given id not found.
    if (!app) {
      return R.ofError(ErrorCode.INVALID_CRD, 'Invalid client credentials');
    }

    const verified = await verifyPassword(app.secret, secret, app.hashFn);

    // Use with given email found but not password match.
    if (!verified) {
      return R.ofError(ErrorCode.INVALID_CRD, 'Invalid client credentials');
    }

    const tokenId = generateClientToken();

    const addedToken = await db.token.createClientAppToken({
      id: tokenId,
      clientAppId: app.id,
      duration: ONE_HOUR_MS,
      generatedAt: new Date()
    });

    const token = addedToken[0];

    return R.of({ ...token, type: 'bearer' as const });
  }

  return R.ofError(ErrorCode.INVALID_AUTH_REQUEST, '');
}


export async function forgotPassword(ctx: Context, username: string): DomainResult<boolean> {

  const { db } = ctx;

  const results = await db.token.findResetPasswordRequestByEmail({
    email: username
  });

  const userFound = results.at(0);

  // If not user is found, then return true.
  if (!userFound) {
    return R.of(true);
  }

  if (userFound.count === 0) {
    await db.token.createResetPasswordRequest({
      id: v4(),
      code: cryptoRandomString({ length: 96, type: 'url-safe' }),
      userId: userFound.userId,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  // TODO: Send the email again

  return R.of(true);
}


export async function resetPassword(ctx: Context, code: string, newPassword: string): DomainResult<boolean> {

  const { db } = ctx;

  // Token is valid for 30 minutes only
  const validTime = new Date(Date.now() - 30 * 60000);

  const results = await db.token.findResetPasswordRequestByCode({
    code,
    validTime
  });

  const resetRequest = results.at(0);

  if (!resetRequest) {
    return R.ofError(ErrorCode.INVALID_AUTH_REQUEST, '');
  }

  try {

    await db.transaction(async (db) => {
      // User Repository
      await changePassword(db, resetRequest.userId, newPassword);

      // Token Repository
      await db.token.deleteResetPasswordRequest({
        id: resetRequest.id
      });
    });
  } catch (err) {
    // Transaction has failed.

  }
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
  const user = await findUserToken(db, tokenId);

  if (!user || !isTokenValid(user.token)) {
    return invalidToken();
  }

  const maybeRole = scope && user.roles.find((r) => r.publication.id === scope);

  if (!maybeRole) {
    return R.ofError(ErrorCode.FORBIDDEN, 'Trying to access unknown publication');
  }

  const userInfo: UserInfo = {
    ...user,
    role: maybeRole.roleId
  };

  const access: UserAccess = {
    type: 'user',
    user: userInfo,
    scope: maybeRole.publication
  };

  return R.of(access);
}

async function getClientAppAccess(
  db: Context['db'], tokenId: string, scope?: bigint): DomainResult<ClientAppAccess> {

  const tokensWithClients = await db.token.findClientAppByToken({ tokenId });
  const tokenWithClient = tokensWithClients.at(0);

  if (!tokenWithClient) {
    return invalidToken();
  }

  const token: ClientAppToken = {
    id: tokenId,
    clientAppId: tokenWithClient.id,
    duration: tokenWithClient.duration,
    generatedAt: tokenWithClient.generatedAt
  };

  if (!isTokenValid(token)) {
    return invalidToken();
  }

  const access: ClientAppAccess = {
    type: 'client',
    scopeId: scope
  };

  if (scope) {
    const publications = await db.publication.getById({ id: scope.toString() });
    const publication = publications.at(0);

    if (!publication) {
      return R.ofError(ErrorCode.FORBIDDEN, 'Trying to access unknown publication');
    }

    access.scope = {
      ...publication,
      id: BigInt(publication.id)
    };
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
