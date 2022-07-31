import { ClientAppToken, PrismaClient, UserToken } from '@prisma/client';
import slugify from '@sindresorhus/slugify';
import argon2 from 'argon2';
import cryptoRandomString from 'crypto-random-string';
import cuid from 'cuid';

import { ONE_HOUR_MS } from './invitation';


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


export function generateUserToken(db: PrismaClient, userId: string): Promise<UserToken> {
  const tokenId = 'u-' + cryptoRandomString({ length: 128, type: 'url-safe' });

  return db.userToken.create({
    data: {
      id: tokenId,
      duration: 3600 * 1000 * 72,
      userId
    }
  });
}

export function generateClientToken(db: PrismaClient, clientAppId: string): Promise<ClientAppToken> {
  const tokenId = 'c-' + cryptoRandomString({ length: 32, type: 'url-safe' });

  return db.clientAppToken.create({
    data: {
      id: tokenId,
      clientAppId,
      duration: ONE_HOUR_MS
    }
  });
}
