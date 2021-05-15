import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import { Either, EitherTag, Right } from '../util/Either';
import { AppError, ErrorCode } from './AppError';

function of<T>(value: T) {
  return Either.left(value);
}

function off<T, R>(callback: (value: T) => R) {
  return (value: T) => Either.left(callback(value));

}

function ofError(code: ErrorCode, message: string): Right<AppError> {
  return Either.right({ errors: [{ code, message }] });
}

async function map<T, R>(callback: (value: T) => R, value: DomainResult<T>): DomainResult<R> {
  const du = await value;

  if (du.tag === EitherTag.Ok) {
    return Either.left(callback(du.value));
  } else {
    return Either.right(du.error);
  }
}

async function unpack<T>(value: DomainResult<T>) {
  const du = await value;

  if (du.tag === EitherTag.Ok) {
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


export const R = { of, ofError, off, liftDbError, map, unpack };
