export type User = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  firstName: string;
  lastName: string;
};

export type UserToken = {
  id: string;
  generatedAt: Date;
  duration: number;
  userId: string;
};

export type ResetPasswordRequest = {
  id: string;
  code: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};

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
