/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { honoLogLayer } from '@loglayer/hono';
import { HTTPException } from 'hono/http-exception';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  INTERNAL_SERVER_ERROR_CODE,
  OK_CODE,
  UNAUTHORIZED_CODE
} from '@/lib/constants/http-status-codes';
import { UNAUTHORIZED_PHRASE } from '@/lib/constants/http-status-phrases';
import { createRouter } from '@/lib/init-server';
import authMiddleware from '@/middlewares/auth';
import logger from '@/middlewares/logger';
import onError from '@/middlewares/on-error';

const mockGetSession = vi.hoisted(() => vi.fn());
vi.mock('@/lib/auth', () => ({
  default: {
    api: { getSession: mockGetSession }
  }
}));

const mockSession = {
  session: { id: 'session-1', token: 'tok' },
  user: { id: 'user-1', name: 'Test User', email: 'test@example.com' }
};

function initApp() {
  const app = createRouter();
  app.use(honoLogLayer({ instance: logger }));
  app.onError(onError);
  app.get('/protected', authMiddleware, (c) =>
    c.json({ session: c.var.session, user: c.var.user }, OK_CODE)
  );

  return app;
}

beforeEach(() => {
  mockGetSession.mockReset();
});

describe('auth middleware — valid session', () => {
  it('calls next and sets session and user in context', async () => {
    mockGetSession.mockResolvedValue(mockSession);

    const response = await initApp().request('/protected');
    const body = await response.json();

    expect(response.status).toBe(OK_CODE);
    expect(body).toMatchObject({
      session: mockSession.session,
      user: mockSession.user
    });
  });
});

describe('auth middleware — null session', () => {
  it('returns 401 when getSession resolves to null', async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await initApp().request('/protected');
    const body = await response.json();

    expect(response.status).toBe(UNAUTHORIZED_CODE);
    expect(body).toEqual({ message: UNAUTHORIZED_PHRASE });
  });
});

describe('auth middleware — getSession throws HTTPException 401', () => {
  it('returns 401 when getSession throws an HTTPException with status 401', async () => {
    mockGetSession.mockRejectedValue(
      new HTTPException(UNAUTHORIZED_CODE, { message: UNAUTHORIZED_PHRASE })
    );

    const response = await initApp().request('/protected');
    const body = await response.json();

    expect(response.status).toBe(UNAUTHORIZED_CODE);
    expect(body).toEqual({ message: UNAUTHORIZED_PHRASE });
  });
});

describe('auth middleware — getSession throws generic error', () => {
  it('propagates the error to onError resulting in 500', async () => {
    mockGetSession.mockRejectedValue(new Error('unexpected failure'));

    const response = await initApp().request('/protected');

    expect(response.status).toBe(INTERNAL_SERVER_ERROR_CODE);
  });
});
