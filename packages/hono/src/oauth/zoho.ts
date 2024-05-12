import { OAuth2Client, OAuth2Options } from '@webf/auth/util/OAuth2Client';

export const ZOHO = 'zoho' as const;

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
