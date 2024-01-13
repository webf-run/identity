import { createBearerToken } from '../../context/user/create.js';
import { findUserBySocialId } from '../../dal/userDAL.js';
import type { OAuth2Client, OAuthState } from '../oauth/client.js';
import { setSession } from './session.js';
import type { HonoAuthApp, LoginNRegisterProps, OAuthCallbacks } from './type.js';


export async function addOpenIDStrategy(app: HonoAuthApp, client: OAuth2Client, callbacks: OAuthCallbacks): Promise<OAuth2Client> {
  // If onSignup is provided, means application is allowing new users to sign up.
  const hasSignup = !!callbacks.onSignup;

  app.get(`/openid/${client.provider}`, async (c) => {
    const loginUrl = await client.makeAuthorizationUrl('login');

    return c.redirect(loginUrl.toString(), 307);
  });

  if (hasSignup) {
    app.get(`/openid/${client.provider}/signup`, async (c) => {
      const loginUrl = await client.makeAuthorizationUrl('signup');

      return c.redirect(loginUrl.toString(), 307);
    });
  }

  app.get(`/openid/${client.provider}/callback`, async (c) => {
    const query = new URLSearchParams(c.req.query());
    const userProfile = await client.exchangeAuthorizationCode(query);

    // TODO: Check if the state is valid and payload parsing.
    const state: OAuthState = JSON.parse(atob(query.get('state') || btoa(JSON.stringify({ type: 'login' }))));
    const { db } = c.var.authContext;

    // Find the user
    const user = await findUserBySocialId(db, client.provider, userProfile.subjectId);
    const loginProps = { c, db, user, profile: userProfile, callbacks, state };

    if (state.type === 'login') {
      return loginUser(loginProps);
    } else if (state.type === 'signup' && hasSignup) {
      return signUpUser(loginProps);
    } else {
      // Return to generic error page
      return c.redirect(callbacks.errorUrl, 307);
    }
  });

  return client;
}


async function loginUser(props: LoginNRegisterProps): Promise<Response> {
  const { c, db, user, profile, callbacks } = props;
  let redirectURL = '/';

  if (user) {
    const token = await createBearerToken({ db }, user.id);
    const _ = await setSession(c, token);
    redirectURL = await callbacks.onLogin(user, profile);
  } else {
    redirectURL = await callbacks.onLoginNoUser(profile);
  }

  return c.redirect(redirectURL, 307);
}

async function signUpUser(props: LoginNRegisterProps): Promise<Response> {
  const { c, user, profile, callbacks, state } = props;

  // User already exists.
  if (user) {
    return c.redirect('/', 307);
  }

  await callbacks.onSignup!(profile, state);

  return c.redirect('/', 307);
}
