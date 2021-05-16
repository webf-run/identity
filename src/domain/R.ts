import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import { Either, EitherTag, Left } from '../util/Either';
import { AppError, ErrorCode } from './AppError';


function of<T>(value: T) {
  return Either.right(value);
}

function off<T, R>(callback: (value: T) => R) {
  return (value: T) => Either.right(callback(value));
}

function ofError(code: ErrorCode, message: string): Left<AppError> {
  return Either.left({ errors: [{ code, message }] });
}

async function map<T, R>(callback: (value: T) => R, value: DomainResult<T>): DomainResult<R> {
  const du = await value;

  return Either.map(callback)(du);
}

async function unpack<T>(value: DomainResult<T>) {
  const du = await value;

  if (du.tag === EitherTag.Ok) {
    return du.value;
  } else {
    return du.value;
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
