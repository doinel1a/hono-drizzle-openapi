import { serve } from '@hono/node-server';

import { env } from './env';
import server from './sever';

serve(
  {
    fetch: server.fetch,
    port: env.PORT
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
