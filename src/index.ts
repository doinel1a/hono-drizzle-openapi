import { serve } from '@hono/node-server';

import { env } from './env';
import server from './server';

serve(
  {
    fetch: server.fetch,
    port: env.PORT
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
