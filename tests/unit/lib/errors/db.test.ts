import { createDatabaseError } from '~/tests/utils/db';
import { describe, expect, it } from 'vitest';

import {
  CONFLICT_CODE,
  INTERNAL_SERVER_ERROR_CODE,
  UNPROCESSABLE_ENTITY_CODE
} from '@/lib/constants/http-status-codes';
import DatabaseError from '@/lib/errors/db';

describe('DatabaseError.isKnownError', () => {
  it('returns true for a conflict error code (23505)', () => {
    expect(DatabaseError.isKnownError(createDatabaseError('23505'))).toBe(true);
  });

  it('returns true for unprocessable entity codes (23502, 23503, 23514)', () => {
    expect(DatabaseError.isKnownError(createDatabaseError('23502'))).toBe(true);
    expect(DatabaseError.isKnownError(createDatabaseError('23503'))).toBe(true);
    expect(DatabaseError.isKnownError(createDatabaseError('23514'))).toBe(true);
  });

  it('returns true for connection error codes', () => {
    expect(DatabaseError.isKnownError(createDatabaseError('ECONNREFUSED'))).toBe(true);
    expect(DatabaseError.isKnownError(createDatabaseError('ENOTFOUND'))).toBe(true);
    expect(DatabaseError.isKnownError(createDatabaseError('ETIMEDOUT'))).toBe(true);
    expect(DatabaseError.isKnownError(createDatabaseError('ECONNRESET'))).toBe(true);
    expect(DatabaseError.isKnownError(createDatabaseError('28P01'))).toBe(true);
    expect(DatabaseError.isKnownError(createDatabaseError('3D000'))).toBe(true);
  });

  it('returns false for an unknown error code', () => {
    expect(DatabaseError.isKnownError(createDatabaseError('99999'))).toBe(false);
  });

  it('returns false for a plain Error (not DrizzleQueryError)', () => {
    expect(DatabaseError.isKnownError(new Error('generic'))).toBe(false);
  });

  it('returns false for null', () => {
    expect(DatabaseError.isKnownError(null)).toBe(false);
  });
});

describe('DatabaseError.isConnectionError', () => {
  it('returns true for ECONNREFUSED', () => {
    expect(DatabaseError.isConnectionError(createDatabaseError('ECONNREFUSED'))).toBe(true);
  });

  it('returns false for a conflict code (not a connection error)', () => {
    expect(DatabaseError.isConnectionError(createDatabaseError('23505'))).toBe(false);
  });

  it('returns false for an unknown code', () => {
    expect(DatabaseError.isConnectionError(createDatabaseError('99999'))).toBe(false);
  });
});

describe('DatabaseError.isConflictError', () => {
  it('returns true for a duplicate unique constraint violation (23505)', () => {
    expect(DatabaseError.isConflictError(createDatabaseError('23505'))).toBe(true);
  });

  it('returns false for a connection error code', () => {
    expect(DatabaseError.isConflictError(createDatabaseError('ECONNREFUSED'))).toBe(false);
  });

  it('returns false for an unknown code', () => {
    expect(DatabaseError.isConflictError(createDatabaseError('99999'))).toBe(false);
  });
});

describe('DatabaseError.isUnprocessableEntityError', () => {
  it('returns true for a not-null constraint violation (23502)', () => {
    expect(DatabaseError.isUnprocessableEntityError(createDatabaseError('23502'))).toBe(true);
  });

  it('returns true for a foreign-key constraint violation (23503)', () => {
    expect(DatabaseError.isUnprocessableEntityError(createDatabaseError('23503'))).toBe(true);
  });

  it('returns true for a check constraint violation (23514)', () => {
    expect(DatabaseError.isUnprocessableEntityError(createDatabaseError('23514'))).toBe(true);
  });

  it('returns false for a conflict code', () => {
    expect(DatabaseError.isUnprocessableEntityError(createDatabaseError('23505'))).toBe(false);
  });
});

describe('DatabaseError constructor — status', () => {
  it('assigns 409 for a conflict error (23505)', () => {
    const error = new DatabaseError(createDatabaseError('23505'));
    expect(error.status).toBe(CONFLICT_CODE);
  });

  it('assigns 422 for an unprocessable entity error (23502)', () => {
    const error = new DatabaseError(createDatabaseError('23502'));
    expect(error.status).toBe(UNPROCESSABLE_ENTITY_CODE);
  });

  it('assigns 500 for a connection error (ECONNREFUSED)', () => {
    const error = new DatabaseError(createDatabaseError('ECONNREFUSED'));
    expect(error.status).toBe(INTERNAL_SERVER_ERROR_CODE);
  });

  it('assigns 500 for a plain Error (unknown cause)', () => {
    const error = new DatabaseError(new Error('generic'));
    expect(error.status).toBe(INTERNAL_SERVER_ERROR_CODE);
  });
});

describe('DatabaseError constructor — message', () => {
  it('uses the mapped message for a known code (23505)', () => {
    const error = new DatabaseError(createDatabaseError('23505'));
    expect(error.message).toBe('Database - Duplicate value violates unique constraint');
  });

  it('uses a fallback message for an unknown cause', () => {
    const error = new DatabaseError(new Error('generic'));
    expect(error.message).toBe('Database - Unknown error');
  });

  it('sets the name to "DatabaseError"', () => {
    const error = new DatabaseError(createDatabaseError('23505'));
    expect(error.name).toBe('DatabaseError');
  });
});
