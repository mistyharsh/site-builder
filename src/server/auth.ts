import { makeAuth, addOpenIDStrategy } from '@webf/base/auth';
import { google } from '@webf/base/auth/provider';
import { AuthSystem, OAuthCallbacks } from '@webf/base/auth/type';

import { AppEnv } from '../type.js';
import { HonoApp } from './type.js';


export async function setupAuth(env: AppEnv, app: HonoApp): Promise<AuthSystem> {
  const { auth, db } = await makeAuth({
    db: {
      pgClient: env.pgClient,
    },
  });

  const callbacks: OAuthCallbacks = {
    errorUrl: '/error',
    onLogin(user, profile) {
      return Promise.resolve('/');
    },
    onLoginNoUser(profile) {
      console.log('User not found', profile);

      return Promise.resolve('/');
    },
    onSignup(user) {
      return Promise.resolve();
    },
  };

  // LOGIN URL: http://localhost:8080/auth/openid/google
  // SIGNUP URL: http://localhost:8080/auth/openid/google/signup
  // CALLBACK URL: http://localhost:8080/auth/openid/google/callback
  const googleClient = await google({
    clientId: env.googleClientId,
    clientSecret: env.googleClientSecret,
    redirectUri: 'http://localhost:8080/auth/openid/google/callback',
  });

  await addOpenIDStrategy(auth, googleClient, callbacks);

  return { auth, db };
}
