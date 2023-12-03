import * as oauth from 'oauth4webapi';
import type { AuthorizationServer, Client } from 'oauth4webapi';

export class OAuth2Client {
  as: AuthorizationServer;
  redirectUri: string;
  client: Client;
  codeVerifier: string;

  private constructor(as: AuthorizationServer, redirectUri: string, client: Client) {
    this.as = as;
    this.redirectUri = redirectUri;
    this.client = client;
    this.codeVerifier = oauth.generateRandomCodeVerifier();
  }

  static async make(asURL: string, redirectUri: string, client: Client): Promise<OAuth2Client> {
    const issuer = new URL(asURL);

    const discovery = await oauth.discoveryRequest(issuer, { algorithm: 'oauth2' });
    const as = await oauth.processDiscoveryResponse(issuer, discovery);

    if (as.code_challenge_methods_supported?.includes('S256') !== true) {
      // This example assumes S256 PKCE support is signalled
      // If it isn't supported, random `state` must be used for CSRF protection.
      throw new Error('S256 PKCE is not supported');
    }

    return new OAuth2Client(as, redirectUri, client);
  }

  async makeLoginUrl(): Promise<URL> {
    const codeChallenge = await oauth.calculatePKCECodeChallenge(this.codeVerifier);
    const codeChallengeMethod = 'S256';

    const authorizationUrl = new URL(this.as!.authorization_endpoint!);
    const searchParams = authorizationUrl.searchParams;

    searchParams.set('client_id', this.client.client_id);
    searchParams.set('code_challenge', codeChallenge);
    searchParams.set('code_challenge_method', codeChallengeMethod);
    searchParams.set('redirect_uri', this.redirectUri);
    searchParams.set('response_type', 'code');
    searchParams.set('scope', 'api:read');

    return authorizationUrl;
  }

  async exchangeAuthorizationCode(searchParams: URLSearchParams) {
    const parameters = oauth.validateAuthResponse(
      this.as,
      this.client,
      searchParams,
      oauth.expectNoState
    );

    if (oauth.isOAuth2Error(parameters)) {
      console.log('error', parameters);

      throw new Error('OAuth 2.0 redirect error');
    }

    const response = await oauth.authorizationCodeGrantRequest(
      this.as,
      this.client,
      parameters,
      this.redirectUri,
      this.codeVerifier,
    );

    const result = await oauth.processAuthorizationCodeOAuth2Response(
      this.as,
      this.client,
      response
    );

    if (oauth.isOAuth2Error(result)) {
      console.log('error', result);
      throw new Error();
    }

    console.log('result', result)
  }
}
