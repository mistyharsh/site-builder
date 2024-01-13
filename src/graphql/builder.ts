import SchemaBuilder from '@pothos/core';

import type { NewTenantInput, NewTenantResponse } from '../context/identity/tenant.js';
import type { AppContext } from '../type.js';

export type GraphQLSchema = {
  Context: AppContext;
  Objects: {
    NewTenantResponse: NewTenantResponse;
  };
  Inputs: {
    NewTenantInput: NewTenantInput;
  };
};

export const builder = new SchemaBuilder<GraphQLSchema>({});

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
