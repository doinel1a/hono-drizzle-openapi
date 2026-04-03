import type { TServerBindings } from './types';

import { OpenAPIHono } from '@hono/zod-openapi';
import { honoLogLayer } from '@loglayer/hono';

import defaultHook from '@/lib/openapi/default-hook';
import { cors } from '@/middlewares/auth';
import logger from '@/middlewares/logger';
import notFound from '@/middlewares/not-found';
import onError from '@/middlewares/on-error';

import auth from './auth';

export default function initServer() {
  const server = createRouter().basePath('/api');
  server.use(cors);
  server.use(
    honoLogLayer({
      instance: logger,
      autoLogging: {
        request: { logLevel: 'debug' },
        response: { logLevel: 'info' }
      }
    })
  );
  server.notFound(notFound);
  server.onError(onError);

  server.on(['POST', 'GET'], '/auth/*', (c) => auth.handler(c.req.raw));

  return server;
}

export function createRouter() {
  return new OpenAPIHono<TServerBindings>({ strict: false, defaultHook });
}
