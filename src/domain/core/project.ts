import * as c from '../../data/newPublication';
import { findUserByEmail } from '../../data/user';
import { ErrorCode } from '../AppError';
import { Context } from '../Context';
import { PublicationInput } from '../Input';
import { Publication } from '../Output';
import { R } from '../R';


export async function createNewPublication(ctx: Context, input: PublicationInput): DomainResult<Publication> {

  const { db } = ctx;

  const { firstUser } = input;

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

    } else if (firstUser.password) {
      // Create a new user
      const publication = await c.createWithCredentials(db, input, firstUser.password);

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
