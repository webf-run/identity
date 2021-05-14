import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import { Either, ResultTag, Right } from '../util/Either';
import { AppError, ErrorCode } from './AppError';


function map<T, R>(callback: (value: T) => R) {
  return (value: T) => Either.left(callback(value));
}

function ofError(code: ErrorCode, message: string): Right<AppError> {
  return Either.right({ errors: [{ code, message }] });
}

async function unpack<T>(value: DomainResult<T>) {
  const du = await value;

  if (du.tag === ResultTag.Ok) {
    return du.value;
  } else {
    return du.error;
  }
}

function liftDbError(code: string, domainCode: ErrorCode, message: string) {
  return (err: any) => {
    if (err instanceof PrismaClientKnownRequestError && err.code === code) {
      return ofError(domainCode, message);
    }

    throw err;
  };
}

export const R = { of: Either.left, ofError, map, liftDbError, unpack };
