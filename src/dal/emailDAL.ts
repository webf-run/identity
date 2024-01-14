import { nanoid } from 'nanoid';

import { DbClient } from '../db/client.js';
import { userEmail } from '../schema/identity.js';

export async function createEmail(db: DbClient, userId: string, email: string, verified: boolean) {
  const newEmail = {
    id: nanoid(),
    userId,
    email,
    verified,
  };

  await db.insert(userEmail)
    .values(newEmail)
    .returning();

  return newEmail;
}

export const count = 1;
