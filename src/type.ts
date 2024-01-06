import type { Access } from '@webf/base/context/access';

import type { Sql } from 'postgres';

import type { DbClient } from './db/client.js';

export type AppEnv = {
  googleClientId: string;
  googleClientSecret: string;

  pgClient: Sql;
  db: DbClient;
};

export type AppContext = {
  db: DbClient;
  access: Access;
};
