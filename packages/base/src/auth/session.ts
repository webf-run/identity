import type {
  Access,
  AuthToken,
  PublicAccess,
} from '@webf/auth/context';
import { findAccess } from '@webf/auth/context';
import type { DbClient } from '@webf/auth/db';
import type { Nil } from '@webf/auth/result';
import type { Context } from 'hono';
import { getCookie, setCookie } from 'hono/cookie';
import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';

import type { HonoAuthContext } from './type.js';


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

export function getSessionInfo(c: HonoAuthContext) {
  const session = c.var.session;

  if (session.type === 'user') {
    c.status(200);
    return c.json(session.user);
  } else {
    c.status(404);
    return c.json({});
  }
}

export function session(options: SessionOptions) {
  const { db } = options;

  return createMiddleware(async function sessionM(c, next) {
    const authHeader = c.req.header('Authorization');
    const sessionCookie = getCookie(c, SESSION_COOKIE);

    let access: Nil<Access> = null;

    if (authHeader) {
      const [type, token] = authHeader.split(' ');
      access = await findAccess(db, token, type);
    } else if (sessionCookie) {
      access = await findAccess(db, sessionCookie, 'Bearer');
    } else {
      access = publicAccess();
    }

    // TODO: Better error handling here.
    if (!access) {
      throw unauthorized();
    }

    c.set('access', access);

    // Continue to next middleware/handler.
    await next();
  });
}

function publicAccess(): PublicAccess {
  return { type: 'public' };
}


function unauthorized() {
  return new HTTPException(401, {
    res: new Response('Unauthorized', {
      status: 401,
    }),
  });
}
