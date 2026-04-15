/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { describe, expect, it } from 'vitest';

import { NOT_FOUND_CODE } from '@/lib/constants/http-status-codes';
import { NOT_FOUND_PHRASE } from '@/lib/constants/http-status-phrases';
import { createRouter } from '@/lib/init-server';
import notFound from '@/middlewares/not-found';

function initApp() {
  const app = createRouter();
  app.notFound(notFound);

  return app;
}

describe('notFound middleware', () => {
  it('returns 404 for an unregistered route', async () => {
    const app = initApp();

    const response = await app.request('/unknown');

    expect(response.status).toBe(NOT_FOUND_CODE);
  });

  it('includes the requested path in the message', async () => {
    const app = initApp();

    const response = await app.request('/unknown');
    const body = await response.json();

    expect(body).toEqual({ message: `${NOT_FOUND_PHRASE} - /unknown` });
  });

  it('reflects the exact path in the message for nested routes', async () => {
    const app = initApp();

    const response = await app.request('/api/tasks/999');
    const body = await response.json();

    expect(body).toEqual({ message: `${NOT_FOUND_PHRASE} - /api/tasks/999` });
  });

  it('does not trigger for registered routes', async () => {
    const app = initApp();
    app.get('/health', (c) => c.json({ ok: true }, 200));

    const response = await app.request('/health');

    expect(response.status).not.toBe(NOT_FOUND_CODE);
  });
});
