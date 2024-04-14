import { isMember, type Page } from '@webf/auth/context';
import { eq } from 'drizzle-orm';

import type { AppContext, Contact } from '../../contract/Type.js';
import { customer, organization, person } from '../../db/party.js';


export async function getContacts(context: AppContext, tenantId: string, page: Page): Promise<Contact[]> {
  const { db, access } = context;

  if(!isMember(access, tenantId)) {
    throw new Error('Access denied');
  }

  const result = await db
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
