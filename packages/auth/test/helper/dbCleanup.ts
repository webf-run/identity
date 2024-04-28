import { parseEnv, teardownDb } from './dbEnv.js';

export async function run() {
  const dbEnv = parseEnv();

  await teardownDb(dbEnv);
}

run();
