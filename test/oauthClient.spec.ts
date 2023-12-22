import { it } from 'node:test';
import { equal } from 'node:assert';

import { makeGoogleClient } from '../src/auth/oauth/providers';

it('OAuth2 Client - Google', async (t) => {

  const googleClient = await makeGoogleClient({
    clientId: 'clientId',
    clientSecret: 'clientSecret',
    redirectUri: 'http://localhost:8080/callback',
  });

  await t.test('login url', async (tt) => {
    // SUT - System Under Test
    const url = await googleClient.makeLoginUrl();

    // Verify - Result
    equal(url.origin, 'https://accounts.google.com');
    equal(url.searchParams.get('client_id'), 'clientId');
    equal(url.searchParams.get('code_challenge_method'), 'S256');
    equal(url.searchParams.get('redirect_uri'), 'http://localhost:8080/callback');
    equal(url.searchParams.get('response_type'), 'code');
    equal(url.searchParams.get('scope'), 'openid email profile');
  });
});
