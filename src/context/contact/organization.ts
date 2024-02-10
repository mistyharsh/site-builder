import { isMember } from '@webf/auth/context';

import type { AppContext, Organization, OrganizationInput } from '../../contract/Type.js';
import { updateAddresses } from '../../dal/addressDAL.js';
import { updateEmails } from '../../dal/emailDAL.js';
import { createOrganization } from '../../dal/organizationDAL.js';
import { createCustomer, makeParty, saveParties } from '../../dal/partyDAL.js';
import { createPeople } from '../../dal/personDAL.js';
import { updatePhones } from '../../dal/phoneDAL.js';


export async function addNewOrganization(context: AppContext, tenantId: string, input: OrganizationInput): Promise<Organization> {
  // Creating/updating a new organization involves following steps:
  // - Create/update a new party
  // - Create/update a new customer
  // - Create/update a new organization
  // - Create/update a new person(s) (if any)
  // - Create/update a new address(es) (if any)
  // - Create/update a new email(s) (if any)
  // - Create/update a new phone(s) (if any)

  const { db, access } = context;

  if(!isMember(access, tenantId)) {
    throw new Error('Access denied');
  }

  const org = await db.transaction(async (tx) => {
    const party = makeParty(tenantId);

    await saveParties(tx, [party]);
    await createCustomer(tx, party.id);
    await createOrganization(tx, party.id, input.name);

    const people = await createPeople(tx, tenantId, input.people);
    const addresses = await updateAddresses(tx, party.id, input.addresses);
    const emails = await updateEmails(tx, party.id, input.emails);
    const phones = await updatePhones(tx, party.id, input.phones);

    const org: Organization = {
      id: party.id,
      name: input.name,
      people,
      addresses,
      emails,
      phones,
    };

    return org;
  });

  return org;
}
