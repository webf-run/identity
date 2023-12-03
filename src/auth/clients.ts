import { Client } from 'oauth4webapi';
import { OAuth2Client } from './oauth2';

export type OAuth2Configuration = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope: string[];
};

export async function makeGoogleClient(config: OAuth2Configuration): Promise<OAuth2Client> {
  const client: Client = {
    client_id: config.clientId,
    client_secret: config.clientSecret,
    token_endpoint_auth_method: 'client_secret_basic',
  };

  return OAuth2Client.make('https://accounts.google.com', config.redirectUri, client);
}
