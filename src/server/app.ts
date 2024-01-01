import { session } from '@webf/base/auth';
import { Hono } from 'hono';

import { schema } from '../graphql/builder.js';
import { graphqlServer } from '../patch/index.js';
import type { AppEnv } from '../type.js';
import { setupAuth } from './auth.js';
import type { HonoApp, HonoContext } from './type.js';


export async function makeApp(env: AppEnv): Promise<HonoApp> {
  const app: HonoApp = new Hono();

  // Set up authentication routes and session middleware
  const authSystem = await setupAuth(env, app);

  //// AUTHENTICATION ROUTES ////
  // Set up user access information on every route.
  app.use('*', session({ db: authSystem.db }));

  // Authentication endpoints
  app.route('/auth', authSystem.auth);


  //// APPLICATION ROUTES ////
  // Root route
  app.get('/', (c) => c.text('Hello Hono!'));

  // GraphQL endpoint
  app.use('/api/graphql', graphqlServer({
    schema,
    contextResolver(ctx: HonoContext) {
      return ctx.var.context;
    },
  }));

  return app;
}
