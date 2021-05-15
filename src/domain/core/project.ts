import { Prisma } from '@prisma/client';

import { Context } from '../../context';
import { ErrorCode } from '../AppError';
import { R } from '../R';
import { hashPassword } from './auth';
import { Publication, NewPublication } from './type';


export async function createNewPublication(ctx: Context, publication: NewPublication): DomainResult<Publication> {

  const user = publication.firstUser;

  const request: Prisma.ProjectCreateInput = {
    name: publication.name,
    fromEmail: publication.fromEmail,
    publication: {
      create: {
        publicUrl: publication.publicUrl
      }
    }
  };

  if (user) {
    const [password, hashAlgo] = await (user && hashPassword(user.password));

    request.users = {
      create: {
        ...user,
        password,
        passwordHash: hashAlgo
      }
    }
  }

  return ctx.db.project.create({
    data: request,
    include: {
      publication: true
    }
  })
  .then(R.off((x) => ({
    id: x.id.toString(),
    name: x.name,
    publicUrl: x.publication!.publicUrl,
    fromEmail: x.fromEmail
  })))
  .catch(R.liftDbError('P2002', ErrorCode.UNIQUE_URL, 'Publication URL is already taken'));
}
