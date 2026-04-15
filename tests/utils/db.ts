import path from 'node:path';

import { PGlite } from '@electric-sql/pglite';
import schema from '~/drizzle/schemas';
import { DrizzleQueryError } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/pglite';
import { migrate } from 'drizzle-orm/pglite/migrator';

export async function initTestDatabase() {
  const client = new PGlite();
  const db = drizzle(client, { schema });

  await migrate(db, {
    migrationsFolder: path.resolve(__dirname, '../../drizzle/migrations')
  });

  return {
    db,
    truncate: async () => {
      await client.exec(
        'TRUNCATE TABLE tasks, verifications, accounts, sessions, users RESTART IDENTITY CASCADE;'
      );
    },
    close: async () => {
      await client.close();
    }
  };
}

export function createDatabaseError(code: string) {
  const cause = Object.assign(new Error(code), { code });
  return new DrizzleQueryError('SELECT 1', [], cause);
}
