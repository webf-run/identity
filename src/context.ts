import type { PrismaClient } from '@prisma/client';

export interface Context {
  db: PrismaClient;
}

export function makeContext(db: PrismaClient): Context {
  return { db };
}
