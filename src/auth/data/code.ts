import argon2 from 'argon2';
import cryptoRandomString from 'crypto-random-string';
import { customAlphabet, customRandom } from 'nanoid';

export function generateInviteCode(): string {
  return cryptoRandomString({ length: 160, type: 'url-safe' });
}

export async function hashPassword(password: string): Promise<[string, string]> {
  const hash = await argon2.hash(password, { type: argon2.argon2id });

  return [hash, 'argon2id'];
}

export function generateUserToken(): string {
  return 'u-' + cryptoRandomString({ length: 128, type: 'url-safe' });
}

export function verifyPassword(hash: string, password: string, algo: string): Promise<boolean> {
  if (algo === 'argon2id') {
    return argon2.verify(hash, password, { type: argon2.argon2id })
  }

  throw 'Only argon2id hashing is supported';
}


export function generateApiKeyId(): string {
  const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 24);

  return 'webf_' + nanoid();
}

export async function generateApiKeyToken() {
  const secret = cryptoRandomString({ length: 128, type: 'url-safe' });
  const [hash, hashFn] = await hashPassword(secret);

  return {
    secret,
    hash,
    hashFn,
  };
}
