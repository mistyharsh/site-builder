import SchemaBuilder from '@pothos/core';
import { NewInvitationInput, Tenant, User } from '@webf/auth/context';
import { DateResolver } from 'graphql-scalars';

import type {
  Address,
  AddressInput,
  AppContext,
  Email,
  EmailInput,
  Organization,
  OrganizationInput,
  Person,
  PersonInput,
  Phone,
  PhoneInput
} from '../contract/Type.js';
import type {
  NewTenantInput,
  NewTenantResponse
} from '../context/identity/tenant.js';
import type { Gender } from '../contract/DbType.js';
import { z } from 'zod';

export type GraphQLSchema = {
  Context: AppContext;
  Objects: {
    // Identity Types
    NewTenantResponse: NewTenantResponse;
    User: User;
    Tenant: Tenant;

    // CRM Types
    Address: Address;
    Email: Email;
    Phone: Phone;
    Person: Person;
    Organization: Organization;
  };
  Inputs: {
    NewTenantInput: NewTenantInput;
    NewInvitationInput: Omit<NewInvitationInput, 'duration'>;

    // CRM Inputs
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
