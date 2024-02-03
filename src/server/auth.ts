import type { AuthSystem, OAuthCallbacks } from '@webf/base';
import { makeAuth, addOpenIDStrategy, addPasswordStrategy, google } from '@webf/base';

import { AppEnv } from '../type.js';
import { HonoApp } from './type.js';


export async function setupAuth(env: AppEnv, app: HonoApp): Promise<AuthSystem> {
  const { auth, db } = await makeAuth({
    db: {
      pgClient: env.pgClient,
      logger: true,
    },
  });

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

  await addOpenIDStrategy(auth, googleClient, callbacks);
  await addPasswordStrategy(auth);

  return { auth, db };
}
