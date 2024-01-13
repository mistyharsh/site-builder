import { after, it } from 'node:test';
import { equal } from 'node:assert';

import { graphql } from '../gql/gql.js';
import { getClientAccess, getDb } from '../helper/context.js';
import { run } from '../helper/graphql.js';

// Get database client
const { db, end } = getDb();

it('Tenant', async (t) => {

  await t.test('createTenant()', async () => {
    const access = getClientAccess();
    const context = { db, access };

    const query = graphql(`
      mutation createTenant {
        createTenant(input: {
          name: "Sensible Inc"
          description: "First account"
          email: "test@test.io"
          firstName: "Harshal"
          lastName: "Patil"
        }) {
          id
          description
        }
      }
    `);

    // SUT - System Under Test
    const result = await run(query, context);

    // Verify - Result
    equal(result.data?.createTenant.description, 'First account');
  });
});


after(end);
