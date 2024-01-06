import { builder } from './builder.js';

builder.inputType('NewTenantInput', {
  fields: (t) => ({
    name: t.string({ required: true }),
    description: t.string({ required: true }),
    firstName: t.string({ required: true }),
    lastName: t.string({ required: true }),
    email: t.string({ required: true }),
  }),
});
