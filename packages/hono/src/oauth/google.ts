import { type OAuth2Options, OAuth2Client } from '@webf/auth/util/OAuth2Client';

export const GOOGLE= 'google' as const;

export async function google(options: OAuth2Options): Promise<OAuth2Client> {
  // https://developers.google.com/identity/openid-connect/openid-connect#discovery
  // https://accounts.google.com/.well-known/openid-configuration
  const discoveryEndpoint = 'https://accounts.google.com';
  const scope = ['openid', 'email', 'profile', options.scope ?? ''].join(' ').trim();

  return OAuth2Client.make(discoveryEndpoint, {
    ...options,
    provider: GOOGLE,
    scope,
  });
}
