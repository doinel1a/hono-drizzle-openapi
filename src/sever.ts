import { OpenAPIHono } from '@hono/zod-openapi';

const server = new OpenAPIHono();
server.get('/', (c) => c.text('Hello, World!'));

export default server;
