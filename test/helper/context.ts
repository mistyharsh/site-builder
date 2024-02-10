import { Access } from '@webf/auth/context';
import { createToken, findUserByToken } from '@webf/auth/dal';
import postgres from 'postgres';

import { initDbRepo, type DbClient } from '../../src/db/client.js';
import { parseEnv } from '../../src/migrate.js';
import type { AppContext } from '../../src/contract/Type.js';

export type Connection = {
  db: DbClient;
  end: () => Promise<void>;
};

export function getDb(): Connection {
  // Parse environment variables
  const dbEnv = parseEnv();

  // Connect to database
  const sql = postgres({
    host: dbEnv.DB_HOST,
    port: dbEnv.DB_PORT,
    username: dbEnv.DB_USER,
    password: dbEnv.DB_PASSWORD,
    database: dbEnv.DB_NAME,
  });

  const db = initDbRepo({ pgClient: sql });
  const end = () => sql.end();

  return { db, end };
}

export function getContext(db: DbClient, access: Access): AppContext {
  return { db, access };
}

export async function getUserAccess(db: DbClient, userId: string): Promise<Access> {
  const token = await createToken(db, userId);

  if (!token) {
    throw new Error('User not found for token');
  }

  const user = await findUserByToken(db, token.id);

  if (!user) {
    throw new Error('User not found for token');
  }

  const access: Access = {
    type: 'user',
    user,
  };

  return access;
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

export function getPublicAccess(): Access {
  const access: Access = {
    type: 'public',
  };

  return access;
}
