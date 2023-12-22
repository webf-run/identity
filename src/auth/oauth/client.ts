import * as oauth from 'oauth4webapi';
import type { AuthorizationServer, Client } from 'oauth4webapi';

export type OAuth2Options = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope?: string;
};

export type OAuth2ClientOptions = OAuth2Options & {
  /**
   * The OAuth 2.0 provider like `google`, `zoho`, etc.
   */
  provider: string;
}

export type State = {
  type: 'login' | 'signup';
  redirectUrl?: string;
};

export type OAuthProfile = {
  /**
   * The OAuth 2.0 provider like `google`, `zoho`, etc. to which this user belongs.
   */
  provider: string;
  subjectId: string;
  email: string;
  emailVerified: boolean;

  givenName: string;
  familyName: string;
  name: string;

  accessToken: string;
  tokenType: string;
};

export class OAuth2Client {
  private readonly as: AuthorizationServer;
  private readonly redirectUri: string;
  private readonly client: Client;
  private readonly codeVerifier: string;
  private readonly scope?: string;

  readonly provider: string;

  private constructor(as: AuthorizationServer, options: OAuth2ClientOptions) {
    this.provider = options.provider;
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

  static async make(asURL: string, options: OAuth2ClientOptions): Promise<OAuth2Client> {
    const issuer = new URL(asURL);

    // Hack as Node.js fetch has problems. The instance of Response is not a real Response. So, we copy it to a new response.
    const discovery: Response = await oauth.discoveryRequest(issuer, { algorithm: 'oidc' });
    const response = new Response(discovery.body, discovery);

    const as = await oauth.processDiscoveryResponse(issuer, response);

    if (as.code_challenge_methods_supported?.includes('S256') !== true) {
      // This example assumes S256 PKCE support is signalled
      // If it isn't supported, random `state` must be used for CSRF protection.
      throw new Error('S256 PKCE is not supported');
    }

    return new OAuth2Client(as, options);
  }

  async makeAuthorizationUrl(type: 'login' | 'signup'): Promise<URL> {
    // TODO: Check code challenge method.
    const codeChallenge = await oauth.calculatePKCECodeChallenge(this.codeVerifier);
    const codeChallengeMethod = 'S256';

    const authorizationUrl = new URL(this.as.authorization_endpoint!);
    const searchParams = authorizationUrl.searchParams;
    const state = btoa(JSON.stringify({ type }));

    searchParams.set('client_id', this.client.client_id);
    searchParams.set('code_challenge', codeChallenge);
    searchParams.set('code_challenge_method', codeChallengeMethod);
    searchParams.set('redirect_uri', this.redirectUri);
    searchParams.set('response_type', 'code');
    searchParams.set('state', state);

    if (this.scope) {
      searchParams.set('scope', this.scope);
    }

    return authorizationUrl;
  }

  async exchangeAuthorizationCode(searchParams: URLSearchParams): Promise<OAuthProfile> {
    const parameters = oauth.validateAuthResponse(
      this.as,
      this.client,
      searchParams,
      oauth.skipStateCheck,
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

    // Hack as Node.js fetch has problems. The instance of Response is not a real Response.
    // So, we copy it to a new response.
    const response2 = new Response(response.body, response);

    const result = await oauth.processAuthorizationCodeOpenIDResponse(this.as, this.client, response2);

    if (oauth.isOAuth2Error(result)) {
      console.log('error', result);
      throw new Error();
    }

    const claims = oauth.getValidatedIdTokenClaims(result);

    const user: OAuthProfile = {
      provider: this.provider,
      subjectId: claims.sub,
      email: claims.email as string,
      emailVerified: !!claims.email_verified,

      givenName: (claims.first_name || claims.given_name) as string,
      familyName: (claims.last_name || claims.family_name) as string,
      name: claims.name as string,

      accessToken: result.access_token,
      tokenType: result.token_type,
    };

    return user;
  }
}
