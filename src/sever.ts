import { OpenAPIHono } from '@hono/zod-openapi';
import { honoLogLayer } from '@loglayer/hono';

import logger from './middlewares/logger';
import notFound from './middlewares/not-found';
import onError from './middlewares/on-error';

const server = new OpenAPIHono();
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

server.get('/', (c) => c.text('Hello, World!'));

export default server;
