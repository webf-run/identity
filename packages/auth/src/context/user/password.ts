import type { ResetPasswordRequest } from '../../context.js';
import type { AuthContext, AuthToken, Credentials } from '../../contract/Type.js';
import {
  changePassword,
  findLoginByEmail,
  findLoginByUsername
} from '../../dal/loginDAL.js';
import {
  createResetPasswordRequest,
  deleteResetPasswordRequest,
  findResetPasswordRequestByCode,
  findResetPasswordRequestByEmail
} from '../../dal/resetDAL.js';
import { deleteToken } from '../../dal/userDAL.js';
import { AsyncResult, err, ok, type Nil } from '../../result.js';
import { verify } from '../../util/hash.js';
import { createBearerToken } from './user.js';


export async function authenticate(ctx: AuthContext, input: Credentials): AsyncResult<AuthToken> {
  const { db } = ctx;
  const { password } = input;

  const login = 'email' in input
    ? await findLoginByEmail(db, input.email)
    : await findLoginByUsername(db, input.username);

  // User with given email not found.
  if (!login) {
    return err('INVALID_CREDENTIALS', 'Invalid user credentials');
  }

  const verified = await verify(login.password, password, login.hashFn);

  // User with given email found but no password match.
  if (!verified) {
    return err('INVALID_CREDENTIALS', 'Invalid user credentials');
  }

  // Generate a token for the user.
  const token = await createBearerToken(ctx, login.userId);

  if (token) {
    return ok(token);
  } else {
    return err('INTERNAL_ERROR', 'Internal error');
  }
}


export async function forgotPassword(ctx: AuthContext, username: string): AsyncResult<boolean> {
  const { db } = ctx;

  const userFound = await findResetPasswordRequestByEmail(db, username);

  // If no user is found, then return true.
  if (!userFound) {
    return ok(true);
  }

  if (userFound.count === 0) {
    const created = await createResetPasswordRequest(db, userFound.userId);
  }

  // TODO: Send the email again

  return ok(true);
}


export async function getResetTokenInfo(ctx: AuthContext, token: string): Promise<ResetPasswordRequest> {
  const { db } = ctx;

  // Token is valid for 30 minutes only
  const validTime = new Date(Date.now() - 30 * 60000);

  const resetRequest = await findResetPasswordRequestByCode(db, token, validTime);

  if (!resetRequest) {
    throw 'invalid credentials';
  }

  return resetRequest;
}

export async function resetPassword(ctx: AuthContext, token: string, newPassword: string): AsyncResult<boolean> {
  const { db } = ctx;

  // Token is valid for 30 minutes only
  const validTime = new Date(Date.now() - 30 * 60000);

  const resetRequest = await findResetPasswordRequestByCode(db, token, validTime);

  if (!resetRequest) {
    return err('INVALID_CREDENTIALS', 'Invalid reset request');
  }

  try {
    await db.transaction(async (tx) => {
      await changePassword(tx, resetRequest.userId, newPassword);
      await deleteResetPasswordRequest(tx, resetRequest.id);
    });
  } catch (err) {
    // Transaction has failed.
  }

  return ok(true);
}


export async function invalidateToken(ctx: AuthContext, token: string): Promise<boolean> {
  const { db } = ctx;

  await deleteToken(db, token);

  return true;
}
