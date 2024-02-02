import { z } from 'zod';

import { User } from '../../contract/DbType';
import type { AuthContext, AuthToken, OAuthProfile, OAuthState } from '../../contract/Type';
import { createSocialLogin } from '../../dal/loginDAL';
import { findUserBySocialId } from '../../dal/userDAL';
import { claimWithSocial } from '../tenant/claim';
import { createBearerToken } from './user';


const union = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('login'),
    redirectUrl: z.string().optional(),
  }),
  z.object({
    type: z.literal('signup'),
    redirectUrl: z.string().optional(),
    inviteCode: z.string().optional(),
  }),
  z.object({
    type: z.literal('link'),
    redirectUrl: z.string().optional(),
  }),
]);

export type ProcessorOptions = {
  provider: string;
  hasSignup: boolean;

  context: AuthContext;
  profile: OAuthProfile;
  state: OAuthState;
  user?: User;
};

export type AuthorizationEvent = {
  token?: AuthToken;
  user?: User;
};

export async function processOAuthAuthorization(options: ProcessorOptions): Promise<AuthorizationEvent> {
  const { context, provider, profile, state, user } = options;
  const { subjectId } = profile;
  const { db } = context;

  if (state.type === 'login') {
    const user = await findUserBySocialId(db, options.provider, subjectId);

    if (user) {
      const token = await createBearerToken(context, user.id);

      return {
        token,
        user,
      };
    }
  } else if (state.type === 'signup' && options.hasSignup) {
    const { inviteCode } = state;

    if (inviteCode) {
      const newUser = await claimWithSocial(context, inviteCode, profile);

      if (newUser) {
        const token = await createBearerToken(context, newUser.id);

        return {
          token,
          user: newUser,
        };
      }
    }
  } else if (state.type === 'link' && user) {
    await createSocialLogin(db, user.id, provider, subjectId);

    return {
      user,
    };
  }

  return {};
}
