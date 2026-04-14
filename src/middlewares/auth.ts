import type { TSession } from '../lib/auth';
import type { TServerBindings } from '../lib/types';

import { cors as honoCors } from 'hono/cors';
import { createMiddleware } from 'hono/factory';

import { env } from '../env';
import authConfig from '../lib/auth';
import { UNAUTHORIZED_CODE } from '../lib/constants/http-status-codes';
import { UNAUTHORIZED_PHRASE } from '../lib/constants/http-status-phrases';

const auth = createMiddleware<TServerBindings>(async (c, next) => {
  let session: TSession | null = null;

  try {
    session = await authConfig.api.getSession({ headers: c.req.raw.headers });
  } catch {
    return c.json({ message: UNAUTHORIZED_PHRASE }, UNAUTHORIZED_CODE);
  }

  if (!session) {
    c.set('session', null);
    c.set('user', null);

    return c.json({ message: UNAUTHORIZED_PHRASE }, UNAUTHORIZED_CODE);
  }

  c.set('session', session.session);
  c.set('user', session.user);

  return next();
});

export const cors = honoCors({
  origin: env.ORIGIN,
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['POST', 'GET', 'PATCH', 'DELETE', 'OPTIONS'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
  credentials: true
});

export default auth;
