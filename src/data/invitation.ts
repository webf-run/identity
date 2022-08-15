import { v4 } from 'uuid';

import { UserInput } from '../domain/Input';
import { generateInviteCode } from './code';
import { PublicationRole } from './constant';

export const ONE_MINUTE_MS = 60 * 1000;
export const ONE_HOUR_MS = 60 * ONE_MINUTE_MS;
export const ONE_DAY_MS = 24 * ONE_HOUR_MS;


export function buildUserInvite(newUser: UserInput, roleId: PublicationRole) {

  const duration = 4 * ONE_DAY_MS;

  // User invitation is valid for 4 days
  return {
    invitationId: v4(),
    uniqueCode: generateInviteCode(),
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    email: newUser.email,
    duration,
    roleId,
    expiryAt: new Date(Date.now() + duration)
  };
}
