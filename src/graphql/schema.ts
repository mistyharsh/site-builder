import fs from 'fs/promises';

import { GraphQLSchema } from 'graphql';
import { printSchema, lexicographicSortSchema } from 'graphql';

import { builder } from './builder.js';

// Side effect imports
import './input.js';
import './output.js';
import './query.js';
import './mutation.js';

export const schema: GraphQLSchema = builder.toSchema();


export async function saveGraphQLSchema(filePath: string) {
  const schemaString = printSchema(lexicographicSortSchema(schema));

  await fs.writeFile(filePath, schemaString, { encoding: 'utf-8' });
}
