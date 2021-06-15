import argon2 from 'argon2';
import { PrismaClient, UserToken } from '@prisma/client';
import cryptoRandomString from 'crypto-random-string';


export function generateInviteCode() {
  return cryptoRandomString({ length: 160, type: 'url-safe' });
}


export async function hashPassword(password: string): Promise<[string, string]> {
  const hash = await argon2.hash(password, { type: argon2.argon2id });

  return [hash, 'argon2id'];
}


export function generateAuthToken(db: PrismaClient, userId: bigint, prefix: 'u'): Promise<UserToken> {
  const tokenId = prefix + '-' + cryptoRandomString({ length: 32, type: 'url-safe' });

  return db.userToken.create({
    data: {
      id: tokenId,
      duration: 3600 * 1000 * 72,
      userId
    }
  });
}
