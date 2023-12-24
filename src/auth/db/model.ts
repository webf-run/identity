import { resetPasswordRequest, user, userToken } from './schema.js';

export type User = typeof user.$inferSelect;
export type UserToken = typeof userToken.$inferSelect;
export type ResetPasswordRequest = typeof resetPasswordRequest.$inferSelect;

// After the model is finalized, replace inferred types with real types.
export type ApiKey = {
  id: string;
  description: string;
  token: string;
  hashFn: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type UserWithMembership = User & {
  tenants: string[];
};

// export type User

// TODO: Name it better.
export type UserLocalLogin = {
  userId: string;

  /**
   * Either username or email depending on the query.
   */
  loginId: string;
  password: string;
  hashFn: string;
};
