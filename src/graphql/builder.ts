import SchemaBuilder from '@pothos/core';
import type { Page } from '@webf/auth/context';
import { DateResolver } from 'graphql-scalars';
import { z } from 'zod';

import type {
  Address,
  AddressInput,
  AppContext,
  Contact,
  ContactOrg,
  ContactPerson,
  Email,
  EmailInput,
  Organization,
  OrganizationInput,
  Person,
  PersonInput,
  Phone,
  PhoneInput
} from '../contract/Type.js';
import type { Gender } from '../contract/DbType.js';

export type GraphQLSchema = {
  Context: AppContext;
  Objects: {
    Address: Address;
    Email: Email;
    Phone: Phone;
    Person: Person;
    Organization: Organization;
    Contact: Contact;
    ContactOrg: ContactOrg;
    ContactPerson: ContactPerson;
  };
  Inputs: {
    Page: Page;
    AddressInput: AddressInput;
    EmailInput: EmailInput;
    PhoneInput: PhoneInput;
    PersonInput: PersonInput;
    OrganizationInput: OrganizationInput;
  };
  Scalars: {
    Date: {
      Input: Date;
      Output: Date;
    };
    Gender: {
      Input: Gender;
      Output: Gender;
    };
  };
  DefaultFieldNullability: false;
  DefaultInputFieldRequiredness: true;
};

export const builder = new SchemaBuilder<GraphQLSchema>({
  plugins: [],
  defaultInputFieldRequiredness: true,
});

const genderDecoder = z.union([z.literal('male'), z.literal('female'), z.literal('other'), z.literal('unknown')]);

builder.addScalarType('Date', DateResolver);

builder.scalarType('Gender', {
  serialize: (value) => value,
  parseValue: (value) => genderDecoder.parse(value),
});

// GraphQL query
builder.queryType({
  fields: (t) => ({
    hello: t.string({
      resolve: () => 'world',
    }),
  }),
});

// GraphQL mutation
builder.mutationType({});
