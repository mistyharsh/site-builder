import { equal } from 'node:assert';
import { after, it } from 'node:test';

import { getDb, getUserAccess } from '../helper/context.js';
import { gql, run } from '../helper/graphql.js';
import { cleanup, seed } from '../helper/seed.js';

const { db, end } = getDb();

it('Organization', async (t) => {
  const data = await seed(db);

  await t.test('createOrganization() - basic', async () => {
    const access = await getUserAccess(db, data.user1.id);
    const context = { db, access };

    const input = {
      name: 'First Customer',
      people: [],
      addresses: [],
      emails: [],
      phones: [],
    };

    // SUT - System Under Test
    const query = gql(`
      mutation createOrganization($tenantId: String!, $input: OrganizationInput!) {
        createOrganization(tenantId: $tenantId, input: $input) {
          id,
          name,
        }
      }
    `);

    const result = await run(query, context, {
      input,
      tenantId: data.tenant.id,
    });

    // Verify - Result
    equal(result.data?.createOrganization.name, input.name);
  });

  // Cleanup seed data
  await cleanup(db, data);
});


after(end);
