import { PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as base from './base.js';
import * as party from './party.js';

const schema = {
  ...base,
  ...party,
};

export type DbClient = PostgresJsDatabase<typeof schema>;

export type DbClientOptions = {
  pgClient: postgres.Sql;
};

export function initDbRepo(options: DbClientOptions): DbClient {
  return drizzle(options.pgClient, { schema, logger: true });
}
