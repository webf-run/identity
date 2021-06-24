import { generateInviteCode } from '../../data/code';
import { isCheckConstraint, isUniqueConstraint } from '../../data/error';
import * as c from '../../data/newPublication';
import { findUserByEmail, isUserMemberOf } from '../../data/user';
import { findUniqueScope, isUser } from '../Access';
import { ErrorCode } from '../AppError';
import { Context } from '../Context';
import { NewPublicationInput, UserInput } from '../Input';
import { Result, Publication } from '../Output';
import { R } from '../R';


export async function createNewPublication(ctx: Context, input: NewPublicationInput): DomainResult<Publication> {

  const { db } = ctx;

  const { firstUser, password } = input;

  // TODO: Input validation and authorization

  // Decide if we should invite user or generate a user?
  // If the user exists, invite the user.
  // If password is provided, create a user.
  // Otherwise, invite as a new user.

  const existingUser = await findUserByEmail(db, firstUser.email);


  try {
    if (existingUser) {
      // Invite the existing user
      const [publication, code] = await c.createWithExistingUser(db, input, existingUser);

      return R.of(publication);

    } else if (password) {
      // Create a new user
      const publication = await c.createWithCredentials(db, input, password);

      return R.of(publication);
    } else {
      // Invite the new user
      const [publication, code] = await c.createWithInvitation(db, input);

      return R.of(publication);
    }

  } catch (e) {
    return R.liftDbError('P2002', ErrorCode.UNIQUE_URL, 'Publication URL is already taken')(e);
  }
}


export async function addMemberToPublication(ctx: Context, user: UserInput): DomainResult<Result> {

  const { db, access } = ctx;

  if (!isUser(access)) {
    return R.ofError(ErrorCode.FORBIDDEN, 'Forbidden');
  }

  // Access control
  const publication = findUniqueScope(access);

  if (!publication) {
    return R.ofError(ErrorCode.INVALID_SCOPE, 'Correct scope is required to add a member');
  }

  // TODO: Validation pending

  const quota = await db.quota.findFirst({
    where: {
      id: publication.id
    }
  });

  if (!quota) {
    return R.ofError(ErrorCode.NOT_FOUND, 'Quota information not found');
  }

  if (quota.occupied >= quota.staffCapacity) {
    return quotaFull();
  }

  const isMemberAlready = await isUserMemberOf(db, publication.id, user.email);

  if (isMemberAlready) {
    return R.ofError(ErrorCode.ALREADY_EXISTS, 'User already member of the publication');
  }

  const code = generateInviteCode();

  try {
    // Attempt to generate an invitation
    const _quota = await db.quota.update({
      where: { id: publication.id },
      data: {
        occupied: { increment: 1 },
        project: {
          update: {
            invitations: {
              create: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                code
              }
            }
          }
        }
      }
    });

  } catch (e) {

    if (isCheckConstraint(e, 'max_capacity', 'quota')) {
      return quotaFull();
    }

    if (isUniqueConstraint(e, 'email', 'project_id')) {
      return quotaFull();
    }

    throw e;
  }

  return R.of({ status: true });
}

function quotaFull() {
  return R.ofError(ErrorCode.QUOTA_FULL, 'Staff capacity if full. New staff cannot be added.');
}
