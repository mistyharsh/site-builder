import SchemaBuilder from '@pothos/core';

import type { NewTenantInput, NewTenantResponse } from '../context/identity/tenant.js';
import type { AppContext } from '../type.js';

export const builder = new SchemaBuilder<{
  Context: AppContext;
  Objects: {
    NewTenantResponse: NewTenantResponse;
  };
  Inputs: {
    NewTenantInput: NewTenantInput;
  };
}>({});

// GraphQL query
builder.queryType({});

// GraphQL mutation
builder.mutationType({});
