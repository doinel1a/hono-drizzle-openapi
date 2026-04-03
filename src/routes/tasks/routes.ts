import { createRoute, z } from '@hono/zod-openapi';
import { insertTasksSchema, patchTasksSchema, selectTasksSchema } from '~/drizzle/schemas/tasks';
import auth from '~/src/middlewares/auth';

import {
  CONFLICT_CODE,
  CREATED_CODE,
  INTERNAL_SERVER_ERROR_CODE,
  NO_CONTENT_CODE,
  NOT_FOUND_CODE,
  OK_CODE,
  UNAUTHORIZED_CODE,
  UNPROCESSABLE_ENTITY_CODE
} from '@/lib/constants/http-status-codes';
import {
  INTERNAL_SERVER_ERROR_PHRASE,
  UNAUTHORIZED_PHRASE
} from '@/lib/constants/http-status-phrases';
import createError from '@/lib/openapi/schemas/create-error';
import idParamsSchema from '@/lib/openapi/schemas/id-params';
import jsonContent from '@/lib/openapi/utils/json-content';
import jsonContentRequired from '@/lib/openapi/utils/json-content-required';

const tags = ['Tasks'];

export type TInsertRoute = typeof insert;
export const insert = createRoute({
  path: '/tasks',
  method: 'post',
  tags,
  middleware: [auth],
  security: [{ apiKeyCookie: [] }],
  request: {
    body: jsonContentRequired(insertTasksSchema, 'The task to insert')
  },
  responses: {
    [CREATED_CODE]: jsonContent(selectTasksSchema, 'The newly inserted task'),
    [CONFLICT_CODE]: jsonContent(z.object({ message: z.string() }), 'Database conflict(s)'),
    [UNAUTHORIZED_CODE]: jsonContent(z.object({ message: z.string() }), UNAUTHORIZED_PHRASE),
    [UNPROCESSABLE_ENTITY_CODE]: jsonContent(
      z.union([
        z.object({ message: z.string() }), // Database
        createError(insertTasksSchema) // Input validation
      ]),
      'Database validation OR input validation error(s)'
    ),
    [INTERNAL_SERVER_ERROR_CODE]: jsonContent(
      z.object({ message: z.string() }),
      INTERNAL_SERVER_ERROR_PHRASE
    )
  }
});

export type TSelectByIdRoute = typeof selectById;
export const selectById = createRoute({
  path: '/tasks/{id}',
  method: 'get',
  tags,
  middleware: [auth],
  security: [{ apiKeyCookie: [] }],
  request: {
    params: idParamsSchema
  },
  responses: {
    [OK_CODE]: jsonContent(selectTasksSchema, 'The selected task'),
    [UNAUTHORIZED_CODE]: jsonContent(z.object({ message: z.string() }), UNAUTHORIZED_PHRASE),
    [NOT_FOUND_CODE]: jsonContent(z.object({ message: z.string() }), 'Task not found'),
    [UNPROCESSABLE_ENTITY_CODE]: jsonContent(
      createError(idParamsSchema),
      'Parameter validation error'
    ),
    [INTERNAL_SERVER_ERROR_CODE]: jsonContent(
      z.object({ message: z.string() }),
      INTERNAL_SERVER_ERROR_PHRASE
    )
  }
});

export type TSelectAllRoute = typeof selectAll;
export const selectAll = createRoute({
  path: '/tasks',
  method: 'get',
  tags,
  middleware: [auth],
  security: [{ apiKeyCookie: [] }],
  responses: {
    [OK_CODE]: jsonContent(z.array(selectTasksSchema), 'All tasks'),
    [UNAUTHORIZED_CODE]: jsonContent(z.object({ message: z.string() }), UNAUTHORIZED_PHRASE),
    [INTERNAL_SERVER_ERROR_CODE]: jsonContent(
      z.object({ message: z.string() }),
      INTERNAL_SERVER_ERROR_PHRASE
    )
  }
});

export type TPatchRoute = typeof patch;
export const patch = createRoute({
  path: '/tasks/{id}',
  method: 'patch',
  tags,
  middleware: [auth],
  security: [{ apiKeyCookie: [] }],
  request: {
    params: idParamsSchema,
    body: jsonContentRequired(patchTasksSchema, 'The task to update')
  },
  responses: {
    [OK_CODE]: jsonContent(selectTasksSchema, 'The patched task'),
    [UNAUTHORIZED_CODE]: jsonContent(z.object({ message: z.string() }), UNAUTHORIZED_PHRASE),
    [NOT_FOUND_CODE]: jsonContent(z.object({ message: z.string() }), 'Task not found'),
    [UNPROCESSABLE_ENTITY_CODE]: jsonContent(
      z.union([
        createError(idParamsSchema), // Parameter validation
        createError(patchTasksSchema) // Input validation
      ]),
      'Parameter or input validation error(s)'
    ),
    [INTERNAL_SERVER_ERROR_CODE]: jsonContent(
      z.object({ message: z.string() }),
      INTERNAL_SERVER_ERROR_PHRASE
    )
  }
});

export type TDeleteByIdRoute = typeof deleteById;
export const deleteById = createRoute({
  path: '/tasks/{id}',
  method: 'delete',
  tags,
  middleware: [auth],
  security: [{ apiKeyCookie: [] }],
  request: {
    params: idParamsSchema
  },
  responses: {
    [NO_CONTENT_CODE]: {
      description: 'Task deleted successfully'
    },
    [UNAUTHORIZED_CODE]: jsonContent(z.object({ message: z.string() }), UNAUTHORIZED_PHRASE),
    [NOT_FOUND_CODE]: jsonContent(z.object({ message: z.string() }), 'Task not found'),
    [UNPROCESSABLE_ENTITY_CODE]: jsonContent(
      createError(idParamsSchema),
      'Parameter validation error'
    ),
    [INTERNAL_SERVER_ERROR_CODE]: jsonContent(
      z.object({ message: z.string() }),
      INTERNAL_SERVER_ERROR_PHRASE
    )
  }
});
