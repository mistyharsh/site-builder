import type { AuthSystem, OAuthCallbacks } from '@webf/hono-auth';
import { makeAuth, google } from '@webf/hono-auth';

import type { AppEnv } from '../type.js';
import type { HonoApp } from './type.js';


export async function setupAuth(env: AppEnv, app: HonoApp): Promise<AuthSystem> {
  const callbacks: OAuthCallbacks = {
    onLogin(_user, _profile) {
      return Promise.resolve('/');
    },
    onError(error) {
      console.error('Auth error', error);
      return Promise.resolve('/');
    },
  };

  // LOGIN URL: http://localhost:8080/auth/openid/google
  // SIGNUP URL: http://localhost:8080/auth/openid/google/signup
  // CALLBACK URL: http://localhost:8080/auth/openid/google/callback
  const googleClient = await google({
    clientId: env.googleClientId,
    clientSecret: env.googleClientSecret,
    redirectUri: `${env.hostUrl}/auth/openid/google/callback`,
  });

  const { auth, db } = await makeAuth({
    app,
    db: {
      pgClient: env.pgClient,
      logger: true,
    },
    usePassword: true,
    useInvitation: true,
    strategies: [
      { callbacks, client: googleClient },
    ],
  });

  return { auth, db };
}
