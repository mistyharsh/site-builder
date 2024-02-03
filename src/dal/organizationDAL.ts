import type { DbClient } from '@webf/auth/db';

import type { Organization } from '../contract/DbType.js';
import * as schema from '../db/party.js';

export async function createOrganization(db: DbClient, partyId: string, name: string): Promise<Organization> {
  const newOrganization = {
    id: partyId,
    name,
  };

  const _ = await db
    .insert(schema.organization)
    .values(newOrganization);

  return newOrganization;
}
