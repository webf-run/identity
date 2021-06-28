import { generateInviteCode } from '../../data/code';
import { isUniqueConstraint } from '../../data/error';
import { findUserByEmail } from '../../data/user';
import { isAdmin } from '../Access';
import { ErrorCode } from '../AppError';
import { Context } from '../Context';
import { UserInput } from '../Input';
import { Result } from '../Output';
import { R } from '../R';


export async function addNewAdministrator(ctx: Context, admin: UserInput): DomainResult<Result> {

  const { db, access } = ctx;

  if (!isAdmin(access)) {
    return R.ofError(ErrorCode.FORBIDDEN, 'You do not have access to add new administrator');
  }

  // Attempt to add new administrator.
  const existingUser = await findUserByEmail(db, admin.email);

  if (existingUser) {
    return promoteToAdmin(ctx, existingUser.id);
  } else {
    return generateAdminInvite(ctx, admin);
  }
}


async function promoteToAdmin(ctx: Context, userId: bigint) {
  try {
    await ctx.db.admin.create({
      data: {
        superAdmin: false,
        id: userId
      }
    });

    // TODO: Send email

  } catch (error) {
    if (isUniqueConstraint(error, 'id')) {
      return R.ofError(ErrorCode.ALREADY_EXISTS, 'User is already administrator');
    }

    throw error;
  }

  return R.of({ status: true });
}


async function generateAdminInvite(ctx: Context, admin: UserInput) {
  const code = generateInviteCode();

  try {
    const _response = await ctx.db.invitation.create({
      data: {
        code,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName
      }
    });

    // TODO: Send email

  } catch (error) {

    if (isUniqueConstraint(error, 'email')) {
      return R.ofError(ErrorCode.ALREADY_EXISTS, 'The user is already invited');
    }

    throw error;
  }

  return R.of({ status: true });
}
