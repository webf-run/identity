import { isUser, processOAuthAuthorization, OAuthState } from '@webf/auth/context';

import type { OAuth2Client } from '../oauth/client.js';
import { setSession } from './session.js';
import type { HonoAuthApp, OAuthCallbacks } from './type.js';


export async function addOpenIDStrategy(app: HonoAuthApp, client: OAuth2Client, callbacks: OAuthCallbacks): Promise<OAuth2Client> {
  app.get(`/openid/${client.provider}`, async (c) => {
    const loginUrl = await client.makeAuthorizationUrl('login');

    return c.redirect(loginUrl.toString(), 307);
  });

  app.get(`/openid/${client.provider}/link`, async (c) => {
    const loginUrl = await client.makeAuthorizationUrl('signup');

    return c.redirect(loginUrl.toString(), 307);
  });

  app.get(`/openid/${client.provider}/signup`, async (c) => {
    const loginUrl = await client.makeAuthorizationUrl('signup');

    return c.redirect(loginUrl.toString(), 307);
  });

  app.get(`/openid/${client.provider}/callback`, async (c) => {
    const query = new URLSearchParams(c.req.query());
    const userProfile = await client.exchangeAuthorizationCode(query);

    // TODO: Check if the state is valid and payload parsing.
    const state: OAuthState = JSON.parse(atob(query.get('state') || btoa(JSON.stringify({ type: 'login' }))));
    const context = c.var.authContext;

    const response = await processOAuthAuthorization({
      context,
      profile: userProfile,
      state,
      provider: client.provider,
      hasSignup: true,
      user: isUser(c.var.session)
        ? c.var.session.user
        : undefined,
    });

    let redirect = '/';

    if (response.token && response.user) {
      // Login/relogin the user.
      const _ = await setSession(c, response.token);
      redirect = await callbacks.onLogin(response.user, userProfile);
    } else if (response.user) {
      // User exists means it is a link request.
      redirect = await callbacks.onLogin(response.user, userProfile);
    } else {
      // TODO: Error handling.
      redirect = await callbacks.onError(response);
    }

    return c.redirect(redirect, 307);
  });

  return client;
}
