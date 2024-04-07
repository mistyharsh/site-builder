import fs from 'node:fs/promises';

import { mergeSchemas } from '@graphql-tools/schema';
import { idSchema } from '@webf/base';
import { type GraphQLSchema, printSchema, lexicographicSortSchema } from 'graphql';

import { builder } from './builder.js';

// Side effect imports
import './contact.js';

export const crmSchema: GraphQLSchema = builder.toSchema();

export const schema = mergeSchemas({
  schemas: [crmSchema, idSchema],
});


export async function saveGraphQLSchema(filePath: string) {
  const schemaString = printSchema(lexicographicSortSchema(schema));

  await fs.writeFile(filePath, schemaString, { encoding: 'utf-8' });
}
