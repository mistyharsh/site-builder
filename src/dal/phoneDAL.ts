import { pk } from '@webf/auth/util/code';
import { eq } from 'drizzle-orm';

import { PartyPhone } from '../contract/DbType.js';
import { PhoneInput } from '../contract/Type.js';
import { DbClient } from '../db/client.js';
import { partyPhone } from '../db/party.js';


export async function updatePhones(db: DbClient, partyId: string, input: PhoneInput[]): Promise<PartyPhone[]> {
  if (input.length === 0) {
    return Promise.resolve([]);
  }

  // Final list of phones to return.
  const now = new Date();

  // Delete existing emails.
  await db.delete(partyPhone)
    .where(eq(partyPhone.partyId, partyId));

  const newPhones = input.map((a) => ({
    id: pk(),
    partyId,
    number: a.number,
    countryId: a.countryId,
    isPrimary: a.isPrimary,
    updatedAt: now,
  }));

  await db
    .insert(partyPhone)
    .values(newPhones);

  return newPhones;
}


export async function getPartyPhones(db: DbClient, partyId: string): Promise<PartyPhone[]> {
  const emails = await db
    .select()
    .from(partyPhone)
    .where(eq(partyPhone.partyId, partyId));

  return emails;
}
