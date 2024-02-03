import { pk } from '@webf/auth/util/code';
import { partition } from '@webf/auth/util/map';
import { and, eq, notInArray } from 'drizzle-orm';

import type { PartyEmail } from '../contract/DbType.js';
import type { EmailInput } from '../contract/Type.js';
import type { DbClient } from '../db/client.js';
import { partyEmail } from '../db/party.js';


export async function updateEmails(db: DbClient, partyId: string, input: EmailInput[]): Promise<PartyEmail[]> {
  if (input.length === 0) {
    return Promise.resolve([]);
  }

  // Final list of phones to return.
  const now = new Date();

  // Delete existing emails.
  await db.delete(partyEmail)
    .where(eq(partyEmail.partyId, partyId));

  const newEmails = input.map((a) => ({
    id: pk(),
    partyId,
    address: a.address,
    isPrimary: a.isPrimary,
    createdAt: now,
    updatedAt: now,
  }));

  await db
    .insert(partyEmail)
    .values(newEmails);

  return newEmails;
}


async function getPartyEmails(db: DbClient, partyId: string): Promise<PartyEmail[]> {
  const emails = await db
    .select()
    .from(partyEmail)
    .where(eq(partyEmail.partyId, partyId));

  return emails;
}
