import {
  claimInvitation,
  acceptInvitation,
  inviteUser,
  isPublic,
  isUser,
  NewInvitationInput,
  isMember,
} from '@webf/base/context';
import type { AppContext } from '../../contract/Type.js';


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

export async function invite(ctx: AppContext, tenantId: string, input: NewInvitationInput): Promise<boolean> {
  const { access } = ctx;

  if (!isMember(access, tenantId)) {
    throw new Error('Invalid access');
  }

  const invitation = await inviteUser(ctx, input, tenantId);

  return !!invitation;
}
