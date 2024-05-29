import { pk } from '@webf/auth/util/code';

import type { OrgPeople, Person } from '../contract/DbType.js';
import type { PersonInput } from '../contract/Type.js';
import type { DbClient } from '../db/client.js';
import * as schema from '../db/party.js';
import { makeParty, saveParties } from './partyDAL.js';


export async function attachPersonToParty(db: DbClient, person: PersonInput, partyId: string) {
  const toInsert = {
    id: partyId,
    givenName: person.givenName,
    familyName: person.familyName,
    middleName: person.middleName ?? '',
    dob: person.dob ?? null,
    gender: person.gender ?? 'unknown',
  }

  const _ = await db
    .insert(schema.person)
    .values(toInsert);

  return toInsert;
}

export async function createPeople(db: DbClient, tenantId: string, people: PersonInput[]): Promise<Person[]> {
  if (!people.length) {
    return Promise.resolve([]);
  }

  const parties = people.map(() => makeParty(tenantId));

  const toInsert: Person[] = people.map((p, index) => ({
    id: parties[index].id,
    givenName: p.givenName,
    familyName: p.familyName,
    middleName: p.middleName ?? '',
    dob: p.dob ?? null,
    gender: p.gender ?? 'unknown',
  }));

  await saveParties(db, parties);

  const _ = await db
    .insert(schema.person)
    .values(toInsert);

  return toInsert;
}


export async function createOrgPeople(db: DbClient, organizationId: string, people: Person[]): Promise<OrgPeople[]> {
  if (!people.length) {
    return Promise.resolve([]);
  }

  const toInsert: OrgPeople[] = people.map((p, index) => ({
    id: pk(),
    createdAt: new Date(),
    updatedAt: new Date(),
    organizationId,
    personId: p.id,
  }));

  await db
    .insert(schema.orgPeople)
    .values(toInsert);

  return toInsert;
}
