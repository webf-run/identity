import { integer, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';


export const apiKey = sqliteTable('api_key', {
  id: text('id').primaryKey(),
  description: text('description').notNull(),

  token: text('token').notNull(),
  hashFn: text('hash_fn').notNull(),

  isActive: integer('is_active', { mode: 'boolean' }).notNull(),

  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
});


export const user = sqliteTable('user', {
  id: text('id').primaryKey(),

  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),

  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
});


export const userEmail = sqliteTable('user_email', {
  id: text('id').primaryKey(),

  email: text('email').unique('email').notNull(),
  verified: integer('verified', { mode: 'boolean' }).notNull(),

  userId: text('user_id').references(() => user.id).notNull(),
});


export const localLogin = sqliteTable('local_login', {
  userId: text('user_id').primaryKey().references(() => user.id).notNull(),

  // Value of the username depends on the application logic.
  // They may store some GitHub/Twitter like username or use the email.
  username: text('username').unique('username').notNull(),

  password: text('password').notNull(),
  hashFn: text('hash_fn').notNull(),

  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
});

export const providerLogin = sqliteTable('provider_login', {
  id: text('id').primaryKey(),

  providerId: text('provider_id').notNull(),
  subjectId: text('subject_id').notNull(),

  userId: text('user_id').references(() => user.id).notNull(),
}, (t) => ({
  uniqueId: unique('provider_login_unique_id').on(t.providerId, t.subjectId)
}));


export const tenant = sqliteTable('tenant', {
  id: text('id').primaryKey(),

  name: text('name').notNull(),

  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
});


// TODO: Should invitation be part of this system?
// export const invitation = sqliteTable('invitation', {
//   id: text('id').primaryKey(),
//   code: text('code').unique('code').notNull(),

//   firstName: text('first_name').notNull(),
//   lastName: text('last_name').notNull(),

//   email: text('email').notNull(),

//   // duration in milliseconds
//   duration: integer('duration').notNull(),
//   expiryAt: integer('expiry_at').notNull(),

//   tenantId: text('tenant_id').references(() => tenant.id).notNull(),

//   createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
//   updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
// });


export const tenantUser = sqliteTable('tenant_user', {
  id: text('id').primaryKey(),

  tenantId: text('tenant_id').references(() => tenant.id).notNull(),
  userId: text('user_id').references(() => user.id).notNull(),

  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
}, (t) => ({
  membership: unique('tenant_user_unique_membership').on(t.tenantId, t.userId),
}));


export const resetPasswordRequest = sqliteTable('reset_password_request', {
  id: text('id').primaryKey(),

  code: text('code').unique('code').notNull(),
  userId: text('user_id').references(() => user.id).notNull(),

  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
});


export const loginAttempt = sqliteTable('login_attempt', {
  userId: text('user_id').primaryKey().references(() => user.id),

  attempts: integer('attempts', { mode: 'number' }).notNull(),
  lastAttempt: integer('last_attempt', { mode: 'timestamp_ms' }).notNull(),
});


export const userToken = sqliteTable('user_token', {
  id: text('id').primaryKey(),

  generatedAt: integer('generated_at', { mode: 'timestamp_ms' }).notNull(),
  duration: integer('duration', { mode: 'number' }).notNull(),

  userId: text('user_id').references(() => user.id).notNull(),
});
