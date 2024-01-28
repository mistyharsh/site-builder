import type { Access } from '@webf/base/context';

import type { Sql } from 'postgres';

import type { DbClient } from './db/client.js';

export type AppEnv = {
  hostUrl: string;
  server: string;
  port: number;

  googleClientId: string;
  googleClientSecret: string;

  pgClient: Sql;
  db: DbClient;
};
