import { text, pgTable, timestamp } from 'drizzle-orm/pg-core';

export const country = pgTable('country', {
  id: text('id').primaryKey(),

  name: text('name').notNull(),

  // https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes
  code: text('code').notNull().unique(),

  // https://en.wikipedia.org/wiki/List_of_country_calling_codes
  isdCode: text('isd_code').notNull().unique(),
});

export const state = pgTable('state', {
  id: text('id').primaryKey(),

  name: text('name').notNull(),
  code: text('code').notNull().unique(),
  countryId: text('country_id').notNull().references(() => country.id, { onDelete: 'cascade' }),
});

export const city = pgTable('city', {
  id: text('id').primaryKey(),

  name: text('name').notNull(),
  stateId: text('state_id').notNull().references(() => state.id, { onDelete: 'cascade' }),
});

export const postalCode = pgTable('postal_code', {
  id: text('id').primaryKey(),

  code: text('code').notNull().unique(),
  area: text('area').notNull(),
  cityId: text('city_id').notNull().references(() => city.id, { onDelete: 'cascade' }),
});

export const address = pgTable('address', {
  id: text('id').primaryKey(),

  house: text('house').notNull(),
  street: text('street').notNull(),
  postalCodeId: text('postal_code_id').references(() => postalCode.id, { onDelete: 'cascade' }),

  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
});
