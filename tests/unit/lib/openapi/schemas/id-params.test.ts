import { describe, expect, it } from 'vitest';

import idParametersSchema from '@/lib/openapi/schemas/id-params';

describe('idParametersSchema — valid inputs', () => {
  it('coerces a numeric string to a number', () => {
    const result = idParametersSchema.safeParse({ id: '123' });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.id).toBe(123);
    }
  });

  it('accepts a plain positive integer', () => {
    const result = idParametersSchema.safeParse({ id: 42 });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.id).toBe(42);
    }
  });
});

describe('idParametersSchema — invalid inputs', () => {
  it('rejects a non-numeric string', () => {
    const result = idParametersSchema.safeParse({ id: 'abc' });

    expect(result.success).toBe(false);
  });

  it('rejects an alphanumeric string', () => {
    const result = idParametersSchema.safeParse({ id: '12abc' });

    expect(result.success).toBe(false);
  });

  it('rejects an empty string', () => {
    const result = idParametersSchema.safeParse({ id: '' });

    expect(result.success).toBe(false);
  });

  it('rejects null', () => {
    const result = idParametersSchema.safeParse({ id: null });

    expect(result.success).toBe(false);
  });

  it('rejects undefined (missing id field)', () => {
    const result = idParametersSchema.safeParse({});

    expect(result.success).toBe(false);
  });

  it('rejects zero (not a valid DB id)', () => {
    const result = idParametersSchema.safeParse({ id: '0' });

    expect(result.success).toBe(false);
  });

  it('rejects a negative numeric string', () => {
    const result = idParametersSchema.safeParse({ id: '-5' });

    expect(result.success).toBe(false);
  });

  it('rejects a float string', () => {
    const result = idParametersSchema.safeParse({ id: '1.5' });

    expect(result.success).toBe(false);
  });
});

describe('idParametersSchema — parse output type', () => {
  it('returns id as a number type after coercion', () => {
    const result = idParametersSchema.parse({ id: '99' });

    expect(typeof result.id).toBe('number');
  });
});
