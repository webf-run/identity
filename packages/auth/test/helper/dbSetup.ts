import fs from 'node:fs/promises';

import {
  parseEnv,
  runMigrations,
  seedApiKey,
  setupCleanDb,
  teardownDb,
} from './dbEnv.js';

export async function run() {
  const isCleanSetup = process.argv[2] === '--clean';
  const dbEnv = parseEnv();

  if (isCleanSetup) {
    // First delete existing DB and then create a new one.
    try {
      await teardownDb(dbEnv);
    } catch {
      // Ignore if DB doesn't exist.
    }
    await setupCleanDb(dbEnv);
  }

  await runMigrations(dbEnv);

  if (isCleanSetup) {
    const key = await seedApiKey(dbEnv);

    if (!key) {
      throw new Error('Failed to initialize system');
    }

    const newEnv = {
      ...dbEnv,
      API_KEY: key.apiKey,
    };

    let envStr = '';

    Object.entries(newEnv).forEach(([key, value]) => {
      envStr += `${key}=${value}\n`;
    });

    await fs.writeFile('.env.test', envStr, 'utf-8');
  }
}

run();
