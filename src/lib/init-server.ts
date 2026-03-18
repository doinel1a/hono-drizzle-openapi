import { OpenAPIHono } from '@hono/zod-openapi';
import { honoLogLayer } from '@loglayer/hono';

import logger from '@/middlewares/logger';
import notFound from '@/middlewares/not-found';
import onError from '@/middlewares/on-error';

export default function initServer() {
  const server = new OpenAPIHono({ strict: false });
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

  return server;
}
