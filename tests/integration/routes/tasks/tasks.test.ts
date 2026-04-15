/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { tasksSchema } from '~/drizzle/schemas/tasks';
import { initTestApp, mockSession } from '~/tests/utils/app';
import { initTestDatabase } from '~/tests/utils/db';
import { eq } from 'drizzle-orm';
import { testClient } from 'hono/testing';
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  CREATED_CODE,
  NO_CONTENT_CODE,
  NOT_FOUND_CODE,
  OK_CODE,
  UNAUTHORIZED_CODE,
  UNPROCESSABLE_ENTITY_CODE
} from '@/lib/constants/http-status-codes';
import { NOT_FOUND_PHRASE, UNPROCESSABLE_ENTITY_PHRASE } from '@/lib/constants/http-status-phrases';

const mockGetSession = vi.hoisted(() => vi.fn());
vi.mock('@/lib/auth', () => ({
  default: {
    api: { getSession: mockGetSession }
  }
}));

const { db, truncate, close } = await initTestDatabase();

beforeEach(async () => {
  await truncate();
  mockGetSession.mockResolvedValue(mockSession);
});

afterAll(() => close());

async function seedTask(name: string, done = false) {
  const [task] = await db.insert(tasksSchema).values({ name, done }).returning();
  return task;
}

describe('POST /api/tasks', () => {
  it('inserts a task and returns it with 201', async () => {
    const client = testClient(initTestApp(db));

    const response = await client.api.tasks.$post({
      json: { name: 'Write first TDD test', done: false }
    });

    expect(response.status).toBe(CREATED_CODE);
    if (response.status === CREATED_CODE) {
      const body = await response.json();
      expect(body.name).toBe('Write first TDD test');
      expect(body.done).toBe(false);
      expect(body.id).toBeTypeOf('number');
    }
  });

  it('persists the inserted task to the database', async () => {
    const client = testClient(initTestApp(db));

    await client.api.tasks.$post({
      json: { name: 'Persisted task', done: true }
    });

    const rows = await db.query.tasks.findMany();
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ name: 'Persisted task', done: true });
  });

  it('sets createdAt and updatedAt automatically on insert', async () => {
    const client = testClient(initTestApp(db));

    await client.api.tasks.$post({
      json: { name: 'Timestamp task', done: false }
    });

    const [row] = await db.query.tasks.findMany();
    expect(row!.createdAt).toBeInstanceOf(Date);
    expect(row!.updatedAt).toBeInstanceOf(Date);
  });

  it('returns 422 when name is an empty string', async () => {
    const client = testClient(initTestApp(db));

    const response = await client.api.tasks.$post({
      json: { name: '', done: false }
    });

    expect(response.status).toBe(UNPROCESSABLE_ENTITY_CODE);
    if (response.status === UNPROCESSABLE_ENTITY_CODE) {
      const body = await response.json();
      expect(body).toHaveProperty('message', 'Validation failed');
      expect(body).toHaveProperty('errors');
    }
  });

  it('returns 422 when name exceeds 255 characters', async () => {
    const client = testClient(initTestApp(db));

    const response = await client.api.tasks.$post({
      json: { name: 'a'.repeat(256), done: false }
    });

    expect(response.status).toBe(UNPROCESSABLE_ENTITY_CODE);
  });
});

describe('GET /api/tasks', () => {
  it('returns an empty array when no tasks exist', async () => {
    const client = testClient(initTestApp(db));

    const response = await client.api.tasks.$get();

    expect(response.status).toBe(OK_CODE);
    if (response.status === OK_CODE) {
      const body = await response.json();
      expect(body).toEqual([]);
    }
  });

  it('returns all seeded tasks', async () => {
    await seedTask('Task A', false);
    await seedTask('Task B', true);
    const client = testClient(initTestApp(db));

    const response = await client.api.tasks.$get();

    expect(response.status).toBe(OK_CODE);
    if (response.status === OK_CODE) {
      const body = await response.json();
      expect(body).toHaveLength(2);
      expect(body.map((task) => task.name).sort((a, b) => a.localeCompare(b))).toEqual([
        'Task A',
        'Task B'
      ]);
    }
  });
});

describe('GET /api/tasks/:id', () => {
  it('returns the task when it exists', async () => {
    const seeded = await seedTask('Findable task');
    const client = testClient(initTestApp(db));

    const response = await client.api.tasks[':id'].$get({
      param: { id: String(seeded!.id) }
    });

    expect(response.status).toBe(OK_CODE);
    if (response.status === OK_CODE) {
      const body = await response.json();
      expect(body).toMatchObject({ id: seeded!.id, name: 'Findable task' });
    }
  });

  it('returns 404 when the task does not exist', async () => {
    const client = testClient(initTestApp(db));

    const response = await client.api.tasks[':id'].$get({
      param: { id: '9999' }
    });

    expect(response.status).toBe(NOT_FOUND_CODE);
    if (response.status === NOT_FOUND_CODE) {
      const body = await response.json();
      expect(body).toEqual({ message: NOT_FOUND_PHRASE });
    }
  });

  it('returns 422 when id is not a valid number', async () => {
    const client = testClient(initTestApp(db));

    const response = await client.api.tasks[':id'].$get({
      param: { id: 'not-a-number' }
    });

    expect(response.status).toBe(UNPROCESSABLE_ENTITY_CODE);
  });
});

describe('PATCH /api/tasks/:id', () => {
  it('updates the name and returns the patched task', async () => {
    const seeded = await seedTask('Original name');
    const client = testClient(initTestApp(db));

    const response = await client.api.tasks[':id'].$patch({
      param: { id: String(seeded!.id) },
      json: { name: 'Updated name' }
    });

    expect(response.status).toBe(OK_CODE);
    if (response.status === OK_CODE) {
      const body = await response.json();
      expect(body).toMatchObject({ id: seeded!.id, name: 'Updated name', done: false });
    }
  });

  it('supports partial updates (only done)', async () => {
    const seeded = await seedTask('Keep the name', false);
    const client = testClient(initTestApp(db));

    const response = await client.api.tasks[':id'].$patch({
      param: { id: String(seeded!.id) },
      json: { done: true }
    });

    expect(response.status).toBe(OK_CODE);
    if (response.status === OK_CODE) {
      const body = await response.json();
      expect(body).toMatchObject({ name: 'Keep the name', done: true });
    }
  });

  it('persists the update to the database', async () => {
    const seeded = await seedTask('Will be updated');
    const client = testClient(initTestApp(db));

    await client.api.tasks[':id'].$patch({
      param: { id: String(seeded!.id) },
      json: { name: 'After update' }
    });

    const [row] = await db.query.tasks.findMany({ where: eq(tasksSchema.id, seeded!.id) });
    expect(row?.name).toBe('After update');
  });

  it('updates updatedAt timestamp after patch', async () => {
    const seeded = await seedTask('Timestamp check');
    const [beforePatch] = await db.query.tasks.findMany({
      where: eq(tasksSchema.id, seeded!.id)
    });
    const originalUpdatedAt = beforePatch!.updatedAt;

    await new Promise((r) => setTimeout(r, 10));

    const client = testClient(initTestApp(db));
    await client.api.tasks[':id'].$patch({
      param: { id: String(seeded!.id) },
      json: { name: 'After patch' }
    });

    const [row] = await db.query.tasks.findMany({ where: eq(tasksSchema.id, seeded!.id) });
    expect(row!.updatedAt).toBeInstanceOf(Date);
    expect(row!.updatedAt!.getTime()).toBeGreaterThan(originalUpdatedAt!.getTime());
  });

  it('returns 422 when body is empty', async () => {
    const seeded = await seedTask('Unchanged task', false);
    const client = testClient(initTestApp(db));

    const response = await client.api.tasks[':id'].$patch({
      param: { id: String(seeded!.id) },
      json: {}
    });

    expect(response.status).toBe(UNPROCESSABLE_ENTITY_CODE);
    if (response.status === UNPROCESSABLE_ENTITY_CODE) {
      const body = await response.json();
      expect(body).toHaveProperty('message', UNPROCESSABLE_ENTITY_PHRASE);
    }
  });

  it('returns 404 when the task does not exist', async () => {
    const client = testClient(initTestApp(db));

    const response = await client.api.tasks[':id'].$patch({
      param: { id: '9999' },
      json: { name: 'ghost' }
    });

    expect(response.status).toBe(NOT_FOUND_CODE);
  });

  it('returns 422 when name is an empty string', async () => {
    const seeded = await seedTask('Original');
    const client = testClient(initTestApp(db));

    const response = await client.api.tasks[':id'].$patch({
      param: { id: String(seeded!.id) },
      json: { name: '' }
    });

    expect(response.status).toBe(UNPROCESSABLE_ENTITY_CODE);
    if (response.status === UNPROCESSABLE_ENTITY_CODE) {
      const body = await response.json();
      expect(body).toHaveProperty('message', 'Validation failed');
      expect(body).toHaveProperty('errors');
    }
  });

  it('returns 422 when name exceeds 255 characters', async () => {
    const seeded = await seedTask('Original');
    const client = testClient(initTestApp(db));

    const response = await client.api.tasks[':id'].$patch({
      param: { id: String(seeded!.id) },
      json: { name: 'a'.repeat(256) }
    });

    expect(response.status).toBe(UNPROCESSABLE_ENTITY_CODE);
  });

  it('returns 422 when id is not a valid number', async () => {
    const client = testClient(initTestApp(db));

    const response = await client.api.tasks[':id'].$patch({
      param: { id: 'not-a-number' },
      json: { name: 'irrelevant' }
    });

    expect(response.status).toBe(UNPROCESSABLE_ENTITY_CODE);
  });
});

describe('DELETE /api/tasks/:id', () => {
  it('deletes the task and returns 204', async () => {
    const seeded = await seedTask('Delete me');
    const client = testClient(initTestApp(db));

    const response = await client.api.tasks[':id'].$delete({
      param: { id: String(seeded!.id) }
    });

    expect(response.status).toBe(NO_CONTENT_CODE);
  });

  it('removes the task from the database', async () => {
    const seeded = await seedTask('Will disappear');
    const client = testClient(initTestApp(db));

    await client.api.tasks[':id'].$delete({
      param: { id: String(seeded!.id) }
    });

    const rows = await db.query.tasks.findMany({ where: eq(tasksSchema.id, seeded!.id) });
    expect(rows).toEqual([]);
  });

  it('returns 404 when the task does not exist', async () => {
    const client = testClient(initTestApp(db));

    const response = await client.api.tasks[':id'].$delete({
      param: { id: '9999' }
    });

    expect(response.status).toBe(NOT_FOUND_CODE);
  });

  it('returns 422 when id is not a valid number', async () => {
    const client = testClient(initTestApp(db));

    const response = await client.api.tasks[':id'].$delete({
      param: { id: 'not-a-number' }
    });

    expect(response.status).toBe(UNPROCESSABLE_ENTITY_CODE);
  });
});

describe('tasks routes — auth wiring', () => {
  it('returns 401 on GET /api/tasks when there is no session', async () => {
    mockGetSession.mockResolvedValue(null);
    const client = testClient(initTestApp(db));

    const response = await client.api.tasks.$get();

    expect(response.status).toBe(UNAUTHORIZED_CODE);
  });

  it('returns 401 on GET /api/tasks/:id when there is no session', async () => {
    mockGetSession.mockResolvedValue(null);
    const client = testClient(initTestApp(db));

    const response = await client.api.tasks[':id'].$get({
      param: { id: '1' }
    });

    expect(response.status).toBe(UNAUTHORIZED_CODE);
  });

  it('returns 401 on POST /api/tasks when there is no session', async () => {
    mockGetSession.mockResolvedValue(null);
    const client = testClient(initTestApp(db));

    const response = await client.api.tasks.$post({
      json: { name: 'Unauthorized task', done: false }
    });

    expect(response.status).toBe(UNAUTHORIZED_CODE);
  });

  it('returns 401 on PATCH /api/tasks/:id when there is no session', async () => {
    mockGetSession.mockResolvedValue(null);
    const client = testClient(initTestApp(db));

    const response = await client.api.tasks[':id'].$patch({
      param: { id: '1' },
      json: { name: 'Ghost patch' }
    });

    expect(response.status).toBe(UNAUTHORIZED_CODE);
  });

  it('returns 401 on DELETE /api/tasks/:id when there is no session', async () => {
    mockGetSession.mockResolvedValue(null);
    const client = testClient(initTestApp(db));

    const response = await client.api.tasks[':id'].$delete({
      param: { id: '1' }
    });

    expect(response.status).toBe(UNAUTHORIZED_CODE);
  });
});
