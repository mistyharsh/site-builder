import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: './schema.graphql',
  documents: ['test/**/*.ts'],
  emitLegacyCommonJSImports: false,
  generates: {
    './test/gql/': {
      preset: 'client-preset',
    },
  },
};

export default config;
