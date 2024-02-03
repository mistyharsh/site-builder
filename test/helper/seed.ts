import { DbClient } from '../../src/db/client.js';

import { NewTenant, UserInput, createNewTenantWithInvite, createNewUser } from '@webf/auth/context';

export const tenant: NewTenant = {
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

export async function seed(db: DbClient) {
  const context = { db };

  // Create a tenant
  const newTenant = await createNewTenantWithInvite(context, tenant);
  const newUser1 = await createNewUser(context, {
    ...user1,
    tenantId: newTenant.tenant.id
  }, 'afterlife');

  const newUser2 = await createNewUser(context, {
    ...user2,
    tenantId: newTenant.tenant.id
  }, 'afterlife');

  return {
    tenant: newTenant,
    users: [newUser1, newUser2],
  };
}

export function cleanup(db: DbClient) {

}
