import { createRoute, z } from '@hono/zod-openapi';

import { OK_CODE } from '@/lib/constants/http-status-codes';
import { OK_PHRASE } from '@/lib/constants/http-status-phrases';
import { createRouter } from '@/lib/init-server';

const router = createRouter().openapi(
  createRoute({
    method: 'get',
    path: '/',
    responses: {
      [OK_CODE]: {
        content: {
          'application/json': {
            schema: z.object({
              message: z.string()
            })
          }
        },
        description: OK_PHRASE
      }
    }
  }),
  (c) => {
    return c.json(
      {
        message: 'Hello, World!'
      },
      OK_CODE
    );
  }
);

export default router;
