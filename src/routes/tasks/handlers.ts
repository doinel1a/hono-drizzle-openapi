import type { TDatabase, TRouteHandler } from '@/lib/types';
import type {
  TDeleteByIdRoute,
  TInsertRoute,
  TPatchRoute,
  TSelectAllRoute,
  TSelectByIdRoute
} from './routes';

import { tasksSchema } from '~/drizzle/schemas/tasks';
import { eq } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';

import {
  CREATED_CODE,
  NO_CONTENT_CODE,
  NOT_FOUND_CODE,
  OK_CODE,
  UNPROCESSABLE_ENTITY_CODE
} from '@/lib/constants/http-status-codes';
import { NOT_FOUND_PHRASE, UNPROCESSABLE_ENTITY_PHRASE } from '@/lib/constants/http-status-phrases';

export default function initHandlers(db: TDatabase) {
  const insert: TRouteHandler<TInsertRoute> = async (c) => {
    const body = c.req.valid('json');

    const [insertedTask] = await db.insert(tasksSchema).values(body).returning();

    return c.json(insertedTask, CREATED_CODE);
  };

  const selectById: TRouteHandler<TSelectByIdRoute> = async (c) => {
    const { id } = c.req.valid('param');

    const task = await db.query.tasks.findFirst({ where: eq(tasksSchema.id, id) });
    if (!task) {
      throw new HTTPException(NOT_FOUND_CODE, { message: NOT_FOUND_PHRASE });
    }

    return c.json(task, OK_CODE);
  };

  const selectAll: TRouteHandler<TSelectAllRoute> = async (c) => {
    const tasks = await db.query.tasks.findMany();

    return c.json(tasks, OK_CODE);
  };

  const patch: TRouteHandler<TPatchRoute> = async (c) => {
    const { id } = c.req.valid('param');
    const body = c.req.valid('json');
    if (Object.keys(body).length === 0) {
      throw new HTTPException(UNPROCESSABLE_ENTITY_CODE, { message: UNPROCESSABLE_ENTITY_PHRASE });
    }

    const [patchedTask] = await db
      .update(tasksSchema)
      .set(body)
      .where(eq(tasksSchema.id, id))
      .returning();

    if (!patchedTask) {
      throw new HTTPException(NOT_FOUND_CODE, { message: NOT_FOUND_PHRASE });
    }

    return c.json(patchedTask, OK_CODE);
  };

  const deleteById: TRouteHandler<TDeleteByIdRoute> = async (c) => {
    const { id } = c.req.valid('param');

    const [deletedTask] = await db.delete(tasksSchema).where(eq(tasksSchema.id, id)).returning();
    if (!deletedTask) {
      throw new HTTPException(NOT_FOUND_CODE, { message: NOT_FOUND_PHRASE });
    }

    return c.body(null, NO_CONTENT_CODE);
  };

  return { insert, selectById, selectAll, patch, deleteById };
}
