import cryptoRandomString from 'crypto-random-string';
import { customAlphabet } from 'nanoid';

import { hash } from './hash';

export function inviteCode(): string {
  return cryptoRandomString({ length: 96, type: 'alphanumeric' });
}

export function bearerToken(): string {
  return 'u-' + cryptoRandomString({ length: 96, type: 'alphanumeric' });
}

export function apiKeyId(): string {
  const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 24);

  return 'webf_' + nanoid();
}

export async function apiKeyToken() {
  const secret = cryptoRandomString({ length: 128, type: 'alphanumeric' });
  const hashed = await hash(secret);

  return {
    secret,
    hash: hashed[0],
    hashFn: hashed[1],
  };
}
