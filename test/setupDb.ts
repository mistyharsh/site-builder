import postgres from 'postgres';

import { initialize } from '@webf/base/auth/core/system';

import { parseEnv, run } from '../src/migrate.js';
import { initDbRepo } from '../src/db/client.js';


function makeClient(useDb: boolean) {
  // Parse environment variables
  const dbEnv = parseEnv();

  // Connect to database
  const sql = postgres({
    host: dbEnv.DB_HOST,
    port: dbEnv.DB_PORT,
    username: dbEnv.DB_USER,
    password: dbEnv.DB_PASSWORD,
    database: useDb ? dbEnv.DB_NAME : undefined,
  });

  return { sql, dbEnv };
}

export async function setupCleanDb() {
  // Parse environment variables and connect to database
  const { dbEnv, sql } = makeClient(false);

  // Create a new database
  await sql`CREATE DATABASE ${sql(dbEnv.DB_NAME)}`;

  // Run migrations
  await run();

  // Disconnect from database
  await sql.end();

  // Connect to the new database
  const pgClient = makeClient(true).sql;

  const db = initDbRepo({ pgClient });

  // Initialize the system with first API Key.
  const response = await initialize({ db });

  if (response.ok) {
    console.log('Generated API Key', response.value.apiKey);
  } else {
    console.warn('Failed to generate API Key', response);
  }

  // Disconnect from database
  await pgClient.end();
}

export async function teardownDb() {
  // Parse environment variables and connect to database
  const { dbEnv, sql } = makeClient(false);

  // Drop database
  await sql`DROP DATABASE ${sql(dbEnv.DB_NAME)}`;

  // Disconnect from database
  await sql.end();
}


if (process.argv[2] === '--teardown') {
  teardownDb();
} else {
  setupCleanDb();
}
