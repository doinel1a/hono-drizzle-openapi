import { serve } from '@hono/node-server';
import { OpenAPIHono } from '@hono/zod-openapi';

import { env } from './env';

const app = new OpenAPIHono();
app.get('/', (c) => c.text('Hello, World!'));

serve(
  {
    fetch: app.fetch,
    port: env.PORT
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
