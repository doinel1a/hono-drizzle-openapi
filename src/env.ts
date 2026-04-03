import { createEnv } from '@t3-oss/env-core';
import { config } from 'dotenv';
import { z } from 'zod';

config();

export const env = createEnv({
  server: {
    PORT: z.coerce.number(),
    ORIGIN: z.url(),
    DATABASE_URL: z.url(),
    BETTER_AUTH_URL: z.url(),
    BETTER_AUTH_SECRET: z.string().min(32),
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development')
  },
  runtimeEnvStrict: {
    PORT: process.env['PORT'],
    ORIGIN: process.env['ORIGIN'],
    DATABASE_URL: process.env['DATABASE_URL'],
    BETTER_AUTH_URL: process.env['BETTER_AUTH_URL'],
    BETTER_AUTH_SECRET: process.env['BETTER_AUTH_SECRET'],
    NODE_ENV: process.env['NODE_ENV']
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
   * This is especially useful for Docker builds.
   */
  skipValidation: process.env['SKIP_ENV_VALIDATION'] !== '',
  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true
});
