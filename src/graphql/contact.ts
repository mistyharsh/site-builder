import { getContacts } from '../context/customer/list.js';
import { addNewOrganization } from '../context/customer/organization.js';
import { addNewIndividual } from '../context/customer/person.js';
import { builder } from './builder.js';

// INPUT TYPES
builder.inputType('AddressInput', {
  fields: (t) => ({
    house: t.string(),
    street: t.string(),
    landmark: t.string(),
    postalCodeId: t.string(),
  }),
});

builder.inputType('EmailInput', {
  fields: (t) => ({
    address: t.string(),
    isPrimary: t.boolean(),
  }),
});

builder.inputType('PhoneInput', {
  fields: (t) => ({
    number: t.string(),
    isPrimary: t.boolean(),
    countryId: t.string(),
  }),
});

builder.inputType('PersonInput', {
  fields: (t) => ({
    addresses: t.field({ type: ['AddressInput'] }),
    emails: t.field({ type: ['EmailInput'] }),
    phones: t.field({ type: ['PhoneInput'] }),
    givenName: t.string(),
    familyName: t.string(),
    middleName: t.string({ required: false }),
    dob: t.field({ type: 'Date', required: false}),
    gender: t.field({ type: 'Gender' }),
  }),
});

builder.inputType('OrganizationInput', {
  fields: (t) => ({
    name: t.string(),
    people: t.field({ type: ['PersonInput'] }),
    addresses: t.field({ type: ['AddressInput'] }),
    emails: t.field({ type: ['EmailInput'] }),
    phones: t.field({ type: ['PhoneInput'] }),
  }),
});


// OBJECT TYPES
builder.objectType('Address', {
  fields: (t) => ({
    house: t.exposeString('house'),
    street: t.exposeString('street'),
    landmark: t.exposeString('landmark'),
    postalCodeId: t.exposeString('postalCodeId', { nullable: true }),
    isPrimary: t.exposeBoolean('isPrimary'),
  }),
});

builder.objectType('Email', {
  fields: (t) => ({
    address: t.exposeString('address'),
    isPrimary: t.exposeBoolean('isPrimary'),
  }),
});

builder.objectType('Phone', {
  fields: (t) => ({
    number: t.exposeString('number'),
    isPrimary: t.exposeBoolean('isPrimary'),
    countryId: t.exposeString('countryId'),
  }),
});

builder.objectType('Person', {
  fields: (t) => ({
    id: t.exposeID('id'),
    givenName: t.exposeString('givenName'),
    familyName: t.exposeString('familyName'),
    middleName: t.exposeString('middleName'),
    dob: t.field({
      type: 'Date',
      nullable: true,
      resolve: (parent) => parent.dob,
    }),
  }),
});

builder.objectType('Organization', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    people: t.field({
      type: ['Person'],
      resolve: (parent) => parent.people,
    }),
    addresses: t.field({
      type: ['Address'],
      resolve: (parent) => parent.addresses,
    }),
    emails: t.field({
      type: ['Email'],
      resolve: (parent) => parent.emails,
    }),
    phones: t.field({
      type: ['Phone'],
      resolve: (parent) => parent.phones,
    }),
  }),
});


builder.objectType('ContactPerson', {
  fields: (t) => ({
    id: t.exposeID('id'),
    givenName: t.exposeString('givenName'),
    familyName: t.exposeString('familyName'),
    middleName: t.exposeString('middleName'),
  }),
});

builder.objectType('ContactOrg', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
  }),
});

builder.unionType('Contact', {
  types: ['ContactOrg', 'ContactPerson'],
  resolveType: (value) => {
    if (value.type === 'organization') {
      return 'ContactOrg';
    } else {
      return 'ContactPerson';
    }
  },
});

// MUTATIONS
builder.mutationFields((t) => ({
  createContactOrganization: t.field({
    description: 'Create a new organization type contact',
    type: 'Organization',
    args: {
      tenantId: t.arg.string(),
      input: t.arg({ type: 'OrganizationInput' }),
    },
    async resolve(parent, { input, tenantId }, context) {
      const organization = await addNewOrganization(context, tenantId, input);

      return organization;
    },
  }),

  createContactPerson: t.field({
    description: 'Create a new individual type contact',
    type: 'Person',
    args: {
      tenantId: t.arg.string(),
      input: t.arg({ type: 'PersonInput' }),
    },
    async resolve(parent, { input, tenantId }, context) {
      const person = await addNewIndividual(context, tenantId, input);

      return person;
    },
  }),
}));

// QUERIES
builder.queryFields((t) => ({
  getContacts: t.field({
    description: 'Get all contacts',
    type: ['Contact'],
    args: {
      tenantId: t.arg.string(),
      page: t.arg({ type: 'Page' }),
    },
    async resolve(parent, { tenantId, page }, context) {
      const contacts = await getContacts(context, tenantId, page);

      return contacts;
    },
  }),
}));
