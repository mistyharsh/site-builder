import {
  type Invitation,
  type NewTenantInput,
  type UserInput,
  type User,
  type Tenant,
  createNewTenantWithInvite,
  createNewUser,
} from '@webf/auth/context';

import type { DbClient } from '../../src/db/client.js';
import * as idSchema from '@webf/auth/schema/identity';
import { eq, inArray } from 'drizzle-orm';
import { getPublicAccess } from './context.js';

export type SeedData = {
  tenant: Tenant;
  invitation: Invitation;
  user1: User;
  user2: User;
};

export const tenant: NewTenantInput = {
  name: 'The Good Place',
  description: 'First account',
  key: 'good-place',
  invitation: {
    firstName: 'Michael',
    lastName: 'Architect',
    email: 'michael@architect.com',
  },
};

export const user1: UserInput = {
  firstName: 'Eleanor',
  lastName: 'Shellstrop',
  email: 'eleanor@goodplace.com',
  tenantId: 'good-place',
};

export const user2: UserInput = {
  firstName: 'Chidi',
  lastName: 'Anagonye',
  email: 'chidi@goodplace.com',
  tenantId: 'good-place',
};

export async function seed(db: DbClient): Promise<SeedData> {
  const context = {
    db,
    access: getPublicAccess()
  };

  // Create a tenant
  const newTenant = await createNewTenantWithInvite(context, tenant);
  const newUser1 = await createNewUser(context, {
    ...user1,
    tenantId: newTenant.tenant.id,
  }, 'afterlife');

  const newUser2 = await createNewUser(context, {
    ...user2,
    tenantId: newTenant.tenant.id,
  }, 'afterlife');

  return {
    tenant: newTenant.tenant,
    invitation: newTenant.invitation,
    user1: newUser1,
    user2: newUser2,
  };
}

export async function cleanup(db: DbClient, seedData: SeedData) {
  const { tenant, user } = idSchema;

  await db.delete(user)
    .where(inArray(user.id, [seedData.user1.id, seedData.user2.id]));


  await db.delete(tenant)
    .where(eq(tenant.id, seedData.tenant.id));
}
