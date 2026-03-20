import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { env } from '@/env';

import { tasks } from './schemas/tasks';

const pool = new Pool({
  connectionString: env.DATABASE_URL
});

const db = drizzle({ client: pool, schema: { tasks } });

export default db;
