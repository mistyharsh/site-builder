import { isClient, createNewTenantWithInvite } from '@webf/base/context';

import type { AppContext } from '../../type.js';

export type NewTenantInput = {
  name: string;
  description: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type NewTenantResponse = {
  id: string;
  description: string;
};

export async function createNewTenant(context: AppContext, input: NewTenantInput): Promise<NewTenantResponse> {
  const { access } = context;

  if (!isClient(access)) {
    throw 'Not authorized';
  }

  const payload = {
    name: input.name,
    description: input.description,
    invitation: {
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
    },
  };

  const response = await createNewTenantWithInvite(context, payload);

  return {
    id: response.tenant.id,
    description: response.tenant.description,
  };
}
