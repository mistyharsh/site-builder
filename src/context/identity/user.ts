import { User, isMember } from '@webf/base/context';
import { getUsersByTenant } from '@webf/base/dal';

import { AppContext } from '../../type.js';


export async function getUsers(ctx: AppContext, tenantId: string): Promise<User[]> {
  const { access, db } = ctx;

  if (!isMember(access, tenantId)) {
    throw 'Not authorized';
  }

  const users = await getUsersByTenant(db, tenantId, { number: 1, size: 50 });

  return users;
}
