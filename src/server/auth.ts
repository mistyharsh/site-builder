import { makeAuth, addOpenIDStrategy } from '@webf/base/web';
import { google } from '@webf/base/web';
import { claimWithSocial } from '@webf/base/context';
import { AuthSystem, OAuthCallbacks } from '@webf/base';

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
    errorUrl: '/error',
    onLogin(_user, _profile) {
      return Promise.resolve('/');
    },
    onLoginNoUser(profile) {
      console.log('User not found', profile);

      return Promise.resolve('/');
    },
    async onSignup(profile, state) {
      const { inviteCode } = state;

      if (inviteCode) {
        const newUser = await claimWithSocial({ db }, inviteCode, profile);

        return newUser;
      }

      // Do nothing if sign-up doesn't have invite code.
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
