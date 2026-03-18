import { OpenAPIHono } from '@hono/zod-openapi';

import notFound from './middlewares/not-found';
import onError from './middlewares/on-error';

const server = new OpenAPIHono();
server.notFound(notFound);
server.onError(onError);
server.get('/', (c) => c.text('Hello, World!'));

export default server;
