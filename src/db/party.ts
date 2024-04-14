import { boolean, date, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

import { country, postalCode, tenant } from './base.js';

/**
 * A party is a generic term for an individual or organization.
 * A party could be customer, organization, or person.
 * A person is a party but may not be a customer.
 * A organization is a party but may not be a customer.
 */
export const party = pgTable('party', {
  id: text('id').primaryKey(),

  tenantId: text('tenant_id').notNull().references(() => tenant.id, { onDelete: 'cascade' }),

  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
});


/**
 * Actual customer of the tenant.
 */
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

  givenName: text('given_name').notNull(),
  familyName: text('family_name').notNull(),
  middleName: text('middle_name').notNull(),

  dob: date('dob', { mode: 'date' }),
  gender: text('gender', { enum: ['male', 'female', 'other', 'unknown'] }).notNull(),
});


export const orgPeople = pgTable('organization_people', {
  id: text('id').primaryKey(),

  organizationId: text('organization_id').notNull().references(() => organization.id, { onDelete: 'cascade' }),
  personId: text('person_id').notNull().references(() => person.id, { onDelete: 'cascade' }),

  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
});


export const partyAddress = pgTable('party_address', {
  id: text('id').primaryKey(),
  partyId: text('party_id').notNull().references(() => party.id, { onDelete: 'cascade' }),

  house: text('house').notNull(),
  street: text('street').notNull(),
  landmark: text('landmark').notNull(),
  postalCodeId: text('postal_code_id').references(() => postalCode.id, { onDelete: 'cascade' }),

  isPrimary: boolean('is_primary').notNull(),

  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
});


export const partyEmail = pgTable('party_email', {
  id: text('id').primaryKey(),
  partyId: text('party_id').notNull().references(() => party.id, { onDelete: 'cascade' }),

  address: text('address').notNull(),
  isPrimary: boolean('is_primary').notNull(),

  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
});


export const partyPhone = pgTable('party_phone', {
  id: text('id').primaryKey(),
  partyId: text('party_id').notNull().references(() => party.id, { onDelete: 'cascade' }),

  number: text('number').notNull(),
  isPrimary: boolean('is_primary').notNull(),
  countryId: text('country_id').notNull().references(() => country.id),

  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
});
