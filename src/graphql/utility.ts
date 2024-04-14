import { builder } from './builder.js';

builder.inputType('Page', {
  fields: (t) => ({
    number: t.int(),
    size: t.int(),
  }),
});
