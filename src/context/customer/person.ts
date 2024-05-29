import { isMember } from '@webf/auth/context';

import type { AppContext, Person, PersonInput } from '../../contract/Type.js';
import { createCustomer, makeParty, saveParties } from '../../dal/partyDAL.js';
import { attachPersonToParty } from '../../dal/personDAL.js';
import { updateAddresses } from '../../dal/addressDAL.js';
import { updateEmails } from '../../dal/emailDAL.js';
import { updatePhones } from '../../dal/phoneDAL.js';


export async function addNewIndividual(context: AppContext, tenantId: string, input: PersonInput): Promise<Person> {
  // Creating/updating a new organization involves following steps:
  // - Create/update a new party
  // - Create/update a new customer
  // - Create/update a new person
  // - Create/update a new address(es) (if any)
  // - Create/update a new email(s) (if any)
  // - Create/update a new phone(s) (if any)

  const { db, access } = context;

  if (!isMember(access, tenantId)) {
    throw new Error('Access denied');
  }

  const person = await db.transaction(async (tx) => {
    const party = makeParty(tenantId);

    await saveParties(tx, [party]);
    await createCustomer(tx, party.id);
    await attachPersonToParty(tx, input, party.id);

    await updateAddresses(tx, party.id, input.addresses);
    await updateEmails(tx, party.id, input.emails);
    await updatePhones(tx, party.id, input.phones);

    const person: Person = {
      id: party.id,
      givenName: input.givenName,
      familyName: input.familyName,
      middleName: input.middleName ?? '',
      dob: input.dob ?? null,
      gender: input.gender ?? null,
    };

    return person;
  });

  return person;
}
