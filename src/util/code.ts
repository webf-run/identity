import cryptoRandomString, { Options } from 'crypto-random-string';
import { customAlphabet, nanoid } from 'nanoid';

import { hash } from './hash';

const SECURE_RANDOM_OPTIONS: Options = {
  length: 96,
  type: 'alphanumeric',
};

export function pk(): string {
  return nanoid();
}

export function inviteCode(): string {
  return cryptoRandomString(SECURE_RANDOM_OPTIONS);
}

export function bearerToken(): string {
  return 'u-' + cryptoRandomString(SECURE_RANDOM_OPTIONS);
}

export function apiKeyId(): string {
  const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 24);

  return 'webf_' + nanoid();
}

export async function apiKeyToken() {
  const secret = cryptoRandomString(SECURE_RANDOM_OPTIONS);
  const hashed = await hash(secret);

  return {
    secret,
    hash: hashed[0],
    hashFn: hashed[1],
  };
}
