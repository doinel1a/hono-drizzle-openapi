import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { env } from '@/env';

import * as authSchemas from './schemas/auth';
import { tasksSchema } from './schemas/tasks';

const pool = new Pool({
  connectionString: env.DATABASE_URL
});

const db = drizzle({
  client: pool,
  schema: {
    users: authSchemas.usersSchema,
    sessions: authSchemas.sessionsSchema,
    accounts: authSchemas.accountsSchema,
    verifications: authSchemas.verificationsSchema,
    tasks: tasksSchema
  }
});

export default db;
