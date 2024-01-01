import { boolean, integer, pgTable, smallint, text, timestamp, unique } from 'drizzle-orm/pg-core';


export const apiKey = pgTable('api_key', {
  id: text('id').primaryKey(),
  description: text('description').notNull(),

  token: text('token').notNull(),
  hashFn: text('hash_fn').notNull(),

  isActive: boolean('is_active').notNull(),

  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
});


export const user = pgTable('user', {
  id: text('id').primaryKey(),

  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),

  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
});


export const userEmail = pgTable('user_email', {
  id: text('id').primaryKey(),

  email: text('email').unique('email').notNull(),
  verified: boolean('verified').notNull(),

  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
});


export const localLogin = pgTable('local_login', {
  userId: text('user_id').primaryKey().references(() => user.id, { onDelete: 'cascade' }),

  // Value of the username depends on the application logic.
  // They may store some GitHub/Twitter like username or use the email.
  username: text('username').unique('username').notNull(),

  password: text('password').notNull(),
  hashFn: text('hash_fn').notNull(),

  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
});

export const providerLogin = pgTable('provider_login', {
  id: text('id').primaryKey(),

  providerId: text('provider_id').notNull(),
  subjectId: text('subject_id').notNull(),

  userId: text('user_id').notNull().references(() => user.id, { onDelete:  'cascade'}),
}, (t) => ({
  uniqueId: unique('provider_unique_id').on(t.providerId, t.subjectId)
}));


export const tenant = pgTable('tenant', {
  id: text('id').primaryKey(),

  name: text('name').notNull(),
  description: text('description').notNull(),
  key: text('key').unique('key').notNull(),

  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
});


// TODO: Should invitation be part of this system?
// export const invitation = pgTable('invitation', {
//   id: text('id').primaryKey(),
//   code: text('code').unique('code').notNull(),

//   firstName: text('first_name').notNull(),
//   lastName: text('last_name').notNull(),

//   email: text('email').notNull(),

//   // duration in milliseconds
//   duration: integer('duration').notNull(),
//   expiryAt: integer('expiry_at').notNull(),

//   tenantId: text('tenant_id').references(() => tenant.id).notNull(),

//   createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
//   updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
// });


export const tenantUser = pgTable('tenant_user', {
  id: text('id').primaryKey(),

  tenantId: text('tenant_id').notNull().references(() => tenant.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),

  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
}, (t) => ({
  membership: unique('membership').on(t.tenantId, t.userId),
}));


export const resetPasswordRequest = pgTable('reset_password_request', {
  id: text('id').primaryKey(),

  code: text('code').unique('code').notNull(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),

  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
});


export const loginAttempt = pgTable('login_attempt', {
  userId: text('user_id').primaryKey().notNull().references(() => user.id, { onDelete: 'cascade' }),

  attempts: smallint('attempts').notNull(),
  lastAttempt: timestamp('last_attempt', { withTimezone: true }).notNull(),
});


export const userToken = pgTable('user_token', {
  id: text('id').primaryKey(),

  generatedAt: timestamp('generated_at', { withTimezone: true }).notNull(),

  /**
   *  The `duration` in milliseconds
   */
  duration: integer('duration').notNull(),

  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
});
