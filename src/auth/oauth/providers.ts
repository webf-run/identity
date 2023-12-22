import { OAuth2Client, OAuth2Options } from './client';

export async function makeGoogleClient(options: OAuth2Options): Promise<OAuth2Client> {
  // https://developers.google.com/identity/openid-connect/openid-connect#discovery
  const discoveryEndpoint = 'https://accounts.google.com';
  const scope = ['openid', 'email', 'profile', options.scope ?? ''].join(' ').trim();

  return OAuth2Client.make(discoveryEndpoint, {
    ...options,
    scope,
  });
}

export async function makeZohoClient(options: OAuth2Options): Promise<OAuth2Client> {
  // https://www.zoho.com/accounts/protocol/oauth/sign-in-using-zoho.html
  const discoveryEndpoint = 'https://accounts.zoho.com';
  const scope = ['openid', 'email', 'profile', options.scope ?? ''].join(' ').trim();

  return OAuth2Client.make(discoveryEndpoint, {
    ...options,
    scope,
  });
}
