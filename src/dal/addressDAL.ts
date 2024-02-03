import { pk } from '@webf/auth/util/code';
import { eq } from 'drizzle-orm';

import type { PartyAddress } from '../contract/DbType.js';
import type { AddressInput } from '../contract/Type.js';
import type { DbClient } from '../db/client.js';
import { partyAddress } from '../db/party.js';

/**
 * Update one or more addresses of a party. This operation should be performed within a transaction.
 *
 * Dev Notes: This operation will do any of the `insert, update, delete` operations on the `address` and `party_table` table.
 */
export async function updateAddresses(db: DbClient, partyId: string, input: AddressInput[]): Promise<PartyAddress[]> {
  if (input.length === 0) {
    return Promise.resolve([]);
  }

   // Final list of phones to return.
   const now = new Date();

   // Delete existing emails.
   await db.delete(partyAddress)
     .where(eq(partyAddress.partyId, partyId));

  const newAddrs = input.map((a) => ({
    id: pk(),
    partyId,
    isPrimary: false,
    house: a.house,
    street: a.street,
    landmark: a.landmark,
    postalCodeId: a.postalCodeId,
    updatedAt: now,
  }));

  await db
    .insert(partyAddress)
    .values(newAddrs);

  return newAddrs;
}


export async function getPartyAddresses(db: DbClient, partyId: string): Promise<PartyAddress[]> {
  const result = await db
    .select()
    .from(partyAddress)
    .where(eq(partyAddress.partyId, partyId));

  return result;
}
