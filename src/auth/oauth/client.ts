import * as oauth from 'oauth4webapi';
import type { AuthorizationServer, Client } from 'oauth4webapi';

export type OAuth2Options = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope?: string;
};

export class OAuth2Client {
  private readonly as: AuthorizationServer;
  private readonly redirectUri: string;
  private readonly client: Client;
  private readonly codeVerifier: string;
  private readonly scope?: string;

  private constructor(as: AuthorizationServer, options: OAuth2Options) {
    this.as = as;
    this.redirectUri = options.redirectUri;
    this.client = {
      client_id: options.clientId,
      client_secret: options.clientSecret,
      token_endpoint_auth_method: 'client_secret_basic',
    };
    this.codeVerifier = oauth.generateRandomCodeVerifier();
    this.scope = options.scope;
  }

  static async make(asURL: string, options: OAuth2Options): Promise<OAuth2Client> {
    const issuer = new URL(asURL);

    const discovery = await oauth.discoveryRequest(issuer, { algorithm: 'oidc' });
    const as = await oauth.processDiscoveryResponse(issuer, discovery);

    if (as.code_challenge_methods_supported?.includes('S256') !== true) {
      // This example assumes S256 PKCE support is signalled
      // If it isn't supported, random `state` must be used for CSRF protection.
      throw new Error('S256 PKCE is not supported');
    }

    return new OAuth2Client(as, options);
  }

  async makeLoginUrl(): Promise<URL> {
    const codeChallenge = await oauth.calculatePKCECodeChallenge(this.codeVerifier);
    const codeChallengeMethod = 'S256';

    const authorizationUrl = new URL(this.as.authorization_endpoint!);
    const searchParams = authorizationUrl.searchParams;

    searchParams.set('client_id', this.client.client_id);
    searchParams.set('code_challenge', codeChallenge);
    searchParams.set('code_challenge_method', codeChallengeMethod);
    searchParams.set('redirect_uri', this.redirectUri);
    searchParams.set('response_type', 'code');

    if (this.scope) {
      searchParams.set('scope', this.scope);
    }

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
      response,
    );

    if (oauth.isOAuth2Error(result)) {
      console.log('error', result);
      throw new Error();
    }

    return result;
  }
}
