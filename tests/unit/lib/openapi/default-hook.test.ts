import { createRoute, z } from '@hono/zod-openapi';
import { describe, expect, it } from 'vitest';

import { OK_CODE, UNPROCESSABLE_ENTITY_CODE } from '@/lib/constants/http-status-codes';
import { createRouter } from '@/lib/init-server';
import jsonContent from '@/lib/openapi/utils/json-content';
import jsonContentRequired from '@/lib/openapi/utils/json-content-required';

const bodySchema = z.object({ foo: z.string().min(1) });

const validationRoute = createRoute({
  method: 'post',
  path: '/default-hook-validation',
  request: {
    body: jsonContentRequired(bodySchema, 'request body')
  },
  responses: {
    [OK_CODE]: jsonContent(z.object({ ok: z.literal(true) }), 'success'),
    [UNPROCESSABLE_ENTITY_CODE]: jsonContent(
      z.object({ message: z.string(), errors: z.array(z.unknown()) }),
      'validation error'
    )
  }
});

function initApp() {
  const app = createRouter();
  app.openapi(validationRoute, (c) => c.json({ ok: true as const }, OK_CODE));
  return app;
}

describe('default-hook — validation failure', () => {
  it('returns 422 with message "Validation failed"', async () => {
    const app = initApp();

    const response = await app.request('/default-hook-validation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ foo: '' })
    });

    expect(response.status).toBe(UNPROCESSABLE_ENTITY_CODE);
    const body = (await response.json()) as { message: string };
    expect(body.message).toBe('Validation failed');
  });

  it('returns errors array with field-level details', async () => {
    const app = initApp();

    const response = await app.request('/default-hook-validation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ foo: '' })
    });

    expect(response.status).toBe(UNPROCESSABLE_ENTITY_CODE);
    const body = (await response.json()) as { errors: unknown[] };
    expect(body.errors[0]).toMatchObject({ path: ['foo'] });
  });

  it('does not intercept successful validation', async () => {
    const app = initApp();

    const response = await app.request('/default-hook-validation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ foo: 'ok' })
    });

    expect(response.status).toBe(OK_CODE);
    const body = (await response.json()) as { ok: boolean };
    expect(body).toEqual({ ok: true });
  });
});
