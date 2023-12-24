import { Context } from 'hono';
import { getCookie, setCookie } from 'hono/cookie';
import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception'

import { findApiKeyByToken } from '../core/apiKey.js';
import { AuthToken } from '../core/type.js';
import { findUserByToken } from '../data/user.js';
import { ApiKey, UserWithMembership } from '../db/model.js';
import type { DbClient } from '../type.js';
import type { ClientAppAccess, PublicAccess, UserAccess } from './type.js';

export const SESSION_COOKIE = 'webf_session';

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

      if (type === 'Bearer') {
       await handleBearerToken(c, db, token);
      } else if (type === 'ApiKey') {
        await handleTokenAuth(c, db, token);
      }

      await next();
    } else if (sessionCookie) {

    } else {
      c.set('session', publicAccess())
      await next();
    }
  });
}

async function handleTokenAuth(c: Context, db: DbClient, token: string) {
  const apiKey = await findApiKeyByToken({ db }, token);

  c.set('session', clientAccess(apiKey));
}

async function handleBearerToken(c: Context, db: DbClient, token: string) {
  const user = await findUserByToken(db, token);

  if (!user) {
    const errorResponse = new Response('Unauthorized', {
      status: 401,
    });

    throw new HTTPException(401, { res: errorResponse })
  }

  c.set('session', userAccess(user));
}

function userAccess(user: UserWithMembership): UserAccess {
  return { type: 'user', user };
}

function publicAccess(): PublicAccess {
  return { type: 'public' };
}

function clientAccess(key: ApiKey): ClientAppAccess {
  return { type: 'client', key };
}
