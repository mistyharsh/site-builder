import type { Config } from 'drizzle-kit';

export default {
  dialect: 'postgresql',
  schema: [
    './src/db/base.ts',
    './src/db/party.ts',
    './src/db/location.ts',
  ],
  out: './migrations',
  dbCredentials: {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'base',
  },
  verbose: true,
  strict: true,
} satisfies Config;
