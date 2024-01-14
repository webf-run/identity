import { OAuth2Client, OAuth2Options } from './client';

export const GOOGLE= 'google' as const;
export const ZOHO= 'zoho' as const;

export type Provider = 'google' | 'zoho';

export async function google(options: OAuth2Options): Promise<OAuth2Client> {
  // https://developers.google.com/identity/openid-connect/openid-connect#discovery
  const discoveryEndpoint = 'https://accounts.google.com';
  const scope = ['openid', 'email', 'profile', options.scope ?? ''].join(' ').trim();

  return OAuth2Client.make(discoveryEndpoint, {
    ...options,
    provider: GOOGLE,
    scope,
  });
}

export async function zoho(options: OAuth2Options): Promise<OAuth2Client> {
  // https://www.zoho.com/accounts/protocol/oauth/sign-in-using-zoho.html
  const discoveryEndpoint = 'https://accounts.zoho.com';
  const scope = ['openid', 'email', 'profile', options.scope ?? ''].join(' ').trim();

  return OAuth2Client.make(discoveryEndpoint, {
    ...options,
    provider: ZOHO,
    scope,
  });
}
