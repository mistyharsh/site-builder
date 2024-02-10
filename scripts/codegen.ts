import type { CodegenConfig } from '@graphql-codegen/cli';

// This codegen configuration is used to generate the client-side code for the GraphQL schema.
// It generates TypeScript types and hooks for the queries and mutations defined in the schema.
// The generated code is used to write tests for the GraphQL server.

const config: CodegenConfig = {
  schema: './schema.graphql',
  documents: ['test/**/*.ts'],
  emitLegacyCommonJSImports: false,
  generates: {
    './test/helper/gql/': {
      preset: 'client-preset',
    },
  },
};

export default config;
