import { pk } from '@webf/auth/util/code';

import type { Party } from '../contract/DbType.js';
import type { DbClient } from '../db/client.js';
import * as schema from '../db/party.js';

export function makeParty(tenantId: string): Party {
  const now = new Date();

  const newParty = {
    id: pk(),
    tenantId,
    createdAt: now,
    updatedAt: now,
  };

  return newParty;
}

export async function saveParties(db: DbClient, parties: Party[]): Promise<Party[]> {
  await db
    .insert(schema.party)
    .values(parties)
    .returning();

  return parties;
}


export async function createCustomer(db: DbClient, partyId: string): Promise<void> {
  const now = new Date();

  const newCustomer = {
    id: pk(),
    partyId,
    createdAt: now,
    updatedAt: now,
  };

  await db
    .insert(schema.customer)
    .values(newCustomer)
    .returning();
}
