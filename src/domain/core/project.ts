import { Prisma } from '@prisma/client';

import { ErrorCode } from '../AppError';
import { Context } from '../Context';
import { PublicationInput } from '../Input';
import { Publication } from '../Output';
import { R } from '../R';
import { hashPassword } from './auth';


export async function createNewPublication(ctx: Context, input: PublicationInput): DomainResult<Publication> {

  const { db } = ctx;

  const user = input.firstUser;

  const request: Prisma.PublicationCreateInput = {
    publicUrl: input.publicUrl,
    project: {
      create: {
        name: input.name,
        fromEmail: input.fromEmail,
      }
    }
  };


  if (user) {
    const [password, hashAlgo] = await (user && hashPassword(user.password));

    request.staff = {
      create: {
        user: {
          create: {
            ...user,
            password,
            passwordHash: hashAlgo
          }
        }
      }
    };
  }


  return db.publication.create({
    data: request,
    include: {
      project: true
    }
  }).then((x) => R.of(x))
  .catch(R.liftDbError('P2002', ErrorCode.UNIQUE_URL, 'Publication URL is already taken'));
}
