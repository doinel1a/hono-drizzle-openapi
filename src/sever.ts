import { OpenAPIHono } from '@hono/zod-openapi';

import notFound from './middlewares/not-found';

const server = new OpenAPIHono();
server.notFound(notFound);
server.get('/', (c) => c.text('Hello, World!'));

export default server;
