import { serve } from '@hono/node-server';
import postgres from 'postgres';

import { makeEnv } from './env.js';
import { makeApp } from './server/app.js';

export async function main() {
  const appEnv = makeEnv();

  const app = await makeApp(appEnv);
  const cleanup = cleanupFn(appEnv.pgClient);

  serve({
    fetch: app.fetch,
    port: 8080,
  }, (info) => {
    console.log(`🚀 Server ready at ${info.address}:${info.port}`);
  });

  process.on('beforeExit', cleanup);

  process.on('exit', () => {
    console.log('Exit!');
  });

  // SIGINT, SIGTERM, SIGHUP
  process.on('SIGINT', cleanup);
  process.on('SIGHUP', cleanup);
  process.on('SIGTERM', cleanup);
}

function cleanupFn(pgClient: postgres.Sql) {
  return async function cleanup() {
    await pgClient.end();
    process.exit(0);
  }
}

main()
  .then(() => {});
