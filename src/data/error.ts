

import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from '@prisma/client/runtime';


export function isUniqueConstraint(error: any, ...matches: string[]) {
  if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
    // return ofError(domainCode, message);

    return matches.every((x, i) => (error.meta as any)?.target?.[i] === x);
  }

  return false;
}

export function isCheckConstraint(error: any, constraint: string, table?: string): boolean {
  // Entire message from the DB is very awkward. But it typically has following:
  // new row for relation "<relation-name>" violates check constraint "<constraint-name>"

  if (error instanceof PrismaClientUnknownRequestError) {
    const matches = /relation .(.+). violates check constraint .(.+)./.exec(error.message);

    // 23514 is the code for postgres check violation
    const isCheckViolation = error.message.includes('23514');

    if (isCheckViolation && matches) {
      const [, parsedTable, parsedConstraint] = matches;

      return constraint === parsedConstraint && (!table || table === parsedTable);
    }
  }

  return false;
}
