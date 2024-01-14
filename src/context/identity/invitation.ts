import {
  claimInvitation,
  acceptInvitation,
  isPublic,
  isUser,
} from '@webf/base/context';

import { AppContext } from '../../type.js';


export async function claim(ctx: AppContext, inviteCode: string, password: string): Promise<boolean> {
  const { access } = ctx;

  if (!isPublic(access)) {
    throw new Error('Invalid access');
  }

  await claimInvitation(ctx, inviteCode, password);

  return true;
}

export async function accept(ctx: AppContext, inviteId: string): Promise<boolean> {
  const { access } = ctx;

  if (!isUser(access)) {
    throw new Error('Invalid access');
  }

  const userId = access.user.id;

  await acceptInvitation(ctx, inviteId, userId);

  return true;
}
