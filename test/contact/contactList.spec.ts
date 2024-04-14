import {} from 'node:assert';
import { after, it } from 'node:test';

import { getContacts } from '../../src/context/customer/list.js';
import { addNewOrganization } from '../../src/context/customer/organization.js';
import type { AppContext } from '../../src/contract/Type.js';
import { getDb, getUserAccess } from '../helper/context.js';
import { seed } from '../helper/seed.js';

const { db, end } = getDb();


const addNewOrg = (context: AppContext, tenantId: string, name: string) =>
  addNewOrganization(context, tenantId, {
    name,
    people: [],
    addresses: [],
    emails: [],
    phones: [],
  });


it('Contact List', async (t) => {
  const data = await seed(db);

  await t.test('getCustomers() - basic', async () => {
    const access = await getUserAccess(db, data.user1.id);
    const context = { db, access };

    // Setup - Data
    await addNewOrg(context, data.tenant.id, 'First Customer');
    await addNewOrg(context, data.tenant.id, 'Second Customer');

    // SUT - System Under Test
    const result = await getContacts(context, data.tenant.id, {
      number: 1,
      size: 10,
    });
  });
});

after(end);
