import type { UserEmail } from '../contract/DbType.js';
import type { DbClient } from '../db/client.js';
import { userEmail } from '../schema/identity.js';
import { pk } from '../util/code.js';

export async function createEmail(db: DbClient, userId: string, email: string, verified: boolean): Promise<UserEmail> {
  const newEmail = {
    id: pk(),
    userId,
    email,
    verified,
  };

  await db.insert(userEmail)
    .values(newEmail)
    .returning();

  return newEmail;
}
