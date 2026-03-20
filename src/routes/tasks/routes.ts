import { createRoute, z } from '@hono/zod-openapi';

import { OK_CODE } from '@/lib/constants/http-status-codes';
import jsonContent from '@/lib/openapi/utils/json-content';

const tags = ['Tasks'];

export type TListRoute = typeof list;
export const list = createRoute({
  path: '/tasks',
  method: 'get',
  tags,
  responses: {
    [OK_CODE]: jsonContent(
      z.array(
        z.object({
          name: z.string(),
          completed: z.boolean()
        })
      ),
      'List of tasks'
    )
  }
});
