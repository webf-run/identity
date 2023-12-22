import { findUserBySocialId } from '../data/user.js';
import type { OAuth2Client, State } from '../oauth/client.js';
import type { HonoAuthMiddleware, LoginNRegisterProps, OAuthCallbacks } from './type.js';


export async function addOpenIDStrategy(app: HonoAuthMiddleware, client: OAuth2Client, callbacks: OAuthCallbacks): Promise<OAuth2Client> {

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
    const state: State = JSON.parse(atob(query.get('state') || btoa(JSON.stringify({ type: 'login' }))));
    const { db } = c.var.authContext;

    // Find the user
    const user = await findUserBySocialId(db, client.provider, userProfile.subjectId);

    if (state.type === 'login') {
      return loginUser({ c, user, profile: userProfile, callbacks });
    } else if (state.type === 'signup' && hasSignup) {
      return signUpUser({ c, user, profile: userProfile, callbacks });
    } else {
      // Return to generic error page
      return c.redirect(callbacks.errorUrl, 307);
    }
  });

  return client;
}


async function loginUser(props: LoginNRegisterProps): Promise<Response> {
  const { c, user, profile, callbacks } = props;
  let redirectURL = '/';

  if (user) {
    // TODO: Set-session cookie
    redirectURL = await callbacks.onLogin(user, profile);
  } else {
    redirectURL = await callbacks.onLoginNoUser(profile);
  }

  return c.redirect(redirectURL, 307);
}

async function signUpUser(props: LoginNRegisterProps): Promise<Response> {
  const { c, user, profile, callbacks } = props;

  // User already exists.
  if (user) {
    return c.redirect('/', 307);
  }

  await callbacks.onSignup!(profile);

  return c.redirect('/', 307);

}
