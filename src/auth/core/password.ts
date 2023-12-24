import { err, ok } from '../../result.js';
import { verifyPassword } from '../data/code.js';
import {
  changePassword,
  findLoginByEmail,
  findLoginByUsername
} from '../data/user.js';
import {
  createResetPasswordRequest,
  deleteResetPasswordRequest,
  findResetPasswordRequestByCode,
  findResetPasswordRequestByEmail
} from '../data/reset.js';
import type { AuthContext, AuthToken, Credentials } from './type.js';
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

  const verified = await verifyPassword(login.password, password, login.hashFn);

  // User with given email found but not password match.
  if (!verified) {
    return err('INVALID_CREDENTIALS', 'Invalid user credentials');
  }

  // Generate a token for the user.
  const token = await createBearerToken(db, login.userId);

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


export async function resetPassword(ctx: AuthContext, code: string, newPassword: string) {
  const { db } = ctx;

  // Token is valid for 30 minutes only
  const validTime = new Date(Date.now() - 30 * 60000);

  const resetRequest = await findResetPasswordRequestByCode(db, code, validTime);

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
