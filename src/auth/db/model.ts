import { resetPasswordRequest, user, userToken } from './schema.js';

export type User = typeof user.$inferSelect;
export type UserToken = typeof userToken.$inferSelect;
export type ResetPasswordRequest = typeof resetPasswordRequest.$inferSelect;


export type UserLocalLogin = {
  userId: string;

  /**
   * Either username or email depending on the query.
   */
  loginId: string;
  password: string;
  hashFn: string;
};
