import db from '~/drizzle/db';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { openAPI } from 'better-auth/plugins';

import { env } from '../env';

const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    usePlural: true
  }),
  trustedOrigins: [env.ORIGIN],
  emailAndPassword: {
    enabled: true
  },
  plugins: [openAPI()]
});

export type TAuthSession = typeof auth.$Infer.Session;

export type TAuth =
  | { user: TAuthSession['user']; session: TAuthSession['session'] }
  | { user: null; session: null };

export default auth;
