import cryptoRandomString from 'crypto-random-string';
import { customAlphabet } from 'nanoid';

import { hash } from './hash';

export function generateInviteCode(): string {
  return cryptoRandomString({ length: 160, type: 'url-safe' });
}

export function generateUserToken(): string {
  return 'u-' + cryptoRandomString({ length: 128, type: 'url-safe' });
}

export function generateApiKeyId(): string {
  const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 24);

  return 'webf_' + nanoid();
}

export async function generateApiKeyToken() {
  const secret = cryptoRandomString({ length: 128, type: 'url-safe' });
  const hashed = await hash(secret);

  return {
    secret,
    hash: hashed[0],
    hashFn: hashed[1],
  };
}
