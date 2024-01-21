import postgres from 'postgres';
import { z } from 'zod';

import { initDbRepo } from './db/client.js';
import type { AppEnv } from './type.js';

const decoder = z.object({
  HOST_URL: z.string(),

  SERVER_HOST: z.string(),
  SERVER_PORT: z.coerce.number(),

  DB_HOST: z.string(),
  DB_PORT: z.coerce.number(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
});


export function makeEnv(): AppEnv {
  const env = decoder.parse(process.env);

  const pgClient = postgres({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    max: 10,
  });

  const db = initDbRepo({ pgClient });

  return {
    hostUrl: env.HOST_URL,
    server: env.SERVER_HOST,
    port: env.SERVER_PORT,

    googleClientId: env.GOOGLE_CLIENT_ID,
    googleClientSecret: env.GOOGLE_CLIENT_SECRET,

    pgClient,
    db,
  };
}
