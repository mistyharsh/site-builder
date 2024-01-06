import { builder } from './builder.js';

builder.queryField('hello', (t) => t.string({
  resolve: () => 'world',
}));
