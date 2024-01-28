import { pk } from '@webf/base/util/code';
import { Person } from '../contract/DbType.js';
import { PersonInput } from '../contract/Type.js';
import type { DbClient } from '../db/client.js';
import * as schema from '../db/party.js';
import { makeParty, saveParties } from './partyDAL.js';


export async function createPeople(db: DbClient, tenantId: string, people: PersonInput[]): Promise<Person[]> {

  const parties = people.map(() => makeParty(tenantId));

  const toInsert: Person[] = people.map((p, index) => ({
    id: parties[index].id,
    givenName: p.givenName,
    familyName: p.familyName,
    middleName: p.middleName ?? '',
    dob: p.dob,
    gender: p.gender ?? 'unknown',
  }));

  await saveParties(db, parties);

  const _ = await db
    .insert(schema.person)
    .values(toInsert);

  return toInsert;
}
