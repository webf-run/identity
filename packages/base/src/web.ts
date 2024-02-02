export { type AuthSystem, makeAuth } from './auth/system.js';

export { addOpenIDStrategy } from './auth/oauth.js';
export { addPasswordStrategy } from './auth/password.js';
export { session } from './auth/session.js';

export { type Provider, google, zoho } from './oauth/providers.js';
