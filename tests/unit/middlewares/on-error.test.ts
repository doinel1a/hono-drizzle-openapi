/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { honoLogLayer } from '@loglayer/hono';
import { createDatabaseError } from '~/tests/utils/db';
import { HTTPException } from 'hono/http-exception';
import { describe, expect, it } from 'vitest';

import {
  CONFLICT_CODE,
  INTERNAL_SERVER_ERROR_CODE,
  NOT_FOUND_CODE,
  UNAUTHORIZED_CODE,
  UNPROCESSABLE_ENTITY_CODE
} from '@/lib/constants/http-status-codes';
import { NOT_FOUND_PHRASE, UNAUTHORIZED_PHRASE } from '@/lib/constants/http-status-phrases';
import { createRouter } from '@/lib/init-server';
import logger from '@/middlewares/logger';
import onError from '@/middlewares/on-error';

function initApp() {
  const app = createRouter();
  app.use(honoLogLayer({ instance: logger }));
  app.onError(onError);

  return app;
}

describe('onError — known DatabaseError', () => {
  it('returns 409 with mapped message for a conflict error (23505)', async () => {
    const app = initApp();
    app.get('/test', () => {
      throw createDatabaseError('23505');
    });

    const response = await app.request('/test');
    const body = await response.json();

    expect(response.status).toBe(CONFLICT_CODE);
    expect(body).toEqual({ message: 'Database - Duplicate value violates unique constraint' });
  });

  it('returns 422 with mapped message for an unprocessable entity error (23502)', async () => {
    const app = initApp();
    app.get('/test', () => {
      throw createDatabaseError('23502');
    });

    const response = await app.request('/test');
    const body = await response.json();

    expect(response.status).toBe(UNPROCESSABLE_ENTITY_CODE);
    expect(body).toEqual({ message: 'Database - Not null constraint violation' });
  });

  it('returns 500 with mapped message for a connection error (ECONNREFUSED)', async () => {
    const app = initApp();
    app.get('/test', () => {
      throw createDatabaseError('ECONNREFUSED');
    });

    const response = await app.request('/test');
    const body = await response.json();

    expect(response.status).toBe(INTERNAL_SERVER_ERROR_CODE);
    expect(body).toEqual({ message: 'Database connection refused' });
  });
});

describe('onError — HTTPException', () => {
  it('returns the exception status and message for 401', async () => {
    const app = initApp();
    app.get('/test', () => {
      throw new HTTPException(UNAUTHORIZED_CODE, { message: UNAUTHORIZED_PHRASE });
    });

    const response = await app.request('/test');
    const body = await response.json();

    expect(response.status).toBe(UNAUTHORIZED_CODE);
    expect(body).toEqual({ message: UNAUTHORIZED_PHRASE });
  });

  it('returns the exception status and message for 404', async () => {
    const app = initApp();
    app.get('/test', () => {
      throw new HTTPException(NOT_FOUND_CODE, { message: NOT_FOUND_PHRASE });
    });

    const response = await app.request('/test');
    const body = await response.json();

    expect(response.status).toBe(NOT_FOUND_CODE);
    expect(body).toEqual({ message: NOT_FOUND_PHRASE });
  });
});

describe('onError — generic Error', () => {
  it('returns 500 with message and stack in non-production', async () => {
    const app = initApp();
    app.get('/test', () => {
      throw new Error('something went wrong');
    });

    const response = await app.request('/test');
    const body = (await response.json()) as { message: string; stack?: string };

    expect(response.status).toBe(INTERNAL_SERVER_ERROR_CODE);
    expect(body.message).toBe('something went wrong');
    expect(body.stack).toBeDefined();
  });
});
