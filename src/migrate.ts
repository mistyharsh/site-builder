import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { migrate } from '@webf/base/auth/migrator';
import { z } from 'zod';

const dbConfigDecoder = z.object({
  DB_HOST: z.string(),
  DB_PORT: z.coerce.number(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
});

export function parseEnv(): z.infer<typeof dbConfigDecoder> {
  return dbConfigDecoder.parse(process.env);
}

export async function run() {
  const dbEnv = parseEnv();
  const migrationsFolder = path.join(process.cwd(), 'migrations');

  await migrate({
    host: dbEnv.DB_HOST,
    port: dbEnv.DB_PORT,
    user: dbEnv.DB_USER,
    password: dbEnv.DB_PASSWORD,
    database: dbEnv.DB_NAME,
    folder: migrationsFolder,
  });

  console.log('Migration is successful!');
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  // module was not imported but called directly and so run it.
  run();
}
