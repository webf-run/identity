import type { IncomingHttpHeaders } from 'http';

import type { PrismaClient } from '@prisma/client';
import { ApolloError, AuthenticationError, ExpressContext, ForbiddenError } from 'apollo-server-express';

import { ErrorCode } from '../domain/AppError';
import { Context, makeContext } from '../domain/Context';
import { Either } from '../util/Either';


const BEARER_REGEX = /^(Bearer)(\s)(.+)$/;
const SCOPE_HEADER = 'x-bisa-scope';


export async function makeContextFromWeb(db: PrismaClient, webContext: ExpressContext): Promise<Context> {

  const headers = webContext.req.headers;
  const rawScope = headers[SCOPE_HEADER];
  const tokenId = parseAuthHeader(headers);
  const scope = rawScope instanceof Array ? rawScope[0] : rawScope;


  const result = await makeContext(db, tokenId, scope);

  if (Either.isLeft(result)) {
    const errors = result.value.errors;

    if (errors.some((x) => x.code === ErrorCode.FORBIDDEN)) {
      throw new ForbiddenError(result.value.errors[0].message);
    }

    if (errors.some((x) => x.code === ErrorCode.INVALID_TOKEN)) {
      throw new AuthenticationError('Invalid authentication token');
    }

    throw new ApolloError('Internal error');
  }

  return result.value;
}


function parseAuthHeader(headers: IncomingHttpHeaders) {
  const authHeader = headers.authorization;

  if (authHeader === undefined) {
    return authHeader;
  }

  const [_, __, ___, tokenId] = BEARER_REGEX.exec(authHeader) || [];

  if (!tokenId) {
    throw new AuthenticationError('Invalid authentication token');
  }

  return tokenId;
}
