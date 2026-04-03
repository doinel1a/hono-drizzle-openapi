import type { TRouteHandler } from '@/lib/types';
import type {
  TDeleteByIdRoute,
  TInsertRoute,
  TPatchRoute,
  TSelectAllRoute,
  TSelectByIdRoute
} from './routes';

import db from '~/drizzle/db';
import { tasksSchema } from '~/drizzle/schemas/tasks';
import { eq } from 'drizzle-orm';

import {
  CONFLICT_CODE,
  CREATED_CODE,
  INTERNAL_SERVER_ERROR_CODE,
  NO_CONTENT_CODE,
  NOT_FOUND_CODE,
  OK_CODE,
  UNPROCESSABLE_ENTITY_CODE
} from '@/lib/constants/http-status-codes';
import {
  INTERNAL_SERVER_ERROR_PHRASE,
  NOT_FOUND_PHRASE
} from '@/lib/constants/http-status-phrases';
import DatabaseError from '@/lib/errors/db';

export const insert: TRouteHandler<TInsertRoute> = async (c) => {
  const taskToInsert = c.req.valid('json');

  try {
    const [insertedTask] = await db.insert(tasksSchema).values(taskToInsert).returning();
    return c.json(insertedTask, CREATED_CODE);
  } catch (_error) {
    if (DatabaseError.isConnectionError(_error)) {
      const error = new DatabaseError(_error).message;
      return c.json({ message: error }, INTERNAL_SERVER_ERROR_CODE);
    }

    if (DatabaseError.isConflictError(_error)) {
      const error = new DatabaseError(_error).message;
      return c.json({ message: error }, CONFLICT_CODE);
    }

    if (DatabaseError.isUnprocessableEntityError(_error)) {
      const error = new DatabaseError(_error).message;
      return c.json({ message: error }, UNPROCESSABLE_ENTITY_CODE);
    }

    return c.json({ message: INTERNAL_SERVER_ERROR_PHRASE }, INTERNAL_SERVER_ERROR_CODE);
  }
};

export const selectById: TRouteHandler<TSelectByIdRoute> = async (c) => {
  const { id } = c.req.valid('param');

  try {
    const task = await db.query.tasks.findFirst({
      where: eq(tasksSchema.id, id)
    });

    if (!task) {
      return c.json({ message: NOT_FOUND_PHRASE }, NOT_FOUND_CODE);
    }

    return c.json(task, OK_CODE);
  } catch (_error) {
    if (DatabaseError.isConnectionError(_error)) {
      const error = new DatabaseError(_error).message;
      return c.json({ message: error }, INTERNAL_SERVER_ERROR_CODE);
    }

    return c.json({ message: INTERNAL_SERVER_ERROR_PHRASE }, INTERNAL_SERVER_ERROR_CODE);
  }
};

export const selectAll: TRouteHandler<TSelectAllRoute> = async (c) => {
  try {
    const tasks = await db.query.tasks.findMany();
    return c.json(tasks, OK_CODE);
  } catch (_error) {
    if (DatabaseError.isConnectionError(_error)) {
      const error = new DatabaseError(_error).message;
      return c.json({ message: error }, INTERNAL_SERVER_ERROR_CODE);
    }

    return c.json({ message: INTERNAL_SERVER_ERROR_PHRASE }, INTERNAL_SERVER_ERROR_CODE);
  }
};

export const patch: TRouteHandler<TPatchRoute> = async (c) => {
  const { id } = c.req.valid('param');
  const patch = c.req.valid('json');

  try {
    const taskToPatch = await db.query.tasks.findFirst({
      where: eq(tasksSchema.id, id)
    });

    if (!taskToPatch) {
      return c.json({ message: NOT_FOUND_PHRASE }, NOT_FOUND_CODE);
    }

    const [patchedTask] = await db
      .update(tasksSchema)
      .set(patch)
      .where(eq(tasksSchema.id, id))
      .returning();

    return c.json(patchedTask, OK_CODE);
  } catch (_error) {
    if (DatabaseError.isConnectionError(_error)) {
      const error = new DatabaseError(_error).message;
      return c.json({ message: error }, INTERNAL_SERVER_ERROR_CODE);
    }

    return c.json({ message: INTERNAL_SERVER_ERROR_PHRASE }, INTERNAL_SERVER_ERROR_CODE);
  }
};

export const deleteById: TRouteHandler<TDeleteByIdRoute> = async (c) => {
  const { id } = c.req.valid('param');

  try {
    const [deletedTask] = await db.delete(tasksSchema).where(eq(tasksSchema.id, id)).returning();
    if (!deletedTask) {
      return c.json({ message: NOT_FOUND_PHRASE }, NOT_FOUND_CODE);
    }

    return c.body(null, NO_CONTENT_CODE);
  } catch (_error) {
    if (DatabaseError.isConnectionError(_error)) {
      const error = new DatabaseError(_error).message;
      return c.json({ message: error }, INTERNAL_SERVER_ERROR_CODE);
    }

    return c.json({ message: INTERNAL_SERVER_ERROR_PHRASE }, INTERNAL_SERVER_ERROR_CODE);
  }
};
