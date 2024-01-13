import { Access } from '@webf/base/context';

import { initDbRepo } from '../../src/db/client.js';
import { makeClient } from './db.js';

export function getDb() {
  const { sql } = makeClient(true);
  const db = initDbRepo({ pgClient: sql });

  return {
    db,
    end: () => sql.end(),
  };
}

export function getClientAccess(): Access {

  const access: Access = {
    type: 'client',
    key: {
      id: '1',
      description: 'test',
      token: 'client_key',
      hashFn: 'argon2id',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };

  return access;
}
