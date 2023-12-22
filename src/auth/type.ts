import { DbClient } from './db/client';
import { AuthMiddleware } from './middleware/type';

export type AuthSystem = {
  auth: AuthMiddleware;
  db: DbClient;
}
