import { serve } from '@hono/node-server';
import { showRoutes } from 'hono/dev';
import postgres from 'postgres';

import { makeEnv } from './env.js';
import { saveGraphQLSchema } from './graphql/schema.js';
import { makeApp } from './server/app.js';

export async function main() {
  const appEnv = makeEnv();

  const app = await makeApp(appEnv);
  const cleanup = cleanupFn(appEnv.pgClient);

  if (process.env.NODE_ENV === 'development') {
    await saveGraphQLSchema('./schema.graphql');
    showRoutes(app, { verbose: true });
  }

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
