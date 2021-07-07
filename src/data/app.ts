import { PrismaClient } from '@prisma/client';
import { AppCache, getCache, updateCache } from '../cache';


export async function getUpdatedInitization(db: PrismaClient): Promise<AppCache> {
  const cache = getCache();

  if (cache.isAppInitialized) {
    return cache;
  }

  const isAppInitialized = await checkAppInitialized(db);

  return updateCache({ isAppInitialized });
}


async function checkAppInitialized(db: PrismaClient): Promise<boolean> {
  const apps = await db.clientApp.count();

  return apps > 0;
}
