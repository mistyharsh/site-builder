import { boolean, date, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { address, country } from './base.js';

export const party = pgTable('party', {
  id: text('id').primaryKey(),

  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
});


export const customer = pgTable('customer', {
  id: text('id').primaryKey().references(() => party.id, { onDelete: 'cascade' }),

  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
});

export const organization = pgTable('organization', {
  id: text('id').primaryKey().references(() => party.id, { onDelete: 'cascade' }),

  name: text('name').notNull(),
});


export const person = pgTable('person', {
  id: text('id').primaryKey().references(() => party.id, { onDelete: 'cascade' }).notNull(),

  given_name: text('given_name').notNull(),
  middle_name: text('middle_name').notNull(),
  family_name: text('family_name').notNull(),

  dob: date('dob'),
  gender: text('gender', { enum: ['male', 'female', 'other', 'unknown'] }).notNull(),
});


export const partyAddress = pgTable('party_address', {
  id: text('id').primaryKey(),

  partyId: text('party_id').notNull().references(() => party.id, { onDelete: 'cascade' }),
  addressId: text('address_id').notNull().references(() => address.id, { onDelete: 'cascade' }),

  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
});


export const partyEmail = pgTable('party_email', {
  id: text('id').primaryKey(),
  partyId: text('party_id').notNull().references(() => party.id, { onDelete: 'cascade' }),

  address: text('address').notNull(),
  isPrimary: boolean('is_primary').notNull(),

  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
});


export const partyPhone = pgTable('party_phone', {
  id: text('id').primaryKey(),
  partyId: text('party_id').notNull().references(() => party.id, { onDelete: 'cascade' }),

  number: text('number').notNull(),
  isPrimary: boolean('is_primary').notNull(),
  country: text('country').notNull().references(() => country.id),

  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
});
