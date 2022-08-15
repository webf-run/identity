import slugify from '@sindresorhus/slugify';
import argon2 from 'argon2';
import cryptoRandomString from 'crypto-random-string';
import cuid from 'cuid';


export function generateInviteCode() {
  return cryptoRandomString({ length: 160, type: 'url-safe' });
}


export function generateClientSecret() {
  return cryptoRandomString({ length: 64, type: 'url-safe' });
}


export function generateSlug(title: string) {
  // If the title is available slugify it,
  // otherwise use cuid() to generate random URL.
  if (title) {
    return `${slugify(title)}-${cuid.slug()}`;
  } else {
    return cuid();
  }
}


export async function hashPassword(password: string): Promise<[string, string]> {
  const hash = await argon2.hash(password, { type: argon2.argon2id });

  return [hash, 'argon2id'];
}


export function generateUserToken(): string {
  return 'u-' + cryptoRandomString({ length: 128, type: 'url-safe' });
}

export function generateClientToken(): string {
  return 'c-' + cryptoRandomString({ length: 32, type: 'url-safe' });
}
