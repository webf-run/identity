import { Prisma } from '@prisma/client';

import { generateInviteCode, hashPassword } from '../../data/code';
import { findUserByEmail } from '../../data/user';
import { ErrorCode } from '../AppError';
import { Context } from '../Context';
import { PublicationInput } from '../Input';
import { Publication } from '../Output';
import { R } from '../R';


export async function createNewPublication(ctx: Context, input: PublicationInput): DomainResult<Publication> {

  const { db } = ctx;

  const { firstUser, quota } = input;

  // TODO: Input validation and authorization

  const request: Prisma.PublicationCreateInput = {
    publicUrl: input.publicUrl,
    project: {
      create: {
        name: input.name,
        fromEmail: input.fromEmail,
        quota: {
          create: {
            occupied: 1,
            sizeInBytes: quota.assetSize,
            staffCapacity: quota.staffCapacity
          }
        }
      }
    }
  };

  // Decide if we should invite user or generate a user?
  // If the user exists, invite the user.
  // If password is provided, create a user.
  // Otherwise, invite as a new user.

  const existingUser = await findUserByEmail(db, firstUser.email);

  const { firstName, lastName, email } = firstUser;


  if (existingUser) {
    // Invite the existing user
    const code = generateInviteCode();

    request.project.create!.invitations = {
      create: { firstName, lastName, code, email }
    };

  } else if (firstUser.password) {
    // Create a new user
    const [password, passwordHashFn] = await hashPassword(firstUser.password);

    request.staff = {
      create: {
        user: {
          create: { firstName, lastName, email, password, passwordHashFn }
        }
      }
    };
  } else {
    // Invite the new user
    const code = generateInviteCode();

    request.project.create!.invitations = {
      create: { firstName, lastName, code, email }
    };
  }


  return db.publication.create({
    data: request,
    include: {
      project: true
    }
  })
  .then((x) => R.of(x))
  .catch(R.liftDbError('P2002', ErrorCode.UNIQUE_URL, 'Publication URL is already taken'));
}
