import { PrismaClient } from '@prisma/client';

const DB_KEY = Symbol.for('bisa.db');


export function initialize(): PrismaClient {

  const obj = global as any;

  if (!obj[DB_KEY]) {

    const client = new PrismaClient({
      log: ['query', 'info', 'warn', 'error']
    });

    obj[DB_KEY] = client;

    return client;
  } else {
    return obj[DB_KEY];
  }

}


export function getClient(): PrismaClient {
  return (global as any)[DB_KEY];
}
