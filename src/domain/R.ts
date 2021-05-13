import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import { NexusGenObjects } from '../../nexus-typegen';

import { Either, ResultTag, Right } from '../util/Either';


function map<T, R>(callback: (value: T) => R) {
  return (value: T) => Either.ok(callback(value));
}

function ofOne(code: string, message: string): Right<NexusGenObjects['ErrorList']> {
  return Either.error({
    errors: [{ code, message }]
  });
}

async function unpack<T>(value: DomainResult<T>) {
  const du = await value;

  if (du.tag === ResultTag.Ok) {
    return du.value;
  } else {
    return du.error;
  }
}

export const R = { ok: Either.ok, map, ofOne, unpack };

export function matchErr(error: any) {
  if (error instanceof PrismaClientKnownRequestError) {

  }
}
