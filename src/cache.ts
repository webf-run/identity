const CACHE_KEY = Symbol.for('bisa.cache');


export interface AppCache {
  isAppInitialized: boolean;
}


export function makeCache(): AppCache {

  const obj = global as any;

  if (!obj[CACHE_KEY]) {

    const cache: AppCache = {
      isAppInitialized: false
    };

    obj[CACHE_KEY] = cache;

    return cache;
  } else {
    return obj[CACHE_KEY];
  }
}

export function updateCache(partial: Partial<AppCache>): AppCache {
  const obj = global as any;

  const cache = getCache();
  const newCache = { ...cache, ...partial };

  obj[CACHE_KEY] = newCache;

  return newCache;
}


export function getCache(): AppCache {
  return (global as any)[CACHE_KEY];
}
