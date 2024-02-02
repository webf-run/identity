import type { Context } from 'hono';
import { getCookie, setCookie } from 'hono/cookie';
import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';

import type {
  Access,
  AuthToken,
  ClientAppAccess,
  PublicAccess,
  UserAccess,
  UserWithMembership
} from '@webf/auth/context';
import { findApiKeyByToken } from '@webf/auth/context';
import { findUserByToken } from '@webf/auth/dal';
import type { DbClient } from '@webf/auth/db';

export const SESSION_COOKIE = 'webf_session';

declare module 'hono' {
  interface ContextVariableMap {
    session: Access;
  }
}

export type SessionOptions = {
  db: DbClient;
};

export async function setSession(c: Context, token: AuthToken) {
  setCookie(c, SESSION_COOKIE, token.id, {
    httpOnly: true,
    sameSite: 'Lax',
  });
}

export function session(options: SessionOptions) {
  const { db } = options;

  return createMiddleware(async function sessionM(c, next) {
    const authHeader = c.req.header('Authorization');
    const sessionCookie = getCookie(c, SESSION_COOKIE);

    if (authHeader) {
      const [type, token] = authHeader.split(' ');

      if (type.toLowerCase() === 'Bearer'.toLowerCase()) {
        await handleBearerToken(c, db, token);
      } else if (type === 'ApiKey') {
        await handleTokenAuth(c, db, token);
      } else {
        throw unauthorized();
      }
    } else if (sessionCookie) {
      await handleBearerToken(c, db, sessionCookie);
    } else {
      c.set('session', publicAccess());
    }

    // Continue to next middleware/handler.
    await next();
  });
}

async function handleTokenAuth(c: Context, db: DbClient, token: string) {
  const apiKey = await findApiKeyByToken({ db }, token);

  c.set('session', clientAccess(apiKey));
}

async function handleBearerToken(c: Context, db: DbClient, token: string) {
  const user = await findUserByToken(db, token);

  if (!user) {
    throw unauthorized();
  }

  c.set('session', userAccess(user));
}

function userAccess(user: UserWithMembership): UserAccess {
  return { type: 'user', user };
}

function publicAccess(): PublicAccess {
  return { type: 'public' };
}

function clientAccess(key: ClientAppAccess['key']): ClientAppAccess {
  return { type: 'client', key };
}

function unauthorized() {
  return new HTTPException(401, {
    res: new Response('Unauthorized', {
      status: 401,
    }),
  });
}
