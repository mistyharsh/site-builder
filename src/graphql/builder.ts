import SchemaBuilder from '@pothos/core';
import { GraphQLSchema } from 'graphql';

import type { AppContext } from '../type.js';

const builder = new SchemaBuilder<{
  Context: AppContext;
}>({});

builder.queryType({
  fields: (t) => ({
    hello: t.string({
      resolve: (parent, args, context, info) => {
        console.log('context', context);

        return `Hello GraphQL!`;
      }
    }),
  }),
});

export const schema: GraphQLSchema = builder.toSchema();
