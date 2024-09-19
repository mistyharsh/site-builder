import { isMember, type Page } from '@webf/auth/context';
import { eq, sql } from 'drizzle-orm';

import type { AppContext, Contact } from '../../contract/Type.js';
import { customer, organization, person, searchTable } from '../../db/party.js';


export async function getContacts(context: AppContext, tenantId: string, page: Page, search: String): Promise<Contact[]> {
  const { db, access } = context;

  if(!isMember(access, tenantId)) {
    throw new Error('Access denied');
  }

  let result;

  if( search.length>0 ) {
    result = await db
    .select({
      customer,
      organization,
      person,
    })
    .from(searchTable)
    .leftJoin(customer, eq(customer.id, searchTable.partyId))
    .leftJoin(person, eq(customer.id, person.id))
    .leftJoin(organization, eq(customer.id, organization.id))
    .where(sql`similarity(${search}, ${searchTable.text}) > 0`);
  } else {
    result = await db
    .select({
      customer,
      organization,
      person,
    })
    .from(customer)
    .leftJoin(person, eq(customer.id, person.id))
    .leftJoin(organization, eq(customer.id, organization.id))
    .offset(page.size * (page.number))
    .limit(page.size);
  } 

  const contacts = result.map((r) => {
    let contact: Contact | null = null;

    if (r.organization) {
      contact = {
        type: 'organization' as const,
        id: r.organization.id,
        name: r.organization.name,
      };
    } else if (r.person) {
      contact = {
        type: 'person' as const,
        id: r.person.id,
        givenName: r.person.givenName,
        familyName: r.person.familyName,
        middleName: r.person.middleName,
      };
    }

    return contact;

  }).filter(guard);

  return contacts;
}


function guard(x: Contact | null): x is Contact {
  return x !== null;
}
